import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { Fleet } from "@/models/Fleet";
import { getDealershipScope } from "@/lib/getDealershipScope";

export const runtime = "nodejs";

/**
 * GET /api/bookings/[id] — Get a single booking with full details
 */
export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();

    const booking = await Booking.findOne({ _id: params.id, ...scopeFilter })
      .populate("fleet")
      .populate("renter")
      .populate("agent", "fullName email")
      .lean();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (err) {
    console.error("GET /api/bookings/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch booking." }, { status: 500 });
  }
}

/**
 * PUT /api/bookings/[id] — Update booking details or status
 * Handles status transitions and fleet vehicle status updates
 */
export async function PUT(req, { params }) {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();
    const body = await req.json();

    const existingBooking = await Booking.findOne({ _id: params.id, ...scopeFilter });
    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const oldStatus = existingBooking.status;
    const newStatus = body.status || oldStatus;

    // Handle pickup (pending/confirmed → active)
    if (newStatus === "active" && (oldStatus === "pending" || oldStatus === "confirmed")) {
      body.actualPickupDate = body.actualPickupDate || new Date();
      await Fleet.findByIdAndUpdate(existingBooking.fleet, { status: "rented" });
    }

    // Handle return (active/overdue → completed)
    if (newStatus === "completed" && (oldStatus === "active" || oldStatus === "overdue")) {
      body.actualReturnDate = body.actualReturnDate || new Date();
      await Fleet.findByIdAndUpdate(existingBooking.fleet, { status: "available" });

      // Calculate late fee if returned after scheduled returnDate
      if (body.actualReturnDate && existingBooking.returnDate) {
        const actual = new Date(body.actualReturnDate);
        const scheduled = new Date(existingBooking.returnDate);
        if (actual > scheduled) {
          const lateDays = Math.ceil((actual - scheduled) / (1000 * 60 * 60 * 24));
          // Late fee can be overridden in body, otherwise auto-calculate
          if (!body.lateFee && existingBooking.rateAmount) {
            body.lateFee = lateDays * existingBooking.rateAmount;
          }
        }
      }

      // Update fleet mileage if returnMileage is provided
      if (body.returnMileage) {
        await Fleet.findByIdAndUpdate(existingBooking.fleet, {
          mileage: body.returnMileage,
        });
      }
    }

    // Handle cancellation
    if (newStatus === "cancelled" && oldStatus !== "completed") {
      await Fleet.findByIdAndUpdate(existingBooking.fleet, { status: "available" });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: params.id, ...scopeFilter },
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate("fleet", "title carMake model year images licensePlate")
      .populate("renter", "fullName email phoneNumber");

    return NextResponse.json({ booking });
  } catch (err) {
    console.error("PUT /api/bookings/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update booking." },
      { status: 500 }
    );
  }
}
