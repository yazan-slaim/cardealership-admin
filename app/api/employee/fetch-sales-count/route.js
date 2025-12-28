// app/api/agent-sales/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";
import SoldCar from "@/models/SoldCar";

export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");
    if (!agentId || !mongoose.Types.ObjectId.isValid(agentId)) {
      return NextResponse.json({ success: false, message: "Invalid agentId" }, { status: 400 });
    }

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get both months in a single trip
    const rows = await SoldCar.aggregate([
      {
        $match: {
          agent: new mongoose.Types.ObjectId(agentId),
          createdAt: { $gte: startOfLastMonth, $lt: startOfNextMonth },
        },
      },
      {
        $addFields: {
          period: {
            $cond: [{ $gte: ["$createdAt", startOfThisMonth] }, "this", "last"],
          },
        },
      },
      {
        $group: {
          _id: "$period",
          units: { $sum: 1 },
          revenue: { $sum: "$salePrice" },
        },
      },
    ]);

    const thisRow = rows.find(r => r._id === "this") || { units: 0, revenue: 0 };
    const lastRow = rows.find(r => r._id === "last") || { units: 0, revenue: 0 };

    const unitsDiff = thisRow.units - lastRow.units;
    const unitsPct = lastRow.units === 0 ? (thisRow.units > 0 ? 100 : 0) : Math.round((unitsDiff / lastRow.units) * 100);

    const revDiff = thisRow.revenue - lastRow.revenue;
    const revPct = lastRow.revenue === 0 ? (thisRow.revenue > 0 ? 100 : 0) : Math.round((revDiff / lastRow.revenue) * 100);

    return NextResponse.json({
      success: true,
      agentId,
      range: {
        startOfLastMonth,
        startOfThisMonth,
        startOfNextMonth,
      },
      thisMonth: { units: thisRow.units, revenue: thisRow.revenue },
      lastMonth: { units: lastRow.units, revenue: lastRow.revenue },
      delta: {
        units: { diff: unitsDiff, pct: unitsPct },
        revenue: { diff: revDiff, pct: revPct },
      },
    });
  } catch (err) {
    console.error("[agent-sales]", err);
    return NextResponse.json({ success: false, message: "Server error", error: err.message }, { status: 500 });
  }
}
