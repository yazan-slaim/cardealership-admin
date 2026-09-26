'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, ArrowUpRight, ArrowDownRight,
  AlertTriangle, Clock, DollarSign, Car, Truck,
  Users, CalendarDays, FileText, Loader2,
  CheckCircle2, Wrench, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#1a1a2e',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
    color: '#fff',
    fontSize: '12px',
  },
  labelStyle: { color: '#94a3b8', fontWeight: 600, marginBottom: 4 },
};

function KPICard({ icon: Icon, label, value, subtext, iconColor = "text-[#0f4098]", trend, href }) {
  const card = (
    <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-5 hover:shadow-lg transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
        </div>
        <div className={`p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {trend >= 0 ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className={`text-xs font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {Math.abs(trend)}%
          </span>
        </div>
      )}
    </div>
  );

  if (href) return <Link href={href}>{card}</Link>;
  return card;
}

export default function RentalDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch('/api/rental-dashboard', {
          signal: ac.signal,
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setData(await res.json());
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#0f4098]" />
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Loading rental dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center">
        <p className="text-sm text-gray-400">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rental Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fleet performance and booking overview
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/fleet/post-product"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#0f4098] hover:bg-blue-900 text-white transition-colors shadow-sm"
          >
            <Truck className="w-4 h-4" />
            Add Vehicle
          </Link>
          <Link
            href="/bookings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-white dark:bg-[#171717] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <CalendarDays className="w-4 h-4" />
            Bookings
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <KPICard icon={Truck} label="Total Fleet" value={data.totalFleet} iconColor="text-[#0f4098]" href="/fleet" />
        <KPICard icon={TrendingUp} label="Utilization" value={`${data.utilization}%`} iconColor="text-emerald-600" subtext={`${data.rented} rented, ${data.available} available`} />
        <KPICard icon={CalendarDays} label="Active Rentals" value={data.activeRentals} iconColor="text-blue-600" href="/bookings/active" />
        <KPICard icon={DollarSign} label="Revenue MTD" value={`${data.revenueMTD?.toLocaleString()} JOD`} iconColor="text-green-600" subtext={`${data.completedMTD} completed`} />
        <KPICard icon={AlertTriangle} label="Overdue" value={data.overdueReturns} iconColor="text-orange-600" href="/bookings" />
        <KPICard icon={FileText} label="Pending Invoices" value={data.pendingInvoices} iconColor="text-purple-600" subtext={`${data.pendingInvoiceAmount?.toLocaleString()} JOD`} href="/invoices" />
      </div>

      {/* Alert Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.overdueReturns > 0 && (
          <Link href="/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-400">{data.overdueReturns} overdue return(s)</p>
              <p className="text-xs text-orange-600 dark:text-orange-500/80">Vehicles past their scheduled return date</p>
            </div>
            <ChevronRight className="w-4 h-4 text-orange-400 ml-auto" />
          </Link>
        )}
        {data.upcomingPickups > 0 && (
          <Link href="/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">{data.upcomingPickups} upcoming pickup(s)</p>
              <p className="text-xs text-blue-600 dark:text-blue-500/80">Within the next 48 hours</p>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-400 ml-auto" />
          </Link>
        )}
        {data.upcomingReturns > 0 && (
          <Link href="/bookings/active" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">{data.upcomingReturns} upcoming return(s)</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500/80">Expected within 48 hours</p>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-400 ml-auto" />
          </Link>
        )}
        {data.maintenance > 0 && (
          <Link href="/fleet/maintenance" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
            <Wrench className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">{data.maintenance} in maintenance</p>
              <p className="text-xs text-amber-600 dark:text-amber-500/80">Vehicles currently in service</p>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400 ml-auto" />
          </Link>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Revenue Trend (6 months)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f4098" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0f4098" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="revenue" stroke="#0f4098" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Bookings */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Daily Bookings (14 days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.dailyBookings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="newBookings" fill="#0f4098" name="New" radius={[4, 4, 0, 0]} barSize={14} />
              <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Pie */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Bookings by Status</h3>
          {data.bookingStatusData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  style={{ fontSize: 11 }}
                >
                  {data.bookingStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-gray-400 text-sm">No booking data yet</div>
          )}
        </div>

        {/* Fleet by Category */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Fleet by Category</h3>
          {data.fleetByCategory?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.fleetByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  style={{ fontSize: 11 }}
                >
                  {data.fleetByCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-gray-400 text-sm">No fleet data yet</div>
          )}
        </div>
      </div>

      {/* Most Popular Vehicles */}
      {data.popularCars?.length > 0 && (
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Most Rented Vehicles</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {data.popularCars.map((car, i) => (
              <div key={i} className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <span className="text-xs font-bold text-[#0f4098] dark:text-blue-400 mb-2">#{i + 1}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">{car.title}</span>
                <span className="text-xs text-gray-400 mt-1">{car.rentals} rentals</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{car.revenue?.toLocaleString()} JOD</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Avg. Rental Duration</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{data.avgRentalDuration} days</p>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">New Enquiries</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{data.newEnquiries}</p>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Available Vehicles</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{data.available}</p>
        </div>
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Reserved</p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{data.reserved}</p>
        </div>
      </div>
    </div>
  );
}
