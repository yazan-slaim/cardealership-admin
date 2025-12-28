import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { CarMake } from "@/models/CarMake";

export async function GET() {
  try {
    await connectMongoDB();
    const carMakes = await CarMake.find();
    return NextResponse.json(carMakes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch car makes" },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { id } = await req.json();
    await CarMake.findByIdAndDelete(id);
    return NextResponse.json({ message: "Car make deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete car make" },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    await connectMongoDB();

    const body = await req.json();
    const { id, title, logoURL } = body;
    if (!id || !title || !logoURL) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedCarMake = await CarMake.findByIdAndUpdate(
      id,
      { title, logoURL },
      { new: true }
    );

    if (!updatedCarMake) {
      return NextResponse.json(
        { error: "Car make not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCarMake);
  } catch (error) {
    console.error("Error updating car make:", error);
    return NextResponse.json(
      { error: "Failed to update car make" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    await connectMongoDB(); // Connect to the database

    const body = await req.json(); // Parse the request body
    const { title, logoURL } = body; // Extract fields

    // Validate input
    if (!title || !logoURL) {
      return NextResponse.json(
        { error: "Title and logoURL are required" },
        { status: 400 }
      );
    }

    // Create a new car make
    const newCarMake = new CarMake({ title, logoURL });
    await newCarMake.save(); // Save the new car make to the database

    // Return success response
    return NextResponse.json({
      message: "Car make created successfully",
      carMake: newCarMake,
    });
  } catch (error) {
    console.error("Error creating car make:", error);
    return NextResponse.json(
      { error: "Failed to create car make" },
      { status: 500 }
    );
  }
}
