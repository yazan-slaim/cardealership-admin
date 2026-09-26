import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Car } from "@/models/Car";
import SoldCar from "@/models/SoldCar";
import { Enquiry } from "@/models/Enquiry";
import { getDealershipScope } from "@/lib/getDealershipScope";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Inventory Aggregation (Active cars)
    const inventoryAgg = await Car.aggregate([
      { $match: { ...scopeFilter, sold: false, carMake: { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: "$carMake",
          activeUnits: { $sum: 1 },
          avgListingPrice: { $avg: "$price" },
          agingUnits: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $gt: ["$daysInStock", 60] },
                    { $lt: ["$createdAt", new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // 2. Sales Aggregation (All time velocity & sales)
    const salesAgg = await SoldCar.aggregate([
      { $match: scopeFilter },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "carDoc"
        }
      },
      { $unwind: "$carDoc" },
      { $match: { "carDoc.carMake": { $exists: true, $ne: "" } } },
      {
        $project: {
          make: "$carDoc.carMake",
          salePrice: "$salePrice",
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
          _id: "$make",
          soldUnits: { $sum: 1 },
          avgSalePrice: { $avg: "$salePrice" },
          avgDaysToSell: { $avg: "$daysToSell" }
        }
      }
    ]);

    // 3. Enquiry Aggregation (Last 30 days for Demand)
    const enquiryAgg = await Enquiry.aggregate([
      { $match: { ...scopeFilter, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "carDoc"
        }
      },
      { $unwind: "$carDoc" },
      { $match: { "carDoc.carMake": { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: "$carDoc.carMake",
          recentEnquiries: { $sum: 1 }
        }
      }
    ]);

    // 4. All-time Enquiry Aggregation (for Conversion Rate)
    const allEnquiriesAgg = await Enquiry.aggregate([
      { $match: scopeFilter },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "carDoc"
        }
      },
      { $unwind: "$carDoc" },
      { $match: { "carDoc.carMake": { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: "$carDoc.carMake",
          totalEnquiries: { $sum: 1 }
        }
      }
    ]);

    // 5. Combine Data
    const makeMap = {};
    const addMake = (name) => {
      if (!makeMap[name]) {
        makeMap[name] = {
          make: name,
          activeUnits: 0,
          avgListingPrice: 0,
          agingUnits: 0,
          soldUnits: 0,
          avgSalePrice: 0,
          avgDaysToSell: 0,
          recentEnquiries: 0,
          totalEnquiriesAllTime: 0
        };
      }
    };

    inventoryAgg.forEach(item => {
      addMake(item._id);
      makeMap[item._id].activeUnits = item.activeUnits;
      makeMap[item._id].avgListingPrice = item.avgListingPrice;
      makeMap[item._id].agingUnits = item.agingUnits;
    });

    salesAgg.forEach(item => {
      addMake(item._id);
      makeMap[item._id].soldUnits = item.soldUnits;
      makeMap[item._id].avgSalePrice = item.avgSalePrice;
      makeMap[item._id].avgDaysToSell = item.avgDaysToSell;
    });

    enquiryAgg.forEach(item => {
      addMake(item._id);
      makeMap[item._id].recentEnquiries = item.recentEnquiries;
    });

    allEnquiriesAgg.forEach(item => {
      addMake(item._id);
      makeMap[item._id].totalEnquiriesAllTime = item.totalEnquiries;
    });

    // 6. Compute KPIs
    let analysisList = Object.values(makeMap).map(data => {
      // Demand Score Calculation (0-100)
      // A balanced metric incorporating velocity, recent interest, and sales volume
      const velocityWeight = data.avgDaysToSell > 0 ? Math.min(30, (30 / data.avgDaysToSell) * 20) : 0;
      const enquiryWeight = data.activeUnits > 0 ? Math.min(40, (data.recentEnquiries / data.activeUnits) * 40) : (data.recentEnquiries > 0 ? 40 : 0);
      const salesVolumeWeight = Math.min(30, data.soldUnits * 5); 

      let score = Math.round(velocityWeight + enquiryWeight + salesVolumeWeight);
      // Give a baseline score if there's inventory but no action
      if (score === 0 && data.activeUnits > 0) score = 15;
      score = Math.min(100, Math.max(0, score));

      // Trend classification
      let trendStatus = "Stable";
      let trendColor = "bg-slate-200 text-slate-700";
      
      if (score >= 65) {
        trendStatus = "Hot";
        trendColor = "bg-emerald-100 text-emerald-700";
      } else if (score <= 35 && data.activeUnits > 0) {
        trendStatus = "Slow";
        trendColor = "bg-red-100 text-red-700";
      }

      // Conversion Rate (Sold / (Sold + Total Enquiries))
      let conversionRate = 0;
      const totalLeads = data.totalEnquiriesAllTime + data.soldUnits;
      if (totalLeads > 0) {
        conversionRate = Math.round((data.soldUnits / totalLeads) * 100);
      }

      // Price Gap (Sold vs Listing)
      let priceGapPercent = 0;
      if (data.avgListingPrice > 0 && data.avgSalePrice > 0) {
        priceGapPercent = ((data.avgSalePrice - data.avgListingPrice) / data.avgListingPrice) * 100;
      }

      return {
        ...data,
        demandScore: score,
        trendStatus,
        trendColor,
        conversionRate,
        priceGapPercent,
        avgDaysToSell: data.avgDaysToSell > 0 ? Math.round(data.avgDaysToSell) : 0
      };
    });

    // Sort by active units desc, then demand score desc
    analysisList.sort((a, b) => {
      if (b.activeUnits !== a.activeUnits) {
        return b.activeUnits - a.activeUnits;
      }
      return b.demandScore - a.demandScore;
    });

    return NextResponse.json(analysisList);
  } catch (error) {
    console.error("GET /api/carmake/analysis error:", error);
    return NextResponse.json(
      { error: "Failed to fetch car make analysis" },
      { status: 500 }
    );
  }
}
