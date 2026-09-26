import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Invoice } from "@/models/Invoice";
import { Booking } from "@/models/Booking";
import { getDealershipScope } from "@/lib/getDealershipScope";

export const runtime = "nodejs";

/**
 * GET /api/invoices/[id] — Get a single invoice
 */
export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();

    const invoice = await Invoice.findOne({ _id: params.id, ...scopeFilter })
      .populate("booking")
      .populate("renter", "fullName email phoneNumber address")
      .lean();

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    return NextResponse.json({ invoice });
  } catch (err) {
    console.error("GET /api/invoices/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch invoice." }, { status: 500 });
  }
}

/**
 * PUT /api/invoices/[id] — Update invoice (status, payment, etc.)
 */
export async function PUT(req, { params }) {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();
    const body = await req.json();

    const invoice = await Invoice.findOneAndUpdate(
      { _id: params.id, ...scopeFilter },
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate("booking", "bookingNumber")
      .populate("renter", "fullName email phoneNumber");

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    // If invoice is marked as paid, update booking payment status
    if (body.status === "paid" && invoice.booking?._id) {
      await Booking.findByIdAndUpdate(invoice.booking._id, {
        paymentStatus: "paid",
      });
    }

    return NextResponse.json({ invoice });
  } catch (err) {
    console.error("PUT /api/invoices/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update invoice." },
      { status: 500 }
    );
  }
}
