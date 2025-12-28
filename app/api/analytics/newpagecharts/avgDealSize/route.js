// app/api/analytics/newpagecharts/avgDealSize/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export const runtime = "nodejs";

const TZ = "Asia/Amman"; // change if you want a different timezone

function parseDateFlexible(s) {
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return new Date(`${s}T00:00:00.000Z`);
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function decideUnit(start, end) {
  const ms = end - start;
  const days = ms / (1000 * 60 * 60 * 24);
  if (days <= 30) return "day";
  if (days <= 90) return "week";
  if (days <= 730) return "month";
  return "year";
}

function labelFormatFor(unit) {
  switch (unit) {
    case "day": return "%Y-%m-%d";
    case "week": return "Week of %Y-%m-%d";
    case "month": return "%Y-%m";
    case "year": return "%Y";
    default: return "%Y-%m-%d";
  }
}

export async function GET(req) {
  try {
    await connectMongoDB();

    const SoldCar =
      mongoose.models.SoldCar || (await import("@/models/SoldCar")).default;

    const { searchParams } = new URL(req.url);
    const startStr = searchParams.get("startDate");
    const endStr = searchParams.get("endDate");
    const override = searchParams.get("granularity");

    if (!startStr || !endStr) {
      return NextResponse.json(
        { success: false, message: "startDate and endDate are required" },
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

    const endDate = new Date(endDateRaw);
    endDate.setUTCHours(23, 59, 59, 999);

    const validUnits = new Set(["day", "week", "month", "year"]);
    const unit = validUnits.has(override) ? override : decideUnit(startDate, endDate);

    const truncExpr =
      unit === "week"
        ? { date: "$createdAt", unit: "week", timezone: TZ, startOfWeek: "monday" }
        : { date: "$createdAt", unit, timezone: TZ };

    const labelFmt = labelFormatFor(unit);

    const pipeline = [
      {
        $match: { createdAt: { $gte: startDate, $lte: endDate } },
      },
      {
        $group: {
          _id: { $dateTrunc: truncExpr },
          avgDealSize: { $avg: "$salePrice" },
          units: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          unit: { $literal: unit },
          periodStart: "$_id",
          label: { $dateToString: { date: "$_id", format: labelFmt, timezone: TZ } },
          avgDealSize: 1,
          units: 1,
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
    console.error("[avgDealSize API]", e);
    return NextResponse.json(
      { success: false, message: "Failed to fetch avg deal size" },
      { status: 500 }
    );
  }
}
