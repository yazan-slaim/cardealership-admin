'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useTheme, alpha, darken, lighten } from '@mui/material/styles';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useParams, useRouter } from 'next/navigation';

import { Bar, Pie } from 'react-chartjs-2';
import AgentDateFilteredCharts from '@/components/agentpage/AgentDateFilteredCharts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect,notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
import AgentLeadSourcesPie from '@/components/agentpage/AgentDateFilteredPieLead';
import AgentTasksPanel from '@/components/agentpage/AgentTasksPanel';

/* ---------- THEME-DRIVEN STYLES ---------- */

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  padding: theme.spacing(4),
  gap: theme.spacing(4),
  minHeight: '100vh',
}));

const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const StatsBox = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.25)}`,
  flex: 1,
}));

const Grid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '2fr 3fr',
  gap: theme.spacing(4),
  [theme.breakpoints.down('md')]: { gridTemplateColumns: '1fr' },
}));

const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  flexWrap: 'wrap',
}));

const Highlight = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: theme.typography.fontWeightBold,
}));

const Progress = styled('div')(({ theme }) => ({
  background: alpha(theme.palette.text.primary, 0.15),
  borderRadius: 999,
  overflow: 'hidden',
  height: 10,
  marginTop: theme.spacing(1),
}));

const ProgressBar = styled('div', {
  shouldForwardProp: (prop) => prop !== 'barWidth' && prop !== 'barColor',
})(({ theme, barWidth, barColor }) => ({
  background: barColor || theme.palette.primary.main,
  width: barWidth || '0%',
  height: '100%',
}));


const ProfileBox = styled(StatsBox)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
}));

const ProfileImage = styled('div')(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  borderRadius: '50%',
  backgroundColor: theme.palette.action.hover,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  color: theme.palette.primary.main,
  flexShrink: 0,
}));

const ProfileInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const Label = styled('span')(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.primary.main,
}));
const TaskCard = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  padding: 12,
  background: theme.palette.background.paper,
}));
const SoldList = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',   // vertical list
  gap: theme.spacing(1.5),
  maxHeight: 320,
  overflowY: 'auto',
  paddingRight: 4,
}));

const SoldCard = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  background: theme.palette.background.paper,
}));

const CarThumb = styled('img')({
  width: 50,
  height: 50,
  borderRadius: 6,
  objectFit: 'cover',
  flexShrink: 0,
});

const CarInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  overflow: 'hidden',
  fontSize: 14,
  lineHeight: 1.3,
}));


/* ---------- PAGE ---------- */

export default function SalesAgentDashboard() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession(); 
  const [authorized, setAuthorized] = useState(false);

  const theme = useTheme();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);

  const [unitStats, setUnitStats] = useState({ thisMonth: 0, lastMonth: 0, diff: 0, pct: 0 });
  const [revStats, setRevStats] = useState({ thisMonth: 0, lastMonth: 0, diff: 0, pct: 0 });

  const [soldCars, setSoldCars] = useState([]);
  const [soldLoading, setSoldLoading] = useState(false);

useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      const callback = `/agents/${id}`;
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(callback)}`);
      return;
    }

    const myId = session?.user?.id;
    const role = session?.user?.role;
    const isAdmin = role === 'admin';

    if (isAdmin || myId === id) {
      setAuthorized(true);
    } else {
      router.replace('/403');
    }
  }, [status, session, id, router]);
  

console.log(soldCars)

// ---- month windows
const now = new Date();
const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

// ---- pick the employee's sales array (adjust keys to your model)
const sales = employee?.deals || employee?.soldCars || []; // must be an array

// ---- date getter
const getSaleDate = (s) => new Date(s.createdAt || s.saleDate || s.SaleDate);

// ---- counts
const salesThisMonth = sales.filter((s) => {
  const d = getSaleDate(s);
  return d >= startOfThisMonth && d < startOfNextMonth;
}).length;

const salesLastMonth = sales.filter((s) => {
  const d = getSaleDate(s);
  return d >= startOfLastMonth && d < startOfThisMonth;
}).length;

