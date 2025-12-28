"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const CarMakeSalesChart = ({ carMakeSales }) => {
  // Prepare labels (car makes) and data (number of cars sold) for the chart
  const labels = carMakeSales.map((entry) => entry._id);
  const dataValues = carMakeSales.map((entry) => entry.count || 0); // Use 0 if count is null or undefined

  // Data for the chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Cars Sold",
        data: dataValues,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Car Make Sales Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default CarMakeSalesChart;
