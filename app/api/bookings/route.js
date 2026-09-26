import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { Fleet } from "@/models/Fleet";
import { getDealershipScope, getDealershipId } from "@/lib/getDealershipScope";

export const runtime = "nodejs";

/**
 * GET /api/bookings — List all bookings
 * Supports: ?status=active&fleet=<id>&renter=<id>
 */
export async function GET(req) {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();
    const { searchParams } = new URL(req.url);

    const filter = { ...scopeFilter };

    const status = searchParams.get("status");
    if (status) filter.status = status;

    const fleetId = searchParams.get("fleet");
    if (fleetId) filter.fleet = fleetId;

    const renterId = searchParams.get("renter");
    if (renterId) filter.renter = renterId;

    const bookings = await Booking.find(filter)
      .populate("fleet", "title carMake model year images licensePlate dailyRate")
      .populate("renter", "fullName email phoneNumber")
      .populate("agent", "fullName")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("GET /api/bookings error:", err);
    return NextResponse.json({ error: "Failed to fetch bookings." }, { status: 500 });
  }
}

/**
 * POST /api/bookings — Create a new booking
 * Also sets the fleet vehicle status to 'reserved'
 */
export async function POST(req) {
  try {
    await connectMongoDB();
    const dealershipId = await getDealershipId();
    if (!dealershipId) {
      return NextResponse.json({ error: "No dealership context." }, { status: 403 });
    }

    const body = await req.json();

    // Check vehicle availability
    const vehicle = await Fleet.findById(body.fleet);
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
    }
    if (vehicle.status !== "available") {
      return NextResponse.json(
        { error: `Vehicle is currently ${vehicle.status}.` },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const overlap = await Booking.findOne({
      fleet: body.fleet,
      status: { $in: ["pending", "confirmed", "active"] },
      $or: [
        {
          pickupDate: { $lt: new Date(body.returnDate) },
          returnDate: { $gt: new Date(body.pickupDate) },
        },
      ],
    });
    if (overlap) {
      return NextResponse.json(
        { error: "Vehicle is already booked for the selected dates." },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      ...body,
      dealershipId,
    });

    // Mark vehicle as reserved
    await Fleet.findByIdAndUpdate(body.fleet, { status: "reserved" });

    const populated = await Booking.findById(booking._id)
      .populate("fleet", "title carMake model year images licensePlate")
      .populate("renter", "fullName email phoneNumber")
      .lean();

    return NextResponse.json({ booking: populated }, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookings error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create booking." },
      { status: 500 }
    );
  }
}
