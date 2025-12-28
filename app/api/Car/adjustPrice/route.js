import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { carId, price } = await req.json(); // Get carId and new price
console.log(carId,price)
    if (!carId || price === undefined) {
      return NextResponse.json({ success: false, message: "Car carId and new price are required" }, { status: 400 });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return NextResponse.json({ success: false, message: "Car not found" }, { status: 404 });
    }

    car.price = price; // Update price
    await car.save(); // Save changes

    return NextResponse.json({ success: true, message: "Car price has been adjusted", updatedPrice: car.price }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating car price", error }, { status: 500 });
  }
}
