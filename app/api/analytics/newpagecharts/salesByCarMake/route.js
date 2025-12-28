import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req) {
  try {
    await connectMongoDB();
    const SoldCar = mongoose.models.SoldCar || (await import("@/models/SoldCar")).default;
    const Car = mongoose.models.Car || (await import("@/models/Car")).Car;

    const { searchParams } = new URL(req.url);
    const startDate = new Date(searchParams.get("startDate"));
    const endDate = new Date(searchParams.get("endDate"));
    endDate.setUTCHours(23, 59, 59, 999);

    const pipeline = [
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "carDoc"
        }
      },
      { $unwind: "$carDoc" },
      {
        $group: {
          _id: "$carDoc.carMake",
          units: { $sum: 1 },
          totalRevenue: { $sum: "$salePrice" }
        }
      },
      { $sort: { units: -1 } },
      {
        $project: {
          _id: 0,
          carMake: "$_id",
          units: 1,
          totalRevenue: 1
        }
      }
    ];

    const data = await SoldCar.aggregate(pipeline);

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("[salesByCarMake]", e);
    return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}
