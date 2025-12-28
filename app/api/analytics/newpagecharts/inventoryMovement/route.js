import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectMongoDB();

    const Car = mongoose.models.Car || (await import("@/models/Car")).Car;
    const SoldCar = mongoose.models.SoldCar || (await import("@/models/SoldCar")).default;

    const { searchParams } = new URL(req.url);
    const startStr = searchParams.get("startDate");
    const endStr = searchParams.get("endDate");

    if (!startStr || !endStr) {
      return NextResponse.json({ success: false, message: "startDate and endDate are required" }, { status: 400 });
    }

    const startDate = new Date(`${startStr}T00:00:00.000Z`);
    const endDate = new Date(`${endStr}T23:59:59.999Z`);

    // Sold cars
    const soldAgg = await SoldCar.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sold: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Cars in stock (snapshot by createdAt)
    const stockAgg = await Car.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, sold: { $ne: true } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          inStock: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Merge both datasets by date
    const map = {};
    for (const d of soldAgg) {
      map[d._id] = { ...(map[d._id] || {}), label: d._id, sold: d.sold, inStock: 0 };
    }
    for (const d of stockAgg) {
      map[d._id] = { ...(map[d._id] || {}), label: d._id, inStock: d.inStock, sold: map[d._id]?.sold || 0 };
    }

    const data = Object.values(map).sort((a, b) => new Date(a.label) - new Date(b.label));

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("[inventoryMovement API]", e);
    return NextResponse.json({ success: false, message: "Failed to fetch inventory movement" }, { status: 500 });
  }
}
