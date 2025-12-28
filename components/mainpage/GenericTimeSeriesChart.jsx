'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

/**
 * GenericTimeSeriesChart
 * 
 * Props:
 * - entity        ('agentRevenue'|'carSales'|'inventory'|'tasks'|'leads', required)
 * - chartType     ('line'|'bar'|'pie'|'doughnut', required)
 * - filters       (object, optional -> e.g. { agentId })
 * - granularity   ('day'|'week'|'month'|'year', optional)
 * - filled        (boolean, optional) -> for line charts
 * - color         (string, optional) -> default = theme.palette.primary.main
 */
export default function GenericTimeSeriesChart({
  entity,
  chartType = 'line',
  filters = {},
  granularity,
  filled = false,
  color,
}) {
  const theme = useTheme();
  const canvasRef = useRef(null);

  // default date range = current month
  const defaultStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const defaultEnd = new Date().toISOString().slice(0, 10);

  const [startInput, setStartInput] = useState(defaultStart);
  const [endInput, setEndInput] = useState(defaultEnd);

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [series, setSeries] = useState([]); // API data
  const [unitUsed, setUnitUsed] = useState('');

  // fetch data when props / dates change
  useEffect(() => {
    if (!entity || !startDate || !endDate) return;

    const params = new URLSearchParams({
      entity,
      startDate,
      endDate,
    });
    if (granularity) params.append('granularity', granularity);
    for (const [k, v] of Object.entries(filters)) {
      if (v) params.append(k, v);
    }

    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/analytics/multiplecharts?${params}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to load data');
        setSeries(json.data || []);
        setUnitUsed(json.unit || '');
      } catch (e) {
        console.error('[GenericTimeSeriesChart]', e);
        setError(e?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    })();
  }, [entity, filters, startDate, endDate, granularity]);

  // labels + values
  const labels = useMemo(() => series.map(d => d.label), [series]);
  const values = useMemo(() => series.map(d => d.total ?? d.count ?? 0), [series]);

  // fill gradient for line chart
  const mainColor = color || theme.palette.primary.main;
  const gradientFill = useMemo(() => {
    if (!filled || chartType !== 'line') return undefined;
    const ctx = canvasRef.current?.getContext?.('2d');
    if (!ctx) return undefined;
    const g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    g.addColorStop(0, alpha(mainColor, 0.25));
    g.addColorStop(1, alpha(mainColor, 0.02));
    return g;
  }, [filled, mainColor, chartType, series.length]);

  // chart.js dataset config
  const data = useMemo(() => {
    if (chartType === 'pie' || chartType === 'doughnut') {
      return {
        labels,
        datasets: [
          {
            label: entity,
            data: values,
            backgroundColor: [
              mainColor,
              theme.palette.secondary.main,
              theme.palette.error.main,
              theme.palette.success.main,
              theme.palette.warning.main,
            ],
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          label: entity,
          data: values,
          borderColor: mainColor,
          backgroundColor: gradientFill || mainColor,
          fill: !!gradientFill,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
        },
      ],
    };
  }, [labels, values, entity, chartType, mainColor, gradientFill]);

  // chart.js options
  const options = useMemo(
    () => ({
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
            label: ctx => {
              const val = ctx.parsed.y ?? ctx.parsed;
              return `${entity}: ${Number(val).toLocaleString()}`;
            },
          },
        },
      },
      scales:
        chartType === 'line' || chartType === 'bar'
          ? {
              x: {
                ticks: { color: theme.palette.text.secondary, autoSkip: true },
                grid: { color: alpha(theme.palette.divider, 0.2) },
              },
              y: {
                ticks: {
                  color: theme.palette.text.secondary,
                  callback: v => Number(v).toLocaleString(),
                },
                grid: { color: alpha(theme.palette.divider, 0.2) },
                beginAtZero: true,
              },
            }
          : {},
    }),
    [theme, chartType, entity]
  );

  function onSubmit(e) {
    e.preventDefault();
    if (new Date(startInput) > new Date(endInput)) {
      setError('Start date must be before end date');
      return;
    }
    setStartDate(startInput);
    setEndDate(endInput);
  }

  // choose chart component dynamically
  const ChartComp = chartType === 'bar' ? Bar : chartType === 'pie' ? Pie : chartType === 'doughnut' ? Doughnut : Line;

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
            style={{ padding: 6, color: 'black' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>End date</span>
          <input
            type="date"
            value={endInput}
            onChange={e => setEndInput(e.target.value)}
            style={{ padding: 6, color: 'black' }}
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
          <ChartComp ref={canvasRef} data={data} options={options} />
        </div>
      )}
    </div>
  );
}
