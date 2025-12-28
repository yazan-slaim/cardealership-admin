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
      console.warn("[agent-revenue] invalid agentId", { agentId });
      return NextResponse.json(
        { success: false, message: "Invalid agentId" },
        { status: 400 }
      );
    }

    const agent = new mongoose.Types.ObjectId(agentId);

    // Use UTC boundaries
    const now = new Date();
    const startThis = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const startNext = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    const startLast = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));


    // quick sanity counts before the agg
    const totalForAgent = await SoldCar.countDocuments({ agent });
    const thisCountQuick = await SoldCar.countDocuments({
      agent,
      createdAt: { $gte: startThis, $lt: startNext },
    });
    const lastCountQuick = await SoldCar.countDocuments({
      agent,
      createdAt: { $gte: startLast, $lt: startThis },
    });


    const [res] = await SoldCar.aggregate([
      { $match: { agent } },
      {
        $facet: {
          thisMonth: [
            { $match: { createdAt: { $gte: startThis, $lt: startNext } } },
            { $group: { _id: null, revenue: { $sum: { $ifNull: ["$salePrice", 0] } }, units: { $sum: 1 } } },
          ],
          lastMonth: [
            { $match: { createdAt: { $gte: startLast, $lt: startThis } } },
            { $group: { _id: null, revenue: { $sum: { $ifNull: ["$salePrice", 0] } }, units: { $sum: 1 } } },
          ],
          debug: [
            {
              $group: {
                _id: null,
                totalAllTime: { $sum: 1 },
                thisCount: {
                  $sum: {
                    $cond: [
                      { $and: [{ $gte: ["$createdAt", startThis] }, { $lt: ["$createdAt", startNext] }] },
                      1,
                      0,
                    ],
                  },
                },
                lastCount: {
                  $sum: {
                    $cond: [
                      { $and: [{ $gte: ["$createdAt", startLast] }, { $lt: ["$createdAt", startThis] }] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          thisMonth: { $ifNull: [{ $first: "$thisMonth" }, { revenue: 0, units: 0 }] },
          lastMonth: { $ifNull: [{ $first: "$lastMonth" }, { revenue: 0, units: 0 }] },
          debug: { $ifNull: [{ $first: "$debug" }, { totalAllTime: 0, thisCount: 0, lastCount: 0 }] },
        },
      },
    ]);


    const thisMonth = res?.thisMonth ?? { revenue: 0, units: 0 };
    const lastMonth = res?.lastMonth ?? { revenue: 0, units: 0 };

    const revDiff = thisMonth.revenue - lastMonth.revenue;
    const revPct =
      lastMonth.revenue === 0 ? (thisMonth.revenue > 0 ? 100 : 0) : Math.round((revDiff / lastMonth.revenue) * 100);

    const unitDiff = thisMonth.units - lastMonth.units;
    const unitPct =
      lastMonth.units === 0 ? (thisMonth.units > 0 ? 100 : 0) : Math.round((unitDiff / lastMonth.units) * 100);



    return NextResponse.json({
      success: true,
      agentId,
      rangeUTC: { startLast, startThis, startNext },
      thisMonth,
      lastMonth,
      delta: {
        revenue: { diff: revDiff, pct: revPct },
        units: { diff: unitDiff, pct: unitPct },
      },
      debug: res?.debug,
      quickCounts: { totalForAgent, thisCountQuick, lastCountQuick },
    });
  } catch (err) {
    console.error("[agent-revenue] ERROR", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
