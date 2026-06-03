'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Upload, Camera, UserPlus, ArrowUpRight, ArrowDownRight,
  FileText, MessageSquare, AlertTriangle, Flame,
  MoreHorizontal, Zap, ChevronRight, Clock, DollarSign, Car,
  Users, BarChart3, PieChart as PieChartIcon, Target, ShieldCheck
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

/* ================================================================
   FAKE DATA — Realistic dealership metrics
   ================================================================ */

// Monthly revenue trend (last 6 months)
const revenueData = [
  { month: 'Jan', revenue: 62000, units: 8 },
  { month: 'Feb', revenue: 78000, units: 11 },
  { month: 'Mar', revenue: 54000, units: 7 },
  { month: 'Apr', revenue: 91000, units: 13 },
  { month: 'May', revenue: 84200, units: 12 },
  { month: 'Jun', revenue: 97000, units: 14 },
];

// Lead pipeline funnel
const leadFunnelData = [
  { stage: 'Website Visit', count: 1240, fill: '#e0e7ff' },
  { stage: 'Enquiry', count: 380, fill: '#c7d2fe' },
  { stage: 'Test Drive', count: 145, fill: '#818cf8' },
  { stage: 'Negotiation', count: 82, fill: '#6366f1' },
  { stage: 'Closed Won', count: 34, fill: '#4338ca' },
];

// Inventory by brand
const inventoryByBrand = [
  { name: 'Toyota', value: 32, color: '#0f3460' },
  { name: 'BMW', value: 18, color: '#1e6091' },
  { name: 'Mercedes', value: 24, color: '#2a9d8f' },
  { name: 'BYD', value: 15, color: '#e9c46a' },
  { name: 'Tesla', value: 12, color: '#f4a261' },
  { name: 'Hyundai', value: 21, color: '#e76f51' },
  { name: 'Other', value: 20, color: '#94a3b8' },
];

// Agent performance
const agentPerformance = [
  { name: 'Omar', deals: 8, revenue: 42000, conversion: 32 },
  { name: 'Lina', deals: 6, revenue: 36000, conversion: 28 },
  { name: 'Samir', deals: 5, revenue: 28000, conversion: 24 },
  { name: 'Ahmad', deals: 4, revenue: 22000, conversion: 18 },
  { name: 'Rania', deals: 3, revenue: 19000, conversion: 15 },
];

// Daily leads (last 14 days)
const dailyLeads = [
  { day: '20/5', leads: 12, converted: 3 },
  { day: '21/5', leads: 18, converted: 4 },
  { day: '22/5', leads: 8, converted: 1 },
  { day: '23/5', leads: 22, converted: 6 },
  { day: '24/5', leads: 15, converted: 3 },
  { day: '25/5', leads: 9, converted: 2 },
  { day: '26/5', leads: 6, converted: 1 },
  { day: '27/5', leads: 19, converted: 5 },
  { day: '28/5', leads: 24, converted: 7 },
  { day: '29/5', leads: 16, converted: 4 },
  { day: '30/5', leads: 21, converted: 5 },
  { day: '31/5', leads: 28, converted: 8 },
  { day: '1/6', leads: 14, converted: 3 },
  { day: '2/6', leads: 20, converted: 6 },
];

// Inventory aging distribution
const agingData = [
  { range: '0-15d', count: 42 },
  { range: '16-30d', count: 35 },
  { range: '31-45d', count: 28 },
  { range: '46-60d', count: 18 },
  { range: '60d+', count: 12 },
];

// Price range distribution
const priceRangeData = [
  { range: '< 10K', count: 8 },
  { range: '10-20K', count: 32 },
  { range: '20-35K', count: 45 },
  { range: '35-50K', count: 28 },
  { range: '50-75K', count: 15 },
  { range: '75K+', count: 7 },
];

