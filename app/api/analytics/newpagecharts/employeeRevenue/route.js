// app/api/analytics/newpagecharts/employeeRevenue/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectMongoDB();

    const SoldCar =
      mongoose.models.SoldCar || (await import("@/models/SoldCar")).default;
    const Employee =
      mongoose.models.Employee || (await import("@/models/Employee")).default;

    const { searchParams } = new URL(req.url);
    const startStr = searchParams.get("startDate");
    const endStr = searchParams.get("endDate");

    if (!startStr || !endStr) {
      return NextResponse.json(
        { success: false, message: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const startDate = new Date(`${startStr}T00:00:00.000Z`);
    const endDate = new Date(`${endStr}T23:59:59.999Z`);

    // Aggregate revenue by agent
    const pipeline = [
  {
    $match: {
      createdAt: { $gte: startDate, $lte: endDate },
    },
  },
  {
    $group: {
      _id: "$agent",
      totalRevenue: { $sum: "$salePrice" },
      units: { $sum: 1 },
    },
  },
  {
    $lookup: {
      from: "employees",
      localField: "_id",
      foreignField: "_id",
      as: "agent",
    },
  },
  { $unwind: { path: "$agent", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: 0,
      employeeId: "$_id",
      employeeName: { $ifNull: ["$agent.fullName", "Unknown"] }, // ✅ fixed
      totalRevenue: 1,
      units: 1,
    },
  },
  { $sort: { totalRevenue: -1 } },
];


    const data = await SoldCar.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      data,
      startDate,
      endDate,
    });
  } catch (e) {
    console.error("[employeeRevenue API]", e);
    return NextResponse.json(
      { success: false, message: "Failed to fetch employee revenue" },
      { status: 500 }
    );
  }
}
