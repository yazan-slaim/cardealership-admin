'use client';

import { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function DateFilteredLeadFunnelChart() {
  const theme = useTheme();
  const [data, setData] = useState([]);

  const [start, setStart] = useState("2025-09-01");
  const [end, setEnd] = useState("2025-09-30");

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/analytics/newpagecharts/leadFunnel?startDate=${start}&endDate=${end}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    })();
  }, [start, end]);

  const labels = useMemo(() => data.map((d) => d.stage), [data]);
  const values = useMemo(() => data.map((d) => d.count), [data]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Leads",
        data: values,
        backgroundColor: labels.map((_, i) =>
          alpha(theme.palette.primary.main, 0.6 - i * 0.1)
        ),
      },
    ],
  };

  const options = {
    indexAxis: "y", // horizontal bars
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.x} leads`,
        },
      },
    },
    scales: {
      x: { beginAtZero: true },
      y: { reverse: true }, // "funnel" effect
    },
  };

  return <Bar data={chartData} options={options} />;
}
