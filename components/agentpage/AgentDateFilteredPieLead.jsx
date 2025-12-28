'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTheme, alpha, lighten, darken } from '@mui/material/styles';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Props:
 * - agentId (string, required)
 * - size    (number, optional) -> height in px, default 280
 */
export default function AgentLeadSourcesPie({ agentId, size = 280 }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [rows, setRows]       = useState([]); // [{ _id: 'phone', count: 12 }, ...]

  useEffect(() => {
    if (!agentId) return;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/employee/fetch-leadsource?agentId=${agentId}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to load lead sources');
        setRows(json.data || []);
      } catch (e) {
        console.error('[AgentLeadSourcesPie]', e);
        setError(e?.message || 'Failed to load lead sources');
      } finally {
        setLoading(false);
      }
    })();
  }, [agentId]);

  const labels = useMemo(() => rows.map(r => r._id || 'Unknown'), [rows]);
  const values = useMemo(() => rows.map(r => r.count || 0), [rows]);

  // Build a pleasant color palette from theme
  const colorPool = useMemo(() => {
    const p = theme.palette;
    const base = [
      p.primary.main,
      p.secondary?.main || lighten(p.primary.main, 0.2),
      p.success.main,
      p.info.main,
      p.warning.main,
      p.error.main,
      lighten(p.primary.main, 0.35),
      darken(p.primary.main, 0.2),
      alpha(p.primary.main, 0.8),
      alpha(p.secondary?.main || p.primary.main, 0.8),
    ];
    // cycle if more slices than colors
    return labels.map((_, i) => base[i % base.length]);
  }, [labels, theme]);

  const data = useMemo(() => ({
    labels,
    datasets: [{
      label: 'Leads',
      data: values,
      backgroundColor: colorPool,
      borderColor: theme.palette.background.paper,
      borderWidth: 1,
    }],
  }), [labels, values, colorPool, theme]);

  const options = useMemo(() => ({
    plugins: {
      legend: { labels: { color: theme.palette.text.secondary } },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        callbacks: {
          label: (ctx) => {
            const v = Number(ctx.parsed) || 0;
            const total = values.reduce((a, b) => a + b, 0) || 1;
            const pct = Math.round((v / total) * 100);
            return `${ctx.label}: ${v} (${pct}%)`;
          },
        },
      },
    },
  }), [theme, values]);

  if (loading) return <p style={{ color: theme.palette.text.secondary }}>Loading…</p>;
  if (error)   return <p style={{ color: theme.palette.error.main }}>{error}</p>;
  if (!rows.length) return <p style={{ color: theme.palette.text.secondary, margin: 0 }}>No leads this month.</p>;

  return (
    <div style={{ height: size }}>
      <Pie data={data} options={options} />
    </div>
  );
}
