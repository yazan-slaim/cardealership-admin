import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Enquiry } from "@/models/Enquiry";
import { logActivity } from "@/lib/logActivity";
import { getDealershipScope, getDealershipId } from "@/lib/getDealershipScope";

// POST - Create a new enquiry
export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();
    
    const dealershipId = await getDealershipId();
    if (dealershipId) {
      body.dealershipId = dealershipId;
    }

    const newEnquiry = new Enquiry(body);
    const savedEnquiry = await newEnquiry.save();

    logActivity({
      type: "enquiry_created",
      metadata: {
        contentPreview: `New enquiry from ${body.name || body.fullName || "Customer"} — ${body.subject || body.carTitle || "General"}`,
      },
      source: "client",
    });

    return NextResponse.json(savedEnquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create enquiry" },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    await connectMongoDB();
    const { id, cleared } = await req.json();
    const scopeFilter = await getDealershipScope();

    const enquiry = await Enquiry.findOneAndUpdate(
      { _id: id, ...scopeFilter },
      { cleared },
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    logActivity({
      type: "enquiry_cleared",
      metadata: {
        contentPreview: `Enquiry from ${enquiry.name || enquiry.fullName || "Customer"} marked as ${cleared ? "cleared" : "uncleared"}`,
      },
      source: "employee",
    });

    return NextResponse.json(enquiry);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear enquiry" },
      { status: 500 }
    );
  }
}
// GET - Get all enquiries or a single enquiry
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const scopeFilter = await getDealershipScope();

    if (id) {
      const enquiry = await Enquiry.findOne({ _id: id, ...scopeFilter });
      if (!enquiry) {
        return NextResponse.json(
          { error: "Enquiry not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(enquiry);
    } else {
      const enquiries = await Enquiry.find(scopeFilter);
      return NextResponse.json(enquiries);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a single enquiry by id
export async function DELETE(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Enquiry ID is required" },
        { status: 400 }
      );
    }

    const scopeFilter = await getDealershipScope();
    const deletedEnquiry = await Enquiry.findOneAndDelete({ _id: id, ...scopeFilter });

    if (!deletedEnquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Enquiry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