// ---- delta + percent
const diff = salesThisMonth - salesLastMonth;
const pct = salesLastMonth === 0
  ? (salesThisMonth > 0 ? 100 : 0)
  : Math.round((diff / salesLastMonth) * 100);

const trendingUp = diff >= 0;
const trendColor = trendingUp ? theme.palette.success.main : theme.palette.error.main;
const arrow = trendingUp ? '↑' : '↓';
// ---- Tier schedule (edit thresholds/rates to your plan)
const TARGET = 45000;      // monthly target
const BRONZE_MAX = 150000;  // up to 250k is Bronze
const SILVER_MAX = 400000;  // example: 250k–400k Silver
// Commission rates (flat at tier)
const RATES = {
  bronze: 0.025,   // 2.5%
  silver: 0.030,   // 3.0%   <- tweak as you like
  gold:   0.035,   // 3.5%   <- tweak as you like
};

// Colors for bars/badges
function tierPalette(theme) {
  return {
    below: theme.palette.grey[600],
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
  };
}

function getTier(revenue, theme, target = TARGET) {
  const colors = tierPalette(theme);

  if (revenue < target) {
    return {
      key: 'below',
      name: 'Below Target',
      rate: 0,
      color: colors.below,
      nextThreshold: target,
    };
  }
  if (revenue < BRONZE_MAX) {
    return {
      key: 'bronze',
      name: 'Bronze',
      rate: RATES.bronze,
      color: colors.bronze,
      nextThreshold: BRONZE_MAX,
    };
  }
  if (revenue < SILVER_MAX) {
    return {
      key: 'silver',
      name: 'Silver',
      rate: RATES.silver,
      color: colors.silver,
      nextThreshold: SILVER_MAX,
    };
  }
  return {
    key: 'gold',
    name: 'Gold',
    rate: RATES.gold,
    color: colors.gold,
    nextThreshold: null, // top tier
  };
}


useEffect(() => {
  if (!id) return;

  async function fetchEmployee() {
    try {
      const res = await fetch(`/api/employee/get-employee?id=${id}`);
      const data = await res.json();
      if (data.success) setEmployee(data.employee);
      else setError(data.message || "Failed to load");
    } catch (e) {
      setError(e?.message || "Failed to load");
    }
  }

  async function fetchSales() {
    try {
      const res = await fetch(`/api/employee/fetch-sales-count?agentId=${id}`);
      const data = await res.json();
      if (data.success) {
        setUnitStats({
          thisMonth: data.thisMonth.units,
          lastMonth: data.lastMonth.units,
          diff: data.delta.units.diff,
          pct: data.delta.units.pct,
        });
      }
    } catch (e) {
      console.error("[fetchSales]", e);
    }
  }

  async function fetchRevenue() {
    try {
      const res = await fetch(`/api/employee/fetch-revenue?agentId=${id}`);
      const data = await res.json();
      if (data.success) {
        setRevStats({
          thisMonth: data.thisMonth.revenue,
          lastMonth: data.lastMonth.revenue,
          diff: data.delta.revenue.diff,
          pct: data.delta.revenue.pct,
        });
      }
    } catch (e) {
      console.error("[fetchRevenue]", e);
    }
  }

  fetchEmployee();
  fetchSales();
  fetchRevenue();
}, [id]);

console.log(employee)

