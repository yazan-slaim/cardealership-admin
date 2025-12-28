// app/api/employee/fetch-cars-sold-thismonth/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectMongoDB();

    // --- Ensure Car & SoldCar are registered ON THIS CONNECTION ---
    // Car is a named export in your file; we can import the schema and register if missing.
    {
      const mod = await import("@/models/Car");
      if (!mongoose.models.Car) {
        mongoose.model("Car", mod.CarSchema); // register using the schema
      }
    }
    // SoldCar is default export; import to ensure registration
    const SoldCar = mongoose.models.SoldCar || (await import("@/models/SoldCar")).default;

    // (Optional) sanity check
    // console.log('registered models:', mongoose.modelNames());  // should include 'Car' & 'SoldCar'

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");
    const period = searchParams.get("period") || "thisMonth";
    if (!agentId) {
      return NextResponse.json({ success: false, message: "agentId required" }, { status: 400 });
    }

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const q = { agent: agentId };
    if (period === "thisMonth") q.createdAt = { $gte: startOfThisMonth, $lt: startOfNextMonth };

    const sold = await SoldCar.find(q)
      .sort({ createdAt: -1 })
      .populate({
        path: "car",
        model: mongoose.models.Car,
        select: "title carMake price images",
      })
      .lean();

    return NextResponse.json({ success: true, sold });
  } catch (e) {
    console.error("[agent-sold-cars]", e);
    return NextResponse.json({ success: false, message: "Failed to fetch sold cars" }, { status: 500 });
  }
}