/* ================================================================
   DASHBOARD COMPONENT
   ================================================================ */

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

  const {
    revenueMTD = 0,
    soldunits = 0,
    inventoryOnLot = 0,
    closedLeadsPM = 0,
    conversionPM = 0,
    avgDeal = 0,
    agingStock60d = 0,
  } = data || {};

  const activeInventory = inventoryOnLot || 142;
  const totalSales = revenueMTD || 84200;
  const hotLeads = closedLeadsPM || 28;
  const conversion = conversionPM || 24.5;
  const avgDealSize = avgDeal || 6800;
  const aging60 = agingStock60d || 12;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1440, margin: '0 auto' }}>

      {/* ─── HEADER ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Market Intelligence Overview
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 4 }}>
            Real-time insights from Amman, Irbid, and Zarqa trade zones.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/stock/post-product" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10, border: '1px solid #e2e8f0',
            background: '#fff', color: '#0f172a', fontSize: '0.85rem', fontWeight: 600,
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
            <Zap size={16} /> Quick CliQ Top-up
          </button>
        </div>
      </div>

      {/* ─── STAT CARDS ROW ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="ACTIVE INVENTORY" value={activeInventory} badge="+12% vs LY" badgeColor="#16a34a" trend="up" />
        <StatCard label="TOTAL SALES (FE GROSS)" value={`${(totalSales / 1000).toFixed(1)}K`} suffix="JOD" sub="Updated 4 mins ago" />
        <div style={{
          background: 'linear-gradient(135deg, #0f3460 0%, #1a5276 100%)', borderRadius: 12, padding: '20px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff',
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.7, textTransform: 'uppercase' }}>HOT LEAD COUNT</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{hotLeads}</span>
          </div>
          <span style={{ display: 'inline-block', marginTop: 8, fontSize: '0.75rem', fontWeight: 600, color: '#93c5fd' }}>{soldunits || 4} converted since morning</span>
        </div>
      </div>

      {/* ─── SECONDARY STAT ROW ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <MiniStat icon={<Target size={18} />} iconBg="#dbeafe" iconColor="#2563eb" label="Lead Conversion" value={`${conversion}%`} change="+3.2%" up={true} />
        <MiniStat icon={<DollarSign size={18} />} iconBg="#dcfce7" iconColor="#16a34a" label="Avg Deal Size" value={`${avgDealSize.toLocaleString()} JOD`} change="+8%" up={true} />
        <MiniStat icon={<Clock size={18} />} iconBg="#fef3c7" iconColor="#d97706" label="Avg Days to Sell" value="23 days" change="-4 days" up={true} />
        <MiniStat icon={<AlertTriangle size={18} />} iconBg="#fee2e2" iconColor="#dc2626" label="Aging Stock (60d+)" value={`${aging60} units`} change="+2" up={false} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#0f3460" strokeWidth={2.5} fill="url(#colorRev)" />
              <Line type="monotone" dataKey="units" stroke="#e76f51" strokeWidth={2} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Lead Pipeline Funnel" subtitle="Current month">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={leadFunnelData} layout="vertical" barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="stage" width={100} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
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
        <ChartCard title="Inventory by Brand" subtitle={`${activeInventory} total units`}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={inventoryByBrand} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value">
                {inventoryByBrand.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily Leads vs Conversions" subtitle="Last 14 days">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dailyLeads} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="leads" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={16} name="Leads" />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="deals" fill="#2a9d8f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Inventory Aging" subtitle="Days on lot distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={agingData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ─── MAIN CONTENT GRID: Trends + Activity Feed ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 28 }}>
        {/* LEFT — Trend Analysis */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} style={{ color: '#0f172a' }} />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Trend Analysis Dashboard</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Regional: Jordan</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <TrendCard tag="TRENDING IN IRBID" tagColor="#dc2626" title="BYD Dolphin" desc="Searches up 22% in last 48h" metric="Avg. Ask: 16,400 JOD" actionLabel="+1.2k Leads/mo" actionColor="#0f3460" />
            <TrendCard tag="FB MARKETPLACE ALERT" tagColor="#0284c7" title="Toyota Ioniq 5" desc="Supply dropped 15% in Zarqa" metric="Market Heat: High" actionLabel="Hold Inventory" actionColor="#dc2626" />
          </div>

          {/* Live Market Price Tracker */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Live Market Price Tracker (Amman Central)</h3>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}><MoreHorizontal size={18} /></button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th style={thStyle}>Model</th>
                <th style={thStyle}>Market Avg</th>
                <th style={thStyle}>Precision Index</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              <MarketRow model="Tesla Model 3 2023" avg="32,500 JOD" precision="31,900 JOD" precisionColor="#0284c7" status="HOT" statusColor="#16a34a" />
              <MarketRow model="Mercedes EQE 2024" avg="58,000 JOD" precision="59,200 JOD" precisionColor="#0284c7" status="COLD" statusColor="#94a3b8" />
              <MarketRow model="VW ID.4 Crozz" avg="24,800 JOD" precision="24,400 JOD" precisionColor="#0284c7" status="HOT" statusColor="#16a34a" />
              <MarketRow model="BYD Dolphin 2024" avg="16,400 JOD" precision="15,800 JOD" precisionColor="#dc2626" status="HOT" statusColor="#16a34a" />
              <MarketRow model="Hyundai Tucson 2023" avg="28,900 JOD" precision="29,100 JOD" precisionColor="#16a34a" status="WARM" statusColor="#f59e0b" />
            </tbody>
          </table>
        </div>

        {/* RIGHT — Activity Feed */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Zap size={16} style={{ color: '#f59e0b' }} />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Activity Feed</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ActivityItem icon={<Flame size={16} />} iconBg="#dcfce7" iconColor="#16a34a" title="New Lead: Spending high time" desc="Client spent 6 mins on IONIQ 5 (White)" time="2 minutes ago" />
            <ActivityItem icon={<FileText size={16} />} iconBg="#dbeafe" iconColor="#2563eb" title="CarSeer PDF Synced" desc="Synced to 2023 Tesla Model Y" time="45 minutes ago" action="View Report" />
            <ActivityItem icon={<MessageSquare size={16} />} iconBg="#e0e7ff" iconColor="#4f46e5" title="WhatsApp Doc Received" desc="Buyer sent ID photo for 'Ahmad Ali'" time="1 hour ago" />
            <ActivityItem icon={<AlertTriangle size={16} />} iconBg="#fee2e2" iconColor="#dc2626" title="Market Anomaly Alert" desc="VW ID.6 price dropped by 2k JOD in Amman Free Zone." time="2 hours ago" />
            <ActivityItem icon={<ShieldCheck size={16} />} iconBg="#dcfce7" iconColor="#16a34a" title="Fahas Report Ready" desc="BMW X5 2022 — Score: 4 Good" time="3 hours ago" action="View Report" />
            <ActivityItem icon={<Car size={16} />} iconBg="#fef3c7" iconColor="#d97706" title="Test Drive Completed" desc="Ahmad K. drove Tesla Model 3 for 25 mins" time="4 hours ago" />
          </div>
        </div>
      </div>

      {/* ─── BOTTOM QUICK ACTIONS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <QuickAction icon={<Upload size={20} />} label="Upload CarSeer PDF" desc="Auto-fill vehicle specs" href="/stock/post-product" />
        <QuickAction icon={<Camera size={20} />} label="Quick Photo Upload" desc="Direct to OpenSooq/FB" />
        <QuickAction icon={<UserPlus size={20} />} label="Register New Dealer" desc="B2B Trade Network" />
        <QuickAction icon={<BarChart3 size={20} />} label="Full Analytics" desc="Deep-dive market data" href="/market" />
      </div>
    </div>
  );
}


/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

function StatCard({ label, value, suffix, badge, badgeColor, sub, trend }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '20px 24px',
    }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
        <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</span>
        {suffix && <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{suffix}</span>}
        {trend === 'up' && <ArrowUpRight size={16} style={{ color: '#16a34a' }} />}
        {trend === 'down' && <ArrowDownRight size={16} style={{ color: '#dc2626' }} />}
      </div>
      {badge && <span style={{ display: 'inline-block', marginTop: 8, fontSize: '0.75rem', fontWeight: 600, color: badgeColor || '#16a34a' }}>{badge}</span>}
      {sub && <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>{sub}</p>}
    </div>
  );
}

function MiniStat({ icon, iconBg, iconColor, label, value, change, up }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
      padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{value}</div>
      </div>
      <span style={{
        fontSize: '0.75rem', fontWeight: 700,
        color: up ? '#16a34a' : '#dc2626',
        display: 'flex', alignItems: 'center', gap: 2,
      }}>
        {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {change}
      </span>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20,
    }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function TrendCard({ tag, tagColor, title, desc, metric, actionLabel, actionColor }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 10, padding: 20, border: '1px solid #e2e8f0' }}>
      <span style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: 4,
        fontSize: '0.65rem', fontWeight: 700, color: '#fff',
        background: tagColor, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10,
      }}>{tag}</span>
      <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>{desc}</p>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 14, paddingTop: 12, borderTop: '1px solid #e2e8f0',
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
  color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em',
};

function MarketRow({ model, avg, precision, precisionColor, status, statusColor }) {
  return (
    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
      <td style={{ padding: '14px 12px', fontWeight: 600, color: '#0f172a' }}>{model}</td>
      <td style={{ padding: '14px 12px', color: '#64748b' }}>{avg}</td>
      <td style={{ padding: '14px 12px', fontWeight: 700, color: precisionColor }}>{precision}</td>
      <td style={{ padding: '14px 12px' }}>
        <span style={{
          padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
          color: statusColor, border: `1.5px solid ${statusColor}`,
          background: statusColor === '#16a34a' ? '#f0fdf4' : statusColor === '#f59e0b' ? '#fffbeb' : '#f8fafc',
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
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{title}</div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>{desc}</div>
        {action && (
          <button style={{
            marginTop: 6, padding: '4px 12px', borderRadius: 6,
            border: '1px solid #e2e8f0', background: '#fff',
            fontSize: '0.75rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer',
          }}>{action}</button>
        )}
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>{time}</div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, desc, href }) {
  const content = (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
      padding: '16px 20px', cursor: 'pointer', transition: 'all 0.15s', textDecoration: 'none', color: 'inherit',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: '#f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{label}</div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{desc}</div>
      </div>
      <ChevronRight size={18} style={{ color: '#cbd5e1' }} />
    </div>
  );

  if (href) return <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link>;
  return content;
}