// 3) color your bar chart by tier color (replace your existing barData useMemo)
 // no need to depend on theme if you only use tier.color


  const barOptions = useMemo(
    () => ({
      plugins: {
        legend: { labels: { color: theme.palette.text.secondary } },
        tooltip: {
          backgroundColor: theme.palette.background.paper,
          titleColor: theme.palette.text.primary,
          bodyColor: theme.palette.text.secondary,
          borderColor: theme.palette.divider,
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: { color: theme.palette.text.secondary },
          grid: { color: alpha(theme.palette.divider, 0.2) },
        },
        y: {
          ticks: { color: theme.palette.text.secondary },
          grid: { color: alpha(theme.palette.divider, 0.2) },
        },
      },
    }),
    [theme]
  );

  const pieData = useMemo(
    () => ({
      labels: ['Direct', 'Organic', 'Referral'],
      datasets: [
        {
          label: 'Traffic Sources',
          data: [55, 30, 15],
          backgroundColor: [
            theme.palette.primary.main,
            lighten(theme.palette.primary.main, 0.3),
            darken(theme.palette.primary.main, 0.2),
          ],
          borderColor: theme.palette.background.paper,
          borderWidth: 1,
        },
      ],
    }),
    [theme]
  );

  const pieOptions = useMemo(
    () => ({
      plugins: {
        legend: { labels: { color: theme.palette.text.secondary } },
        tooltip: {
          backgroundColor: theme.palette.background.paper,
          titleColor: theme.palette.text.primary,
          bodyColor: theme.palette.text.secondary,
          borderColor: theme.palette.divider,
          borderWidth: 1,
        },
      },
    }),
    [theme]
  );

  /* ---------- Safe early returns AFTER hooks ---------- */

  if (error) return <div style={{ color: theme.palette.error.main }}>Error: {error}</div>;
  if (!employee) return <div>Loading...</div>;

  /* ---------- Derived values (no hooks) ---------- */

  const totalTasks = employee?.tasks?.length || 0;
  const completedTasks = employee?.tasks?.filter((t) => t.completed).length || 0;
  const taskCompletionPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  /* ---------- UI ---------- */


