import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectMongoDB();

    const Client =
      mongoose.models.Client || (await import("@/models/Client")).Client;

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

    // Aggregate counts by status
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          stage: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ];

    const rawData = await Client.aggregate(pipeline);

    // Ensure all stages are present, even if 0
    const stages = [
      "new",
      "contacted",
      "interested",
      "negotiating",
      "purchased",
      "lost",
    ];

    const data = stages.map((stage) => {
      const found = rawData.find((d) => d.stage === stage);
      return { stage, count: found ? found.count : 0 };
    });

    return NextResponse.json({ success: true, data, startDate, endDate });
  } catch (e) {
    console.error("[leadFunnel API]", e);
    return NextResponse.json(
      { success: false, message: "Failed to fetch lead funnel" },
      { status: 500 }
    );
  }
}
