"use client";

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";

// Register the components you want to use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CarSalesChart() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sales Count",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: [],
      },
    ],
  });

  const fetchSalesData = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const res = await fetch(`/api/getCarMakeSales?${params}`);
    const data = await res.json();

    setChartData({
      labels: data.map((item) => item._id),
      datasets: [
        {
          label: "Sales Count",
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          data: data.map((item) => item.count),
        },
      ],
    });
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSalesData();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label style={{ color: "white" }}>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ color: "black" }}
          />
        </label>
        <label style={{ color: "white" }}>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ color: "black" }}
          />
        </label>
        <button type="submit" style={{ color: "white" }}>
          Update Chart
        </button>
      </form>

      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
}

export default CarSalesChart;
