import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import SoldCar from "@/models/SoldCar";
import { getDealershipScope } from "@/lib/getDealershipScope";

// Support default or named exports for schemas
import * as ClientModel from "@/models/Client";
import * as CarModel from "@/models/Car";
import * as TaskModel from "@/models/Task";
import * as EnquiryModel from "@/models/Enquiry";
import * as ActivityModel from "@/models/Activity";
import * as EmployeeModel from "@/models/Employee";

const Client = ClientModel.default ?? ClientModel.Client;
const Car = CarModel.default ?? CarModel.Car;
const Task = TaskModel.default ?? TaskModel.Task;
const Enquiry = EnquiryModel.default ?? EnquiryModel.Enquiry;
const Activity = ActivityModel.default ?? ActivityModel.Activity;
const Employee = EmployeeModel.default ?? EmployeeModel.Employee;

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();
    const now = new Date();

    // ────────────────────────────────────────────────────────────────────────
    // 1. BASIC KPIS (MTD & Historical Windows)
    // ────────────────────────────────────────────────────────────────────────
    const periodStartUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const periodEndUTC   = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    // --- Sales (prev month) ---
    const salesAggPromise = SoldCar.aggregate([
      { $match: { ...scopeFilter, createdAt: { $gte: periodStartUTC, $lt: periodEndUTC } } },
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
    const convPromise = Client.aggregate([
      { $match: { ...scopeFilter, createdAt: { $gte: periodStartUTC, $lt: periodEndUTC } } },
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
    ]);

    // --- Inventory KPIs (Car) ---
    const SIXTY_D_MS = 60 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = new Date(now.getTime() - SIXTY_D_MS);

    const carInvPromise = Car.aggregate([
      {
        $facet: {
          onLot: [
            { $match: { ...scopeFilter, sold: false } },
            { $count: "count" },
          ],
          aging60: [
            { $match: { ...scopeFilter, sold: false, $or: [{ createdAt: { $lt: sixtyDaysAgo } }, { daysInStock: { $gt: 60 } }] } },
            { $count: "count" },
          ],
          value: [
            { $match: { ...scopeFilter, sold: false } },
            {
              $group: {
                _id: null,
                total: { $sum: { $ifNull: ["$price", 0] } },
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

    const overdueTasksPromise = Task.countDocuments({ ...scopeFilter, completed: false, dueDate: { $lt: now } });

    // --- Avg Days to Sell (from sold cars: diff between sale date and car listing date) ---
    const avgDaysToSellPromise = SoldCar.aggregate([
      { $match: scopeFilter },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "carDoc"
        }
      },
      { $unwind: { path: "$carDoc", preserveNullAndEmptyArrays: false } },
      {
        $project: {
          daysToSell: {
            $divide: [
              { $subtract: ["$createdAt", "$carDoc.createdAt"] },
              86400000 // ms in a day
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgDays: { $avg: "$daysToSell" }
        }
      }
    ]);

    // --- Hot Lead Count (enquiries with status 'new') ---
    const hotLeadCountPromise = Enquiry.countDocuments({ ...scopeFilter, status: "new" });

    // ────────────────────────────────────────────────────────────────────────
    // 2. DETAILED CHARTS & ANALYTICS AGGREGATIONS
    // ────────────────────────────────────────────────────────────────────────

    // --- A. Revenue & Units Trend (Last 6 Months) ---
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const revenueAggPromise = SoldCar.aggregate([
      { $match: { ...scopeFilter, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$salePrice" },
          units: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // --- B. Inventory by Brand ---
    const brandAggPromise = Car.aggregate([
      { $match: { ...scopeFilter, sold: false } },
      { $group: { _id: "$carMake", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // --- C. Agent Performance ---
    const agentAggPromise = SoldCar.aggregate([
      { $match: scopeFilter },
      {
        $group: {
          _id: "$agent",
          deals: { $sum: 1 },
          revenue: { $sum: "$salePrice" }
        }
      },
      { $sort: { deals: -1 } },
      { $limit: 5 }
    ]);

    // --- D. Daily Leads vs Conversions (Last 14 Days) ---
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const dailyLeadsAggPromise = Enquiry.aggregate([
      { $match: { ...scopeFilter, createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          leads: { $sum: 1 },
          converted: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } }
        }
      },
      { $sort: { "_id.month": 1, "_id.day": 1 } }
    ]);

    // --- E. Live Activity Feed ---
    const activitiesPromise = Activity.find(scopeFilter)
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Resolve basic promises
    const [
      [salesAgg = {}],
      convArr = [],
      [invAgg = {}],
      overdueTasks = 0,
      revenueAggList = [],
      brandAggList = [],
      agentAggList = [],
      dailyLeadsAggList = [],
      dbActivitiesList = [],
      avgDaysToSellAgg = [],
      hotLeadCount = 0
    ] = await Promise.all([
      salesAggPromise,
      convPromise,
      carInvPromise,
      overdueTasksPromise,
      revenueAggPromise,
      brandAggPromise,
      agentAggPromise,
      dailyLeadsAggPromise,
      activitiesPromise,
      avgDaysToSellPromise,
      hotLeadCountPromise
    ]);

    const conv = convArr?.[0] || {};

    // ────────────────────────────────────────────────────────────────────────
    // 3. MAP AGGREGATES & FALLBACKS FOR EMPTY DATA
    // ────────────────────────────────────────────────────────────────────────

    // Month name helper
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // A. Revenue Data Mapping
    let revenueData = revenueAggList.map(item => ({
      month: monthNames[item._id.month - 1] || `${item._id.month}`,
      revenue: item.revenue,
      units: item.units
    }));
    // Zero-fill fallback: show last 6 month labels with 0 values
    if (revenueData.length === 0) {
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        revenueData.push({ month: monthNames[d.getMonth()], revenue: 0, units: 0 });
      }
    }


    // B. Lead Pipeline Funnel — real cumulative counts from Client pipeline stages
    // The Client model tracks: new → contacted → interested → negotiating → purchased (+ lost)
    // Funnel counts how many clients reached each stage or moved past it.
    const pipelineAgg = await Client.aggregate([
      { $match: scopeFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const pipeMap = pipelineAgg.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    // Enquiries that haven't become clients yet = top-of-funnel raw leads
    const unlinkedEnquiries = await Enquiry.countDocuments({ ...scopeFilter, client: null });

    // Stage counts (cumulative — each stage includes everyone who passed through it)
    const stNew        = (pipeMap['new'] || 0) + (pipeMap['contacted'] || 0) + (pipeMap['interested'] || 0) + (pipeMap['negotiating'] || 0) + (pipeMap['purchased'] || 0) + (pipeMap['lost'] || 0);
    const stContacted  = (pipeMap['contacted'] || 0) + (pipeMap['interested'] || 0) + (pipeMap['negotiating'] || 0) + (pipeMap['purchased'] || 0) + (pipeMap['lost'] || 0);
    const stInterested = (pipeMap['interested'] || 0) + (pipeMap['negotiating'] || 0) + (pipeMap['purchased'] || 0);
    const stNegotiating = (pipeMap['negotiating'] || 0) + (pipeMap['purchased'] || 0);
    const stWon        = pipeMap['purchased'] || 0;

    const leadFunnelData = [
      { stage: 'New Leads',    count: unlinkedEnquiries + stNew, fill: '#e0e7ff' },
      { stage: 'Contacted',    count: stContacted,               fill: '#c7d2fe' },
      { stage: 'Interested',   count: stInterested,              fill: '#818cf8' },
      { stage: 'Negotiation',  count: stNegotiating,             fill: '#6366f1' },
      { stage: 'Closed Won',   count: stWon,                     fill: '#4338ca' },
    ];


    // C. Brand Inventory Mapping
    const brandColors = ['#0f3460', '#1e6091', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#94a3b8'];
    let inventoryByBrand = brandAggList.map((item, index) => ({
      name: item._id || 'Other',
      value: item.count,
      color: brandColors[index % brandColors.length]
    }));


    // D. Agent Performance Mapping
    let agentPerformance = await Promise.all(agentAggList.map(async (item) => {
      const emp = await Employee.findById(item._id).select("fullName").lean();
      return {
        name: emp?.fullName || "Agent",
        deals: item.deals,
        revenue: item.revenue,
        conversion: Math.round((item.deals / (item.deals + 5)) * 100)
      };
    }));


    // E. Daily Leads Mapping
    let dailyLeads = dailyLeadsAggList.map(item => ({
      day: `${item._id.day}/${item._id.month}`,
      leads: item.leads,
      converted: item.converted
    }));
    // Zero-fill fallback: show last 14 day labels with 0 values
    if (dailyLeads.length === 0) {
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dailyLeads.push({ day: `${d.getDate()}/${d.getMonth() + 1}`, leads: 0, converted: 0 });
      }
    }


    // F. Aging Stock Distribution
    const activeCars = await Car.find({ ...scopeFilter, sold: false }).select("createdAt daysInStock price").lean();
    let agingCounts = { "0-15d": 0, "16-30d": 0, "31-45d": 0, "46-60d": 0, "60d+": 0 };
    activeCars.forEach(car => {
      const ageMs = now.getTime() - new Date(car.createdAt).getTime();
      const ageDays = Math.max(car.daysInStock || 0, Math.floor(ageMs / (1000 * 60 * 60 * 24)));
      if (ageDays <= 15) agingCounts["0-15d"]++;
      else if (ageDays <= 30) agingCounts["16-30d"]++;
      else if (ageDays <= 45) agingCounts["31-45d"]++;
      else if (ageDays <= 60) agingCounts["46-60d"]++;
      else agingCounts["60d+"]++;
    });
    const totalAgingCars = Object.values(agingCounts).reduce((a, b) => a + b, 0);
    let agingData = Object.keys(agingCounts).map(range => ({
      range,
      count: agingCounts[range]
    }));


    // G. Price Range Distribution
    let priceCounts = { "< 10K": 0, "10-20K": 0, "20-35K": 0, "35-50K": 0, "50-75K": 0, "75K+": 0 };
    activeCars.forEach(car => {
      const price = car.price || 0;
      if (price < 10000) priceCounts["< 10K"]++;
      else if (price <= 20000) priceCounts["10-20K"]++;
      else if (price <= 35000) priceCounts["20-35K"]++;
      else if (price <= 50000) priceCounts["35-50K"]++;
      else if (price <= 75000) priceCounts["50-75K"]++;
      else priceCounts["75K+"]++;
    });
    const totalPriceCars = Object.values(priceCounts).reduce((a, b) => a + b, 0);
    let priceRangeData = Object.keys(priceCounts).map(range => ({
      range,
      count: priceCounts[range]
    }));


    // H. Live Activities Mapping
    let activities = await Promise.all(dbActivitiesList.map(async (act) => {
      let clientName = "Client";
      if (act.client) {
        const cl = await Client.findById(act.client).select("fullName").lean();
        if (cl) clientName = cl.fullName;
      }

      // Readable relative time
      const diffMs = now.getTime() - new Date(act.createdAt).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHrs / 24);
      let timeStr = "Just now";
      if (diffDays > 0) timeStr = `${diffDays}d ago`;
      else if (diffHrs > 0) timeStr = `${diffHrs}h ago`;
      else if (diffMins > 0) timeStr = `${diffMins}m ago`;

      let iconType = "info";
      if (act.type.includes("lead") || act.type.includes("enquiry")) iconType = "lead";
      else if (act.type.includes("task") || act.type.includes("note")) iconType = "task";
      else if (act.type.includes("sold") || act.type.includes("sale")) iconType = "sale";

      let prettyTitle = act.type.replace(/_/g, ' ');
      prettyTitle = prettyTitle.charAt(0).toUpperCase() + prettyTitle.slice(1);

      return {
        _id: act._id.toString(),
        type: iconType,
        title: prettyTitle,
        desc: act.metadata?.contentPreview || `Activity logged for ${clientName}`,
        time: timeStr,
      };
    }));


    // I. Live Market Price Tracker
    const marketAvgPrices = await Car.aggregate([
      { $match: { ...scopeFilter, sold: false } },
      {
        $group: {
          _id: { make: "$carMake", model: "$model" },
          avgPrice: { $avg: "$price" },
          count: { $sum: 1 },
          avgDays: { $avg: { $ifNull: ["$daysInStock", 0] } },
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get enquiry counts per car model (last 30 days) for demand signals
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const enquiryDemand = await Enquiry.aggregate([
      { $match: { ...scopeFilter, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "carDoc",
        },
      },
      { $unwind: { path: "$carDoc", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: { make: "$carDoc.carMake", model: "$carDoc.model" },
          enquiryCount: { $sum: 1 },
        },
      },
      { $sort: { enquiryCount: -1 } },
    ]);
    const demandMap = enquiryDemand.reduce((acc, cur) => {
      const key = `${cur._id.make}||${cur._id.model}`;
      acc[key] = cur.enquiryCount;
      return acc;
    }, {});

    let liveMarketPriceTracker = marketAvgPrices.map(item => {
      const key = `${item._id.make}||${item._id.model}`;
      const demand = demandMap[key] || 0;
      // Status: HOT if enquiries > 2 or avg days < 20, WARM if some activity, COLD if stale
      let status, statusColor;
      if (demand >= 3 || item.avgDays < 20) {
        status = "HOT"; statusColor = "#16a34a";
      } else if (demand >= 1 || item.avgDays < 45) {
        status = "WARM"; statusColor = "#f59e0b";
      } else {
        status = "COLD"; statusColor = "#94a3b8";
      }
      return {
        model: `${item._id.make || ""} ${item._id.model || ""}`.trim() || "Unknown",
        avg: `${Math.round(item.avgPrice).toLocaleString()} JOD`,
        precision: `${item.count} in stock`,
        precisionColor: item.count > 3 ? "#16a34a" : item.count > 1 ? "#f59e0b" : "#dc2626",
        status,
        statusColor,
      };
    });


    // J. Trend Cards — data-driven insights from real inventory + enquiries + sales
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1) Most enquired model in last 7 days
    const topEnquired = await Enquiry.aggregate([
      { $match: { ...scopeFilter, createdAt: { $gte: sevenDaysAgo } } },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "carDoc",
        },
      },
      { $unwind: { path: "$carDoc", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: { make: "$carDoc.carMake", model: "$carDoc.model" },
          count: { $sum: 1 },
          avgPrice: { $avg: "$carDoc.price" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    // 2) Newest inventory additions (last 7 days count)
    const recentListings = await Car.countDocuments({ ...scopeFilter, sold: false, createdAt: { $gte: sevenDaysAgo } });

    // 3) Fastest selling model (lowest avg days to sell from sold cars)
    const fastestSelling = await SoldCar.aggregate([
      { $match: scopeFilter },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "carDoc",
        },
      },
      { $unwind: { path: "$carDoc", preserveNullAndEmptyArrays: false } },
      {
        $project: {
          make: "$carDoc.carMake",
          model: "$carDoc.model",
          daysToSell: {
            $divide: [
              { $subtract: ["$createdAt", "$carDoc.createdAt"] },
              86400000,
            ],
          },
        },
      },
      {
        $group: {
          _id: { make: "$make", model: "$model" },
          avgDays: { $avg: "$daysToSell" },
          salesCount: { $sum: 1 },
        },
      },
      { $match: { salesCount: { $gte: 1 } } },
      { $sort: { avgDays: 1 } },
      { $limit: 1 },
    ]);

    // 4) Build trend cards array
    let trendCards = [];

    if (topEnquired.length > 0) {
      const te = topEnquired[0];
      trendCards.push({
        tag: "MOST ENQUIRED",
        tagColor: "#dc2626",
        title: `${te._id.make || ""} ${te._id.model || ""}`.trim() || "Unknown",
        desc: `${te.count} enquir${te.count === 1 ? "y" : "ies"} in the last 7 days`,
        metric: te.avgPrice ? `Avg. Ask: ${Math.round(te.avgPrice).toLocaleString()} JOD` : "N/A",
        actionLabel: `${te.count} Lead${te.count === 1 ? "" : "s"}/wk`,
        actionColor: "#0f3460",
      });
    }

    if (fastestSelling.length > 0) {
      const fs = fastestSelling[0];
      trendCards.push({
        tag: "FASTEST SELLER",
        tagColor: "#16a34a",
        title: `${fs._id.make || ""} ${fs._id.model || ""}`.trim() || "Unknown",
        desc: `Avg ${Math.round(fs.avgDays)} days to sell`,
        metric: `${fs.salesCount} unit${fs.salesCount === 1 ? "" : "s"} sold`,
        actionLabel: "High Demand",
        actionColor: "#16a34a",
      });
    }

    // Fallback: if no enquiry or sale trends, show inventory snapshot cards
    if (trendCards.length === 0 && inventoryByBrand.length > 0) {
      const topBrand = inventoryByBrand[0];
      trendCards.push({
        tag: "TOP BRAND IN STOCK",
        tagColor: "#0284c7",
        title: topBrand.name || "Unknown",
        desc: `${topBrand.value} unit${topBrand.value === 1 ? "" : "s"} currently on lot`,
        metric: `${recentListings} new this week`,
        actionLabel: "Review Stock",
        actionColor: "#0f3460",
      });
    }
    if (trendCards.length < 2) {
      trendCards.push({
        tag: "INVENTORY SNAPSHOT",
        tagColor: "#6366f1",
        title: `${invAgg.inventoryOnLot ?? 0} Active Listings`,
        desc: recentListings > 0 ? `${recentListings} added in the last 7 days` : "No new listings this week",
        metric: invAgg.agingStock60d > 0 ? `${invAgg.agingStock60d} aging 60d+` : "Healthy turnover",
        actionLabel: recentListings > 0 ? "Expanding" : "Stable",
        actionColor: recentListings > 0 ? "#16a34a" : "#f59e0b",
      });
    }


    return NextResponse.json(
      {
        periodStartUTC: periodStartUTC.toISOString(),
        nowUTC: now.toISOString(),
        
        // Basic MTD Stats
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
        avgDaysToSell: Math.round(avgDaysToSellAgg?.[0]?.avgDays ?? 0),
        hotLeadCount,

        // Charts & Detail lists
        revenueData,
        leadFunnelData,
        inventoryByBrand,
        agentPerformance,
        dailyLeads,
        agingData,
        priceRangeData,
        activities,
        liveMarketPriceTracker,
        trendCards,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("GET /api/MTD error:", err);
    return NextResponse.json({ error: "Failed to compute dashboard metrics." }, { status: 500 });
  }
}
