import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { getDealershipScope } from "@/lib/getDealershipScope";
import { Fleet } from "@/models/Fleet";
import { Booking } from "@/models/Booking";
import { Invoice } from "@/models/Invoice";
import { Enquiry } from "@/models/Enquiry";
import { Client } from "@/models/Client";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectMongoDB();
    const scopeFilter = await getDealershipScope();
    const now = new Date();

    // ── 1. Fleet KPIs ──────────────────────────────────────────────
    const fleetAgg = await Fleet.aggregate([
      { $match: { ...scopeFilter, isActive: true } },
      {
        $facet: {
          total: [{ $count: "count" }],
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          byBodyType: [{ $group: { _id: "$bodyType", count: { $sum: 1 } } }, { $sort: { count: -1 } }],
        },
      },
    ]);

    const fleet = fleetAgg[0] || {};
    const totalFleet = fleet.total?.[0]?.count || 0;
    const statusMap = (fleet.byStatus || []).reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {});
    const rented = (statusMap.rented || 0) + (statusMap.reserved || 0);
    const utilization = totalFleet > 0 ? Math.round((rented / totalFleet) * 100) : 0;

    // ── 2. Booking KPIs ────────────────────────────────────────────
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      activeRentals,
      overdueReturns,
      newEnquiries,
    ] = await Promise.all([
      Booking.countDocuments({ ...scopeFilter, status: "active" }),
      Booking.countDocuments({ ...scopeFilter, status: "active", returnDate: { $lt: now } }),
      Enquiry.countDocuments({ ...scopeFilter, status: "new" }),
    ]);

    // Revenue MTD (completed bookings this month)
    const revAgg = await Booking.aggregate([
      { $match: { ...scopeFilter, status: "completed", createdAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
    ]);
    const revenueMTD = revAgg[0]?.total || 0;
    const completedMTD = revAgg[0]?.count || 0;

    // Avg rental duration (completed bookings)
    const avgDurationAgg = await Booking.aggregate([
      { $match: { ...scopeFilter, status: "completed" } },
      { $group: { _id: null, avg: { $avg: "$totalDays" } } },
    ]);
    const avgRentalDuration = Math.round(avgDurationAgg[0]?.avg || 0);

    // Upcoming pickups (next 48h)
    const twoDaysOut = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const upcomingPickups = await Booking.countDocuments({
      ...scopeFilter,
      status: { $in: ["pending", "confirmed"] },
      pickupDate: { $gte: now, $lte: twoDaysOut },
    });

    // Upcoming returns (next 48h)
    const upcomingReturns = await Booking.countDocuments({
      ...scopeFilter,
      status: "active",
      returnDate: { $gte: now, $lte: twoDaysOut },
    });

    // Pending invoices
    const pendingInvoices = await Invoice.countDocuments({
      ...scopeFilter,
      status: { $in: ["sent", "overdue"] },
    });
    const pendingInvoiceAmount = await Invoice.aggregate([
      { $match: { ...scopeFilter, status: { $in: ["sent", "overdue"] } } },
      { $group: { _id: null, total: { $sum: "$amountDue" } } },
    ]);

    // ── 3. Charts ──────────────────────────────────────────────────

    // Revenue trend (6 months)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const revenueChartAgg = await Booking.aggregate([
      { $match: { ...scopeFilter, status: "completed", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let revenueData = revenueChartAgg.map((item) => ({
      month: monthNames[item._id.month - 1],
      revenue: item.revenue,
      bookings: item.bookings,
    }));
    if (revenueData.length === 0) {
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        revenueData.push({ month: monthNames[d.getMonth()], revenue: 0, bookings: 0 });
      }
    }

    // Bookings by status (pie)
    const bookingsByStatus = await Booking.aggregate([
      { $match: scopeFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusColors = {
      pending: "#94a3b8", confirmed: "#3b82f6", active: "#10b981",
      completed: "#22c55e", cancelled: "#ef4444", overdue: "#f59e0b",
    };
    const bookingStatusData = bookingsByStatus.map((s) => ({
      name: s._id?.charAt(0).toUpperCase() + s._id?.slice(1),
      value: s.count,
      color: statusColors[s._id] || "#6b7280",
    }));

    // Fleet by category (donut)
    const bodyTypeColors = ["#0f3460", "#1e6091", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51", "#94a3b8"];
    const fleetByCategory = (fleet.byBodyType || []).map((item, i) => ({
      name: item._id || "Other",
      value: item.count,
      color: bodyTypeColors[i % bodyTypeColors.length],
    }));

    // Daily bookings (14 days)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const dailyBookingsAgg = await Booking.aggregate([
      { $match: { ...scopeFilter, createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" } },
          newBookings: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
        },
      },
      { $sort: { "_id.month": 1, "_id.day": 1 } },
    ]);
    let dailyBookings = dailyBookingsAgg.map((item) => ({
      day: `${item._id.day}/${item._id.month}`,
      newBookings: item.newBookings,
      completed: item.completed,
    }));
    if (dailyBookings.length === 0) {
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dailyBookings.push({ day: `${d.getDate()}/${d.getMonth() + 1}`, newBookings: 0, completed: 0 });
      }
    }

    // Most rented vehicles
    const popularCars = await Booking.aggregate([
      { $match: { ...scopeFilter, status: { $in: ["completed", "active"] } } },
      { $group: { _id: "$fleet", rentals: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
      { $sort: { rentals: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "fleets",
          localField: "_id",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      { $unwind: { path: "$vehicle", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: { $ifNull: ["$vehicle.title", "Unknown"] },
          rentals: 1,
          revenue: 1,
          dailyRate: "$vehicle.dailyRate",
        },
      },
    ]);

    return NextResponse.json(
      {
        // KPIs
        totalFleet,
        available: statusMap.available || 0,
        rented: statusMap.rented || 0,
        maintenance: statusMap.maintenance || 0,
        reserved: statusMap.reserved || 0,
        utilization,
        activeRentals,
        overdueReturns,
        revenueMTD,
        completedMTD,
        avgRentalDuration,
        upcomingPickups,
        upcomingReturns,
        pendingInvoices,
        pendingInvoiceAmount: pendingInvoiceAmount[0]?.total || 0,
        newEnquiries,

        // Charts
        revenueData,
        bookingStatusData,
        fleetByCategory,
        dailyBookings,
        popularCars,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("GET /api/rental-dashboard error:", err);
    return NextResponse.json({ error: "Failed to compute rental dashboard metrics." }, { status: 500 });
  }
}
