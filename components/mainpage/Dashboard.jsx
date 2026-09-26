'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Upload, Camera, UserPlus, ArrowUpRight, ArrowDownRight,
  FileText, MessageSquare, AlertTriangle, Flame,
  MoreHorizontal, Zap, ChevronRight, Clock, DollarSign, Car,
  Users, BarChart3, PieChart as PieChartIcon, Target, ShieldCheck,
  Loader2, Info
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch('/api/MTD', {
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
      <div className="flex h-[calc(100vh-120px)] items-center justify-center bg-gray-50/50" style={{ minHeight: '400px' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#0f3460]" />
          <p className="text-sm font-semibold text-gray-500">Retrieving live trade records...</p>
        </div>
      </div>
    );
  }

  const {
    revenueMTD = 0,
    soldunits = 0,
    inventoryOnLot = 0,
    closedLeadsPM = 0,
    conversionPM = 0,
    avgDeal = 0,
    agingStock60d = 0,
    avgDaysToSell = 0,
    hotLeadCount = 0,
    revenueData = [],
    leadFunnelData = [],
    inventoryByBrand = [],
    agentPerformance = [],
    dailyLeads = [],
    agingData = [],
    priceRangeData = [],
    activities = [],
    liveMarketPriceTracker = [],
    trendCards = []
  } = data || {};



  return (
    <div style={{ padding: '28px 32px', maxWidth: 1440, margin: '0 auto' }}>

      <div className="flex justify-between items-start mb-7 flex-wrap gap-4">
        <div>
          <h1 className="text-[1.65rem] font-extrabold text-gray-900 dark:text-white m-0 tracking-tight">
            Market Intelligence Overview
          </h1>
          <p className="text-[0.88rem] text-gray-500 dark:text-neutral-400 mt-1">
            Real-time insights from Amman, Irbid, and Zarqa trade zones.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/stock/post-product" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10, border: '1px solid #e5e7eb',
            background: '#fff', color: '#111827', fontSize: '0.85rem', fontWeight: 600,
            textDecoration: 'none',
          }}>
            <Upload size={16} /> Quick Upload
          </Link>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10, border: 'none',
            background: '#0f3460', color: '#fff', fontSize: '0.85rem', fontWeight: 600,
            cursor: 'pointer',
          }}>
            <Zap size={16} /> Quick VIN Scan
          </button>
        </div>
      </div>

      {/* ─── STAT CARDS ROW ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="ACTIVE INVENTORY" value={inventoryOnLot} trend={inventoryOnLot > 0 ? "up" : undefined} />
        <StatCard label="TOTAL SALES (FE GROSS)" value={revenueMTD > 0 ? `${(revenueMTD / 1000).toFixed(1)}K` : "0"} suffix="JOD" sub={`${soldunits} units sold this period`} />
        <div style={{
          background: 'linear-gradient(135deg, #0f3460 0%, #1a5276 100%)', borderRadius: 12, padding: '20px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff',
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.7, textTransform: 'uppercase' }}>HOT LEAD COUNT</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{hotLeadCount}</span>
          </div>
          <span style={{ display: 'inline-block', marginTop: 8, fontSize: '0.75rem', fontWeight: 600, color: '#93c5fd' }}>{soldunits} converted this period</span>
        </div>
      </div>

      {/* ─── SECONDARY STAT ROW ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <MiniStat icon={<Target size={18} />} iconBg="#dbeafe" iconColor="#2563eb" label="Lead Conversion" value={`${conversionPM}%`} change="" up={conversionPM > 0} />
        <MiniStat icon={<DollarSign size={18} />} iconBg="#dcfce7" iconColor="#16a34a" label="Avg Deal Size" value={`${Math.round(avgDeal).toLocaleString()} JOD`} change="" up={avgDeal > 0} />
        <MiniStat icon={<Clock size={18} />} iconBg="#fef3c7" iconColor="#d97706" label="Avg Days to Sell" value={avgDaysToSell > 0 ? `${avgDaysToSell} days` : "N/A"} change="" up={avgDaysToSell > 0} />
        <MiniStat icon={<AlertTriangle size={18} />} iconBg="#fee2e2" iconColor="#dc2626" label="Aging Stock (60d+)" value={`${agingStock60d} units`} change="" up={false} />
      </div>

      {/* ─── CHARTS ROW 1: Revenue + Lead Funnel ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <ChartCard title="Revenue & Units Sold" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f3460" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0f3460" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#0f3460" strokeWidth={2.5} fill="url(#colorRev)" />
              <Line type="monotone" dataKey="units" stroke="#e76f51" strokeWidth={2} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Lead Pipeline Funnel" subtitle="Current month">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={leadFunnelData} layout="vertical" barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="stage" width={100} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {leadFunnelData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ─── CHARTS ROW 2: Inventory Pie + Daily Leads ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, marginBottom: 24 }}>
        <ChartCard title="Inventory by Brand" subtitle={`${inventoryOnLot} total units`}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={inventoryByBrand} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value">
                {inventoryByBrand.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily Leads vs Conversions" subtitle="Last 14 days">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dailyLeads} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="leads" fill="#d1d5db" radius={[4, 4, 0, 0]} barSize={16} name="Leads" />
              <Bar dataKey="converted" fill="#0f3460" radius={[4, 4, 0, 0]} barSize={16} name="Converted" />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ─── CHARTS ROW 3: Agent Performance + Aging + Price Range ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
        <ChartCard title="Agent Performance" subtitle="Deals this month">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={agentPerformance} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="deals" fill="#2a9d8f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Inventory Aging" subtitle="Days on lot distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={agingData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {agingData.map((entry, i) => (
                  <Cell key={i} fill={i === agingData.length - 1 ? '#dc2626' : i >= agingData.length - 2 ? '#f59e0b' : '#0f3460'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Price Distribution" subtitle="Listing price ranges (JOD)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priceRangeData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ─── MAIN CONTENT GRID: Trends + Activity Feed ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 28 }}>
        {/* LEFT — Trend Analysis */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} style={{ color: '#111827' }} />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0 }}>Trend Analysis Dashboard</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 500 }}>Regional: Jordan</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {trendCards.length > 0 ? trendCards.map((card, idx) => (
              <TrendCard key={idx} tag={card.tag} tagColor={card.tagColor} title={card.title} desc={card.desc} metric={card.metric} actionLabel={card.actionLabel} actionColor={card.actionColor} />
            )) : (
              <>
                <div style={{ background: '#f9fafb', borderRadius: 10, padding: 20, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500, margin: 0, textAlign: 'center' }}>Trend insights will appear as enquiries and sales come in.</p>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: 10, padding: 20, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500, margin: 0, textAlign: 'center' }}>Add inventory and record sales to unlock trend analysis.</p>
                </div>
              </>
            )}
          </div>

          {/* Live Market Price Tracker */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: 0 }}>Live Market Price Tracker</h3>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}><MoreHorizontal size={18} /></button>
          </div>
          {liveMarketPriceTracker.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <th style={thStyle}>Model</th>
                  <th style={thStyle}>Market Avg</th>
                  <th style={thStyle}>Stock</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {liveMarketPriceTracker.map((row, idx) => (
                  <MarketRow 
                    key={idx}
                    model={row.model} 
                    avg={row.avg} 
                    precision={row.precision} 
                    precisionColor={row.precisionColor} 
                    status={row.status} 
                    statusColor={row.statusColor} 
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <BarChart3 size={28} style={{ color: '#d1d5db', marginBottom: 10 }} />
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af', margin: 0 }}>No inventory data yet</p>
              <p style={{ fontSize: '0.78rem', color: '#d1d5db', margin: '4px 0 0' }}>Add cars to your inventory to see price tracking.</p>
            </div>
          )}
        </div>

        {/* RIGHT — Activity Feed */}
        <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6 h-fit">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Zap size={16} style={{ color: '#f59e0b' }} />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0 }}>Activity Feed</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Clock size={32} style={{ color: '#d1d5db', marginBottom: 12 }} />
                <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#9ca3af', margin: 0 }}>No recent activity</p>
                <p style={{ fontSize: '0.78rem', color: '#d1d5db', margin: '4px 0 0' }}>Actions like adding cars, recording sales, and managing leads will appear here.</p>
              </div>
            ) : activities.map((item, idx) => {
              let icon = <Info size={16} />;
              let iconBg = "#dbeafe";
              let iconColor = "#2563eb";

              if (item.type === "lead") {
                icon = <UserPlus size={16} />;
                iconBg = "#dcfce7";
                iconColor = "#16a34a";
              } else if (item.type === "task") {
                icon = <Clock size={16} />;
                iconBg = "#fef3c7";
                iconColor = "#d97706";
              } else if (item.type === "sale") {
                icon = <DollarSign size={16} />;
                iconBg = "#e0e7ff";
                iconColor = "#4f46e5";
              } else if (item.type === "alert") {
                icon = <AlertTriangle size={16} />;
                iconBg = "#fee2e2";
                iconColor = "#dc2626";
              }

              return (
                <ActivityItem
                  key={item._id || idx}
                  icon={icon}
                  iconBg={iconBg}
                  iconColor={iconColor}
                  title={item.title}
                  desc={item.desc}
                  time={item.time}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── BOTTOM QUICK ACTIONS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <QuickAction icon={<Upload size={20} />} label="Upload CarSeer PDF" desc="Auto-fill vehicle specs" href="/stock/post-product" />
        <QuickAction icon={<Camera size={20} />} label="Quick Photo Upload" desc="Direct to OpenSooq/FB" href="/addcar" />
        <QuickAction icon={<UserPlus size={20} />} label="Register New Dealer" desc="B2B Trade Network" href="/agents" />
        <QuickAction icon={<BarChart3 size={20} />} label="Full Analytics" desc="Deep-dive market data" href="/market" />
      </div>
    </div>
  );
}


/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

function StatCard({ label, value, suffix = '', sub, trend }) {
  return (
    <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-6 flex flex-col justify-center transition-colors">
      <div className="text-[0.7rem] font-bold tracking-widest text-gray-400 dark:text-neutral-500 uppercase mb-2">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">
          {value}
        </span>
        {suffix && <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400">{suffix}</span>}
      </div>
      {sub && <span className="inline-block mt-2 text-xs font-semibold text-gray-400 dark:text-neutral-500">{sub}</span>}
    </div>
  );
}

function MiniStat({ icon, iconBg, iconColor, label, value, change, up }) {
  return (
    <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 px-5 py-4 flex items-center gap-3.5 transition-colors">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" 
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[0.72rem] font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wide">{label}</div>
        <div className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">{value}</div>
      </div>
      <span className={`text-[0.75rem] font-bold flex items-center gap-1 ${up ? 'text-green-600' : 'text-red-600'}`}>
        {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {change}
      </span>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-5 transition-colors">
      <div className="mb-4">
        <h3 className="text-[0.95rem] font-bold text-gray-900 dark:text-white m-0">{title}</h3>
        {subtitle && <p className="text-[0.78rem] text-gray-400 dark:text-neutral-500 m-0 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function TrendCard({ tag, tagColor, title, desc, metric, actionLabel, actionColor }) {
  return (
    <div style={{ background: '#f9fafb', borderRadius: 10, padding: 20, border: '1px solid #e5e7eb' }}>
      <span style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: 4,
        fontSize: '0.65rem', fontWeight: 700, color: '#fff',
        background: tagColor, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10,
      }}>{tag}</span>
      <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280' }}>{desc}</p>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 14, paddingTop: 12, borderTop: '1px solid #e5e7eb',
      }}>
        <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>{metric}</span>
        <span style={{
          fontSize: '0.75rem', fontWeight: 700, color: actionColor,
          padding: '4px 10px', borderRadius: 6,
          background: actionColor === '#dc2626' ? '#fef2f2' : '#f0f9ff',
        }}>{actionLabel}</span>
      </div>
    </div>
  );
}

const thStyle = {
  padding: '10px 12px', textAlign: 'left', fontWeight: 600,
  color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em',
};

function MarketRow({ model, avg, precision, precisionColor, status, statusColor }) {
  return (
    <tr style={{ borderBottom: '1px solid #f9fafb' }}>
      <td style={{ padding: '14px 12px', fontWeight: 600, color: '#111827' }}>{model}</td>
      <td style={{ padding: '14px 12px', color: '#6b7280' }}>{avg}</td>
      <td style={{ padding: '14px 12px', fontWeight: 700, color: precisionColor }}>{precision}</td>
      <td style={{ padding: '14px 12px' }}>
        <span style={{
          padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
          color: statusColor, border: `1.5px solid ${statusColor}`,
          background: statusColor === '#16a34a' ? '#f0fdf4' : statusColor === '#f59e0b' ? '#fffbeb' : '#f9fafb',
        }}>{status}</span>
      </td>
    </tr>
  );
}

function ActivityItem({ icon, iconBg, iconColor, title, desc, time, action }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: iconColor, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>{title}</div>
        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 2 }}>{desc}</div>
        {action && (
          <button style={{
            marginTop: 6, padding: '4px 12px', borderRadius: 6,
            border: '1px solid #e5e7eb', background: '#fff',
            fontSize: '0.75rem', fontWeight: 600, color: '#111827', cursor: 'pointer',
          }}>{action}</button>
        )}
        <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 4 }}>{time}</div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, desc, href }) {
  const content = (
    <div className="flex items-center gap-4 bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-white/10 p-4 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-white/20 transition-all text-inherit no-underline">
      <div className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-[#111111] flex items-center justify-center text-gray-600 dark:text-neutral-400 shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[0.9rem] font-bold text-gray-900 dark:text-white">{label}</div>
        <div className="text-[0.78rem] text-gray-400 dark:text-neutral-500">{desc}</div>
      </div>
      <ChevronRight className="w-4.5 h-4.5 text-gray-300 dark:text-gray-600" />
    </div>
  );

  if (href) return <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link>;
  return content;
}
