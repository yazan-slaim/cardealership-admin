'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

export default function DateFilteredEmployeeRevenueChart() {
  const theme = useTheme();

  // date inputs
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
  const [series, setSeries] = useState([]); // [{ employeeName, totalRevenue, units }]

  useEffect(() => {
    if (!startDate || !endDate) return;

    const params = new URLSearchParams({ startDate, endDate });

    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/analytics/newpagecharts/employeeRevenue?${params}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to load employee revenue');
        setSeries(json.data || []);
      } catch (e) {
        console.error('[EmployeeRevenueChart]', e);
        setError(e?.message || 'Failed to load employee revenue');
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate]);

  // labels and values
  const labels = useMemo(() => series.map(d => d.employeeName || 'Unknown'), [series]);
  const revenues = useMemo(() => series.map(d => d.totalRevenue ?? 0), [series]);

  // colors
  const colors = useMemo(
    () => labels.map((_, i) => alpha(theme.palette.primary.main, 0.5 + (i * 0.1) % 0.5)),
    [labels, theme]
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data: revenues,
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    }),
    [labels, revenues, colors]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y', // horizontal bars ✅
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: theme.palette.background.paper,
          titleColor: theme.palette.text.primary,
          bodyColor: theme.palette.text.secondary,
          borderColor: theme.palette.divider,
          borderWidth: 1,
          callbacks: {
            label: (ctx) =>
              `Revenue: $${Number(ctx.parsed.x || 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: theme.palette.text.secondary,
            callback: (v) => `$${Number(v).toLocaleString()}`,
          },
          grid: { color: alpha(theme.palette.divider, 0.2) },
        },
        y: {
          ticks: { color: theme.palette.text.secondary },
          grid: { display: false },
        },
      },
    }),
    [theme]
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
            onChange={(e) => setStartInput(e.target.value)}
            style={{ padding: 6, color: 'black' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>End date</span>
          <input
            type="date"
            value={endInput}
            onChange={(e) => setEndInput(e.target.value)}
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
            background: loading
              ? alpha(theme.palette.primary.main, 0.15)
              : theme.palette.background.paper,
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Updating…' : 'Update'}
        </button>
      </form>

      {error ? (
        <div style={{ color: theme.palette.error.main }}>{error}</div>
      ) : (
        <div style={{ height: 320 }}>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