async function toggleTaskComplete(task) {
  try {
    const res = await fetch('/api/tasks/tick-task', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: task._id, completed: !task.completed }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed');

    // update the task inside employee state
    setEmployee(prev =>
      !prev
        ? prev
        : { ...prev, tasks: prev.tasks.map(t => (t._id === task._id ? data.task : t)) }
    );
  } catch (e) {
    console.error('[toggleTaskComplete]', e);
  }
}
// after revStats is set
const tier = getTier(revStats.thisMonth, theme, TARGET);
console.log(tier)
const commissionThisMonth = +(revStats.thisMonth * tier.rate).toFixed(2);
const toNextTier = tier.nextThreshold != null
  ? Math.max(0, tier.nextThreshold - revStats.thisMonth)
  : 0;
  const barData ={
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [1200, 1500, 1700, 1800, 2200, 2400],
      backgroundColor: tier.color,           // tier color
      borderColor: darken(tier.color, 0.2),
      borderRadius: 6,
      borderSkipped: false,
    }]
  }
  const targetPct = Math.min(100, Math.round((revStats.thisMonth / TARGET) * 100));


  return (
    <Container>
      <Header>
        <div>
          <h1>
            <Highlight>{employee.totalSalesCount || 0}</Highlight> Points
          </h1>
          <p>
            Quota Conqueror — <Highlight>Silver</Highlight> Tier
          </p>
        </div>
        <div>
          <h2>
            <Highlight>Great Job!</Highlight>
          </h2>
          <p>Target 100%</p>
        </div>
      </Header>

      <ProfileBox>
        <ProfileImage>{employee.fullName?.charAt(0).toUpperCase()}</ProfileImage>
        <ProfileInfo>
          <h3>{employee.fullName}</h3>
          <p>
            <Label>Email:</Label> {employee.email}
          </p>
          <p>
            <Label>Phone:</Label> {employee.phoneNumber}
          </p>
          {employee.address && (
            <p>
              <Label>Address:</Label> {employee.address}
            </p>
          )}
          <p>
            <Label>Status:</Label> {employee.isActive ? 'Active' : 'Inactive'}
          </p>
        </ProfileInfo>
      </ProfileBox>

      <Row>
      <StatsBox>
  <h3>Units Sold</h3>
  <h1>
    <Highlight>{unitStats.thisMonth}</Highlight>
  </h1>
  <p style={{ color: (unitStats.diff >= 0 ? theme.palette.success.main : theme.palette.error.main) }}>
    {unitStats.diff >= 0 ? "↑" : "↓"} {Math.abs(unitStats.pct)}% ({unitStats.diff >= 0 ? "+" : ""}{unitStats.diff}) vs last month
    {unitStats.lastMonth === 0 && unitStats.thisMonth > 0 ? " — no sales last month" : ""}
  </p>
</StatsBox>


       <StatsBox>
  <h3>Revenue (This Month)</h3>
  <h1>
    <Highlight>${revStats.thisMonth.toLocaleString()}</Highlight>
  </h1>
  <p style={{ color: revStats.diff >= 0 ? theme.palette.success.main : theme.palette.error.main }}>
    {revStats.diff >= 0 ? "↑" : "↓"} {Math.abs(revStats.pct)}% ({revStats.diff >= 0 ? "+" : ""}${revStats.diff.toLocaleString()})
    &nbsp;vs last month{revStats.lastMonth === 0 && revStats.thisMonth > 0 ? " — no revenue last month" : ""}
  </p>
</StatsBox>

      </Row>

      <Row>
       <StatsBox>
  <h3>Cars Sold This Month</h3>
  {soldLoading ? (
    <p style={{ color: theme.palette.text.secondary }}>Loading...</p>
  ) : soldCars.length === 0 ? (
    <p style={{ color: theme.palette.text.secondary, margin: 0 }}>No cars sold this month.</p>
  ) : (
    <SoldList>
  {soldCars.map((s) => {
    const car = s.car || {};
    const img = Array.isArray(car.images) && car.images.length
      ? car.images[0]
      : '/placeholder-car.jpg';
    return (
      <SoldCard key={s._id}>
        <CarThumb src={img} alt={car.title || 'Car'} />
        <CarInfo>
          <strong style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {car.title || s.carTitle || 'Untitled'}
          </strong>
          <span style={{ color: theme.palette.text.secondary, fontSize: 13 }}>
            {car.carMake || '—'}
          </span>
          <span style={{ fontWeight: 500 }}>
            {typeof car.price === 'number'
              ? `$${car.price.toLocaleString()}`
              : (typeof s.salePrice === 'number'
                  ? `$${s.salePrice.toLocaleString()}`
                  : '—')}
          </span>
        </CarInfo>
      </SoldCard>
    );
  })}
</SoldList>

  )}
</StatsBox>

<StatsBox>

</StatsBox>
       
      </Row>

      <Grid>
    <StatsBox>
  <h3>
    <Highlight>{employee.fullName}</Highlight> — Sales Agent
  </h3>

  <p>Tasks Completed: {taskCompletionPercent}%</p>
  <Progress>
    <ProgressBar barWidth={`${taskCompletionPercent}%`} />
  </Progress>

  <p>Target Progress: {targetPct}%</p>
  <Progress>
  <ProgressBar barWidth={`${targetPct}%`} barColor={tier.color} />
</Progress>

<div style={{ marginTop: 12 }}>
  <strong>Tier:</strong> {tier.name}
  <span style={{
    padding: '2px 8px',
    borderRadius: 999,
    background: alpha(tier.color, 0.2),
    border: `1px solid ${alpha(tier.color, 0.5)}`,
    color: tier.color,
    marginLeft: 6
  }}>
    {tier.rate > 0 ? `${(tier.rate * 100).toFixed(1)}%` : '—'}
  </span>
  <br />
  <strong>Commission (This Month):</strong> ${commissionThisMonth.toLocaleString()}
  {tier.nextThreshold != null && (
    <>
      <br />
      <strong>To next tier:</strong> ${toNextTier.toLocaleString()}
    </>
  )}
</div>

</StatsBox>


   <StatsBox>
  <h3>Tasks</h3>
<AgentTasksPanel/>
</StatsBox>

      </Grid>

      <Row>
        <StatsBox>
          <h2>
            <Highlight>📊 Revenue Overview</Highlight>
          </h2>
  <AgentDateFilteredCharts agentId={id} />
        </StatsBox>

       <StatsBox>
  <h2><Highlight>📈 Lead Sources (This Month)</Highlight></h2>
  <AgentLeadSourcesPie agentId={id} size={450} />
</StatsBox>
      </Row>

      <StatsBox>
        <h2>
          <Highlight>🛠️ Quick Actions</Highlight>
        </h2>
        <p>Assign New Task</p>
        <p>Reassign Leads</p>
        <p>Reset Password</p>
        <p>Toggle Availability</p>
      </StatsBox>
    </Container>
  );
}
