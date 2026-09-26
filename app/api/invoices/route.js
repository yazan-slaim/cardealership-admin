import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Invoice } from "@/models/Invoice";
import { Booking } from "@/models/Booking";
import { getDealershipScope, getDealershipId } from "@/lib/getDealershipScope";

export const runtime = "nodejs";

/**
 * GET /api/invoices — List all invoices
 * Supports: ?status=paid&renter=<id>
 */
export async function GET(req) {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();
    const { searchParams } = new URL(req.url);

    const filter = { ...scopeFilter };

    const status = searchParams.get("status");
    if (status) filter.status = status;

    const renterId = searchParams.get("renter");
    if (renterId) filter.renter = renterId;

    const invoices = await Invoice.find(filter)
      .populate("booking", "bookingNumber pickupDate returnDate totalAmount status")
      .populate("renter", "fullName email phoneNumber")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ invoices }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("GET /api/invoices error:", err);
    return NextResponse.json({ error: "Failed to fetch invoices." }, { status: 500 });
  }
}

/**
 * POST /api/invoices — Create an invoice (usually auto-generated on booking return)
 */
export async function POST(req) {
  try {
    await connectMongoDB();
    const dealershipId = await getDealershipId();
    if (!dealershipId) {
      return NextResponse.json({ error: "No dealership context." }, { status: 403 });
    }

    const body = await req.json();

    // If bookingId is provided, auto-populate from booking
    if (body.booking && !body.lineItems) {
      const booking = await Booking.findById(body.booking).lean();
      if (!booking) {
        return NextResponse.json({ error: "Booking not found." }, { status: 404 });
      }

      const lineItems = [
        {
          description: `Car rental — ${booking.totalDays || 1} day(s) @ ${booking.rateType} rate`,
          quantity: booking.totalDays || 1,
          unitPrice: booking.rateAmount || 0,
          total: booking.subtotal || 0,
        },
      ];

      // Add extras as line items
      if (booking.extras && booking.extras.length > 0) {
        booking.extras.forEach((extra) => {
          lineItems.push({
            description: extra.name,
            quantity: 1,
            unitPrice: extra.price,
            total: extra.price,
          });
        });
      }

      // Add late fee if applicable
      if (booking.lateFee > 0) {
        lineItems.push({
          description: "Late return fee",
          quantity: 1,
          unitPrice: booking.lateFee,
          total: booking.lateFee,
        });
      }

      body.lineItems = lineItems;
      body.renter = body.renter || booking.renter;
      body.subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
      body.totalAmount = body.subtotal - (body.discount || 0);
      body.depositApplied = body.depositApplied || booking.deposit || 0;
      body.amountDue = body.totalAmount - body.depositApplied;
    }

    const invoice = await Invoice.create({
      ...body,
      dealershipId,
    });

    // Update booking payment status
    if (body.booking) {
      await Booking.findByIdAndUpdate(body.booking, {
        paymentStatus: "pending",
      });
    }

    const populated = await Invoice.findById(invoice._id)
      .populate("booking", "bookingNumber")
      .populate("renter", "fullName email phoneNumber")
      .lean();

    return NextResponse.json({ invoice: populated }, { status: 201 });
  } catch (err) {
    console.error("POST /api/invoices error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create invoice." },
      { status: 500 }
    );
  }
}
