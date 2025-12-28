import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";



export async function POST(req) {
  try {
    await connectMongoDB();
    const { id } = await req.json();
    console.log(id) // Parse request body

    if (!id) {
      return NextResponse.json({ success: false, message: "Car ID is required" }, { status: 400 });
    }

    const car = await Car.findById(id);
    if (!car) {
      return NextResponse.json({ success: false, message: "Car not found" }, { status: 404 });
    }

    car.Featured = !car.Featured; // Toggle featured boolean
    await car.save();
    console.log("Car saved:", car); 

    return NextResponse.json({ success: true, featured: car.Featured }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error toggling featured status", error }, { status: 500 });
  }
}
