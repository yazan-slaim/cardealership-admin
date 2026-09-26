import { connectMongoDB } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { Fleet } from "@/models/Fleet";
import { Client } from "@/models/Client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDealershipScope } from "@/lib/getDealershipScope";
import BookingsPage from "@/components/bookings/BookingsPage";

export default async function BookingsPageRoute() {
  await connectMongoDB();

  const session = await getServerSession(authOptions);
  const scopeFilter = await getDealershipScope(session);

  const bookings = await Booking.find(scopeFilter)
    .populate("fleet", "title carMake model year images licensePlate dailyRate")
    .populate("renter", "fullName email phoneNumber")
    .populate("agent", "fullName")
    .sort({ createdAt: -1 })
    .lean();

  const serialized = bookings.map((b) => ({
    ...b,
    _id: b._id.toString(),
    fleet: b.fleet ? { ...b.fleet, _id: b.fleet._id.toString() } : null,
    renter: b.renter ? { ...b.renter, _id: b.renter._id.toString() } : null,
    agent: b.agent ? { ...b.agent, _id: b.agent._id.toString() } : null,
    createdAt: b.createdAt?.toISOString(),
    pickupDate: b.pickupDate?.toISOString(),
    returnDate: b.returnDate?.toISOString(),
    actualPickupDate: b.actualPickupDate?.toISOString() || null,
    actualReturnDate: b.actualReturnDate?.toISOString() || null,
  }));

  // Also fetch available vehicles + customers for the "new booking" form
  const availableVehicles = await Fleet.find({ ...scopeFilter, isActive: true, status: "available" })
    .select("title carMake model year dailyRate weeklyRate monthlyRate images licensePlate")
    .lean();

  const customers = await Client.find(scopeFilter)
    .select("fullName email phoneNumber")
    .sort({ fullName: 1 })
    .lean();

  const serializedVehicles = availableVehicles.map((v) => ({
    ...v,
    _id: v._id.toString(),
  }));

  const serializedCustomers = customers.map((c) => ({
    ...c,
    _id: c._id.toString(),
  }));

  return (
    <BookingsPage
      bookings={serialized}
      availableVehicles={serializedVehicles}
      customers={serializedCustomers}
    />
  );
}
