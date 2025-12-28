import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Enquiry } from "@/models/Enquiry";

// POST - Create a new enquiry
export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const newEnquiry = new Enquiry(body);
    const savedEnquiry = await newEnquiry.save();
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
    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { cleared },
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

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

    if (id) {
      const enquiry = await Enquiry.findById(id);
      if (!enquiry) {
        return NextResponse.json(
          { error: "Enquiry not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(enquiry);
    } else {
      const enquiries = await Enquiry.find();
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

    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

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
