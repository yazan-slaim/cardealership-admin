import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import SoldCar from "@/models/SoldCar";

// Support either default or named exports for safety
import * as ClientModel from "@/models/Client";
import * as CarModel from "@/models/Car";
import * as TaskModel from "@/models/Task";
const Client = ClientModel.default ?? ClientModel.Client;
const Car = CarModel.default ?? CarModel.Car;
const Task = TaskModel.default ?? TaskModel.Task;

export async function GET() {
  try {
    await connectMongoDB();

    const now = new Date();

    // Previous-month window
    const periodStartUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const periodEndUTC   = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    // --- Sales (prev month) ---
    const salesAggPromise = SoldCar.aggregate([
      { $match: { createdAt: { $gte: periodStartUTC, $lt: periodEndUTC } } },
      {
        $group: { _id: null, revenue: { $sum: "$salePrice" }, units: { $sum: 1 }, avgDeal: { $avg: "$salePrice" } }
      },
      {
        $project: {
          _id: 0,
          revenue: { $ifNull: ["$revenue", 0] },
          units: { $ifNull: ["$units", 0] },
          avgDeal: { $cond: [{ $gt: ["$units", 0] }, "$avgDeal", 0] },
        }
      }
    ]);

    // --- Lead → Sale Conversion (prev month) ---
    const convPromise = Client?.aggregate
      ? Client.aggregate([
          { $match: { createdAt: { $gte: periodStartUTC, $lt: periodEndUTC } } },
          {
            $lookup: {
              from: "soldcars",
              let: { clientId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$buyer", "$$clientId"] },
                        { $gte: ["$createdAt", periodStartUTC] },
                        { $lt:  ["$createdAt", periodEndUTC] },
                      ],
                    },
                  },
                },
                { $limit: 1 },
              ],
              as: "salesInMonth",
            },
          },
          { $addFields: { converted: { $gt: [{ $size: "$salesInMonth" }, 0] } } },
          {
            $group: {
              _id: null,
              totalLeads: { $sum: 1 },
              closedLeads: { $sum: { $cond: ["$converted", 1, 0] } },
            },
          },
          {
            $project: {
              _id: 0,
              totalLeads: 1,
              closedLeads: 1,
              conversionRate: {
                $cond: [
                  { $gt: ["$totalLeads", 0] },
                  { $round: [{ $multiply: [{ $divide: ["$closedLeads", "$totalLeads"] }, 100] }, 2] },
                  0,
                ],
              },
            },
          },
        ])
      : Promise.resolve([]);

    // --- Inventory KPIs (Car) + Overdue Tasks ---
    const SIXTY_D_MS = 60 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = new Date(now.getTime() - SIXTY_D_MS);

    // Adjusted: in stock -> sold:false; aging -> createdAt < 60d OR daysInStock > 60; value -> sum(price)
    const carInvPromise = Car.aggregate([
      {
        $facet: {
          onLot: [
            { $match: { sold: false } },
            { $count: "count" },
          ],
          aging60: [
            { $match: { sold: false, $or: [{ createdAt: { $lt: sixtyDaysAgo } }, { daysInStock: { $gt: 60 } }] } },
            { $count: "count" },
          ],
          value: [
            { $match: { sold: false } },
            {
              $group: {
                _id: null,
                total: { $sum: { $ifNull: ["$price", 0] } }, // change if your price field differs
              },
            },
            { $project: { _id: 0, total: 1 } },
          ],
        },
      },
      {
        $project: {
          inventoryOnLot: { $ifNull: [{ $arrayElemAt: ["$onLot.count", 0] }, 0] },
          agingStock60d:   { $ifNull: [{ $arrayElemAt: ["$aging60.count", 0] }, 0] },
          inventoryValue:  { $ifNull: [{ $arrayElemAt: ["$value.total", 0] }, 0] },
        },
      },
    ]);

    const overdueTasksPromise = Task.countDocuments({ completed: false, dueDate: { $lt: now } });

    // Run in parallel
    const [[salesAgg = {}], convArr = [], [invAgg = {}], overdueTasks = 0] = await Promise.all([
      salesAggPromise,
      convPromise,
      carInvPromise,
      overdueTasksPromise,
    ]);

    const conv = convArr?.[0] || {};

    return NextResponse.json(
      {
        periodStartUTC: periodStartUTC.toISOString(),
        nowUTC: now.toISOString(),
        revenueMTD: salesAgg.revenue ?? 0,
        soldunits: salesAgg.units ?? 0,
        avgDeal: salesAgg.avgDeal ?? 0,

        totalLeadsPM: conv.totalLeads ?? 0,
        closedLeadsPM: conv.closedLeads ?? 0,
        conversionPM: conv.conversionRate ?? 0,

        inventoryOnLot: invAgg.inventoryOnLot ?? 0,
        agingStock60d: invAgg.agingStock60d ?? 0,
        inventoryValue: invAgg.inventoryValue ?? 0,
        overdueTasks,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to compute metrics." }, { status: 500 });
  }
}
