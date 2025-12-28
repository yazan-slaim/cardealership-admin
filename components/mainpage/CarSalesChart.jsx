"use client";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function CarSalesChart() {
  // Format the month and year from the `_id` object containing `year` and `month`
  const formatDateToMonthYear = (id) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[id.month - 1]} ${id.year}`; // `id.month` is 1-indexed
  };

  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 7) + "-01" // Start of this month
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().slice(0, 10) // Today's date
  );
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sales Count",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: [],
        fill: false,
      },
    ],
  });
  const [loading, setLoading] = useState(false);

  const fetchSalesData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    try {
      const res = await fetch(`/api/madesale?${params}`);
      const data = await res.json();

      setChartData({
        labels: data.map((item) => formatDateToMonthYear(item._id)), // Format `_id` as "Month Year"
        datasets: [
          {
            label: "Sales Count",
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            data: data.map((item) => item.count), // Use the `count` property for sales count
            fill: false,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch sales data", error);
    } finally {
      setLoading(false);
    }
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
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <label style={{ color: "white", marginRight: "1rem" }}>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ color: "black", marginLeft: "0.5rem" }}
          />
        </label>
        <label style={{ color: "white", marginRight: "1rem" }}>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ color: "black", marginLeft: "0.5rem" }}
          />
        </label>
        <button
          type="submit"
          style={{
            color: "white",
            backgroundColor: "#4CAF50",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Update Chart
        </button>
      </form>

      {loading ? (
        <p style={{ color: "white" }}>Loading...</p>
      ) : (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: { color: "white" },
              },
              tooltip: { enabled: true },
            },
            scales: {
              x: { ticks: { color: "white" } },
              y: { ticks: { color: "white" }, beginAtZero: true },
            },
          }}
        />
      )}
    </div>
  );
}

export default CarSalesChart;
