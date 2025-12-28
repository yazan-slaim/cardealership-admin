import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export const runtime = "nodejs";

const TZ = "Asia/Amman"; // adjust if you prefer a different timezone

function parseDateFlexible(s) {
  if (!s) return null;
  // ISO: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return new Date(`${s}T00:00:00.000Z`);
  }
  // DD/MM/YYYY
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (m) {
    const [_, dd, mm, yyyy] = m;
    return new Date(Date.UTC(+yyyy, +mm - 1, +dd, 0, 0, 0, 0));
  }
  // Fallback to Date()
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function decideUnit(start, end) {
  const ms = end - start;
  const days = ms / (1000 * 60 * 60 * 24);
  if (days <= 30) return "day";
  if (days <= 60) return "week";
  if (days <= 730) return "month";
  return "year";
}

function labelFormatFor(unit) {
  switch (unit) {
    case "day":   return "%Y-%m-%d";
    case "week":  // show the week *start* date
      return "Week of %Y-%m-%d";
    case "month": return "%Y-%m";
    case "year":  return "%Y";
    default:      return "%Y-%m-%d";
  }
}

export async function GET(req) {
  try {
    await connectMongoDB();

    const SoldCar =
      mongoose.models.SoldCar || (await import("@/models/SoldCar")).default;

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");
    const startStr = searchParams.get("startDate");
    const endStr = searchParams.get("endDate");
    const override = searchParams.get("granularity"); // optional: day|week|month|year

    if (!agentId || !startStr || !endStr) {
      return NextResponse.json(
        { success: false, message: "agentId, startDate, endDate are required" },
        { status: 400 }
      );
    }

    const startDate = parseDateFlexible(startStr);
    const endDateRaw = parseDateFlexible(endStr);
    if (!startDate || !endDateRaw) {
      return NextResponse.json(
        { success: false, message: "Invalid date format" },
        { status: 400 }
      );
    }

    // Make end inclusive (end of day)
    const endDate = new Date(endDateRaw);
    endDate.setUTCHours(23, 59, 59, 999);

    // Decide grouping unit
    const validUnits = new Set(["day", "week", "month", "year"]);
    const unit = validUnits.has(override) ? override : decideUnit(startDate, endDate);

    // $dateTrunc: require MongoDB 5.0+
    // For ISO week, use startOfWeek: 'monday' to align with common reporting.
    const truncExpr =
      unit === "week"
        ? { date: "$createdAt", unit: "week", timezone: TZ, startOfWeek: "monday" }
        : { date: "$createdAt", unit, timezone: TZ };

    const labelFmt = labelFormatFor(unit);

    const match = {
      agent: new mongoose.Types.ObjectId(agentId),
      createdAt: { $gte: startDate, $lte: endDate },
    };

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: { $dateTrunc: truncExpr },
          total: { $sum: "$salePrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          unit: { $literal: unit },
          periodStart: "$_id",
          label: { $dateToString: { date: "$_id", format: labelFmt, timezone: TZ } },
          total: 1,
          count: 1,
        },
      },
    ];

    const data = await SoldCar.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      unit,
      startDate,
      endDate,
      data,
    });
  } catch (e) {
    console.error("[revenue-series-dynamic]", e);
    return NextResponse.json(
      { success: false, message: "Failed to fetch revenue series" },
      { status: 500 }
    );
  }
}
