import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Dealership } from "@/models/Dealership";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Dealership ID is required" }, { status: 400 });
    }

    const dealership = await Dealership.findById(id);
    if (!dealership) {
      return NextResponse.json({ success: false, message: "Dealership not found" }, { status: 404 });
    }

    return NextResponse.json(dealership, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching dealership", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = params;
    const { subdomain, name, logo, themeColors, contactInfo } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Dealership ID is required" }, { status: 400 });
    }

    const dealership = await Dealership.findById(id);
    if (!dealership) {
      return NextResponse.json({ success: false, message: "Dealership not found" }, { status: 404 });
    }

    if (subdomain !== undefined) dealership.subdomain = subdomain;
    if (name !== undefined) dealership.name = name;
    if (logo !== undefined) dealership.logo = logo;
    if (themeColors !== undefined) dealership.themeColors = themeColors;
    if (contactInfo !== undefined) dealership.contactInfo = contactInfo;

    await dealership.save();

    return NextResponse.json({ success: true, dealership }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating dealership", error: error.message }, { status: 500 });
  }
}
