'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme, alpha, darken } from '@mui/material/styles';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

/**
 * Props:
 * - agentId        (string, required)
 * - lineColor      (string, optional)  -> defaults to theme.palette.primary.main
 * - granularity    ('day'|'week'|'month'|'year', optional)  -> force grouping; otherwise auto
 * - filled         (boolean, optional) -> fill under line (default false)
 */
export default function DateFilteredRevenueChart({ lineColor, granularity, filled = false }) {
  const theme = useTheme();
  const canvasRef = useRef(null);

  // date inputs (UI state)
  const defaultStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const defaultEnd = new Date().toISOString().slice(0, 10);

  const [startInput, setStartInput] = useState(defaultStart);
  const [endInput, setEndInput] = useState(defaultEnd);

  // applied range (drives fetch)
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [series, setSeries] = useState([]); // [{ unit, periodStart, label, total, count }]
  const [unitUsed, setUnitUsed] = useState(''); // returned by API

  // fetch when agentId / dates / granularity change
  useEffect(() => {
    if (!startDate || !endDate) return;

    const params = new URLSearchParams({startDate, endDate });
    if (granularity) params.append('granularity', granularity);

    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/analytics/newpagecharts/revenuechart?${params}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to load revenue series');
        setSeries(json.data || []);
        setUnitUsed(json.unit || '');
      } catch (e) {
        console.error('[AgentRevenueLineChart]', e);
        setError(e?.message || 'Failed to load revenue series');
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate, granularity]);

  // labels + values
  const labels = useMemo(() => series.map(d => d.label), [series]);
  const values = useMemo(() => series.map(d => d.total ?? 0), [series]);

  // line + (optional) fill gradient
  const color = lineColor || theme.palette.primary.main;
  const gradientFill = useMemo(() => {
    if (!filled) return undefined;
    const ctx = canvasRef.current?.getContext?.('2d');
    if (!ctx) return undefined;
    const g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    g.addColorStop(0, alpha(color, 0.25));
    g.addColorStop(1, alpha(color, 0.02));
    return g;
  }, [filled, color, series.length]); // recompute when data length changes

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: values,
        borderColor: color,
        backgroundColor: gradientFill || color,
        fill: !!gradientFill,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  }), [labels, values, color, gradientFill]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: theme.palette.text.secondary } },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `Revenue: $${Number(ctx.parsed.y || 0).toLocaleString()}`
        }
      },
    },
    scales: {
      x: {
        ticks: { color: theme.palette.text.secondary, maxRotation: 0, autoSkip: true },
        grid: { color: alpha(theme.palette.divider, 0.2) },
      },
      y: {
        ticks: {
          color: theme.palette.text.secondary,
          callback: (v) => `$${Number(v).toLocaleString()}`
        },
        grid: { color: alpha(theme.palette.divider, 0.2) },
        title: { display: true, text: 'Revenue', color: theme.palette.text.secondary },
        beginAtZero: true,
      },
    },
  }), [theme]);

  function onSubmit(e) {
    e.preventDefault();
    if (new Date(startInput) > new Date(endInput)) {
      setError('Start date must be before end date');
      return;
    }
    setStartDate(startInput);
    setEndDate(endInput);
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <form
        onSubmit={onSubmit}
        style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Start date</span>
          <input
            type="date"
            value={startInput}
            onChange={e => setStartInput(e.target.value)}
            style={{ padding: 6,color:"black" }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>End date</span>
          <input
            type="date"
            value={endInput}
            onChange={e => setEndInput(e.target.value)}
            style={{ padding: 6 ,color:"black" }}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 12px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
            background: loading ? alpha(theme.palette.primary.main, 0.15) : theme.palette.background.paper,
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Updating…' : 'Update'}
        </button>

        {unitUsed && (
          <span
            style={{
              marginLeft: 'auto',
              padding: '6px 10px',
              borderRadius: 999,
              border: `1px solid ${alpha(theme.palette.text.primary, 0.25)}`,
              fontSize: 12,
              color: theme.palette.text.secondary,
            }}
          >
            Grouping: {granularity || unitUsed}
          </span>
        )}
      </form>

      {error ? (
        <div style={{ color: theme.palette.error.main }}>{error}</div>
      ) : (
        <div style={{ height: 320 }}>
          <Line ref={canvasRef} data={data} options={options} />
        </div>
      )}
    </div>
  );
}
