import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";


export async function GET(req) {
    try {
      // Connect to MongoDB
      await connectMongoDB();
  
      // Extract the car ID from query parameters
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");    
        console.log(id)
  
      if (!id) {
        return NextResponse.json({ success: false, message: "Car ID is required" }, { status: 400 });
      }
  
      // Find the car in the database
      const car = await Car.findById(id);
      if (!car) {
        return NextResponse.json({ success: false, message: "Car not found" }, { status: 404 });
      }
  
      // Return the featured status (paint field)
      return NextResponse.json({ success: true, featured: car.paint }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, message: "Error fetching featured status", error }, { status: 500 });
    }
  }