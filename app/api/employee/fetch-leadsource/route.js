import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");
    if (!agentId) {
      return NextResponse.json(
        { success: false, message: "agentId required" },
        { status: 400 }
      );
    }

    // Ensure models are registered on the default connection
    const SoldCar =
      mongoose.models.SoldCar || (await import("@/models/SoldCar")).default;
    await import("@/models/Client"); // registers "Client"
    // const Client = mongoose.models.Client; // not needed directly

    // Current month window (UTC)
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
    const end   = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));

    const data = await SoldCar.aggregate([
      {
        $match: {
          agent: new mongoose.Types.ObjectId(agentId),
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        // Join each sold record to its buyer (Client) to read leadSource
        $lookup: {
          from: "clients",                // collection for model "Client"
          localField: "buyer",
          foreignField: "_id",
          as: "buyerDoc",
        },
      },
      { $unwind: { path: "$buyerDoc", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$buyerDoc.leadSource", "Unknown"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // -> [{ _id: 'facebook'|'walk-in'|'referral'|..., count: N }]
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("[lead-sources-this-month-from-sales]", e);
    return NextResponse.json(
      { success: false, message: "Failed to fetch lead sources" },
      { status: 500 }
    );
  }
}
