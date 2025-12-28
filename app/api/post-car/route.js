import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";

export async function POST(req) {
  const { car, id } = await req.json();

  await connectMongoDB();

  const pagesObject = {
    luxuryPage: car.pages.find((page) => page.title === "Luxury"),
    technologyPage: car.pages.find((page) => page.title === "Technology"),
    comfortPage: car.pages.find((page) => page.title === "Comfort"),
    performancePage: car.pages.find((page) => page.title === "Performance"),
  };

  const carMongodbData = {
    ...car,
    pages: pagesObject,
  };

  if (id) {
    const existingCar = await Car.findById(id);

    if (existingCar) {
      await Car.updateOne({ _id: id }, { $set: carMongodbData });
      return NextResponse.json("Product updated successfully!");
    } else {
      return NextResponse.json("Car not found!", { status: 404 });
    }
  } else {
    const newCar = new Car(carMongodbData);
    await newCar.save();
    return NextResponse.json("New product created successfully!");
  }
}
export async function PUT(req) {
  const { id, sold } = await req.json();
  await connectMongoDB();

  try {
    const existingCar = await Car.findById(id);

    if (!existingCar) {
      return NextResponse.json("Car not found!", { status: 404 });
    }

    existingCar.sold = sold;
    await existingCar.save();

    return NextResponse.json("Sold status updated successfully!");
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating sold status" },
      { status: 500 }
    );
  }
}
