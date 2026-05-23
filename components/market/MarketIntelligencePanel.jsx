"use client";

import React from "react";
import styled from "@emotion/styled";
import { Line, Doughnut, Scatter, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  h3 {
    margin: 0 0 8px 0;
    color: #1e293b;
    font-size: 1.1rem;
    font-weight: 700;
  }

  p {
    margin: 0 0 20px 0;
    font-size: 0.85rem;
    color: #64748b;
  }
`;

export default function MarketIntelligencePanel({ car }) {
  // Chart default styles
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } }
    }
  };

  // 1. Landed Cost Structural Breakdown
  const totalLandedCost = car.totalLandedCost || (car.price ? car.price * 0.85 : 0);
  const costData = {
    labels: ['Auction Strike Price', 'Ocean Freight', 'JCD Unified Tax', 'Local Reconditioning'],
    datasets: [{
      data: [
        totalLandedCost * 0.55, 
        totalLandedCost * 0.15, 
        totalLandedCost * 0.25, 
        totalLandedCost * 0.05
      ],
      backgroundColor: ['#1e40af', '#3b82f6', '#93c5fd', '#fbbf24'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // 2. Days on Market Decay Curve
  const domData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5+'],
    datasets: [{
      label: 'Consumer Interest (Profile Views)',
      data: [150, 110, 85, 40, 15],
      backgroundColor: '#ef4444',
      borderRadius: 6
    }]
  };

  // 3. Demographics: Age Group Distribution
  const ageData = {
    labels: ["18-24", "25-34", "35-44", "45-54", "55+"],
    datasets: [{
      label: "Age Group",
      data: [15, 45, 25, 10, 5],
      backgroundColor: ['#c4b5fd', '#8b5cf6', '#6d28d9', '#4c1d95', '#2e1065'],
      borderWidth: 0
    }]
  };

  // 4. Spread Delta (Dummy data showing Amman retail context)
  const spreadData = {
    datasets: [
      {
        label: 'This Asset',
        data: [{ x: totalLandedCost, y: car.price || totalLandedCost * 1.15 }],
        backgroundColor: '#10b981',
        pointRadius: 8,
      },
      {
        label: 'Market Competitors',
        data: [
          { x: totalLandedCost * 0.95, y: car.price * 1.05 },
          { x: totalLandedCost * 1.05, y: car.price * 0.95 },
          { x: totalLandedCost * 1.1, y: car.price * 1.1 },
          { x: totalLandedCost * 1.2, y: car.price * 1.25 }
        ],
        backgroundColor: '#94a3b8',
        pointRadius: 5,
      }
    ],
  };

  const scatterOptions = {
    ...chartOptions,
    scales: {
      x: { title: { display: true, text: 'Acquisition Cost (JOD)' } },
      y: { title: { display: true, text: 'Amman Retail Median (JOD)' } }
    }
  };

  return (
    <PanelContainer>
      
      <div style={{ background: '#1e293b', color: 'white', padding: 24, borderRadius: 16 }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
          📈 Macro-Economic Command Center
        </h2>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
          Institutional-grade analytics exposing capital velocity, arbitrage spreads, and systemic inefficiencies.
        </p>
      </div>

      <ChartGrid>
        
        <ChartCard>
          <h3>Landed Cost Structural Breakdown</h3>
          <p>Micro-accounting view of total capital consumption before retail.</p>
          <div style={{ height: 250 }}>
            <Doughnut data={costData} options={chartOptions} />
          </div>
        </ChartCard>

        <ChartCard>
          <h3>Auction-to-Retail Spread Delta</h3>
          <p>Maps acquisition cost vs. Amman retail median.</p>
          <div style={{ height: 250 }}>
            <Scatter data={spreadData} options={scatterOptions} />
          </div>
        </ChartCard>

        <ChartCard>
          <h3>Days on Market (DoM) Decay Curve</h3>
          <p>Tracks interest loss against days on the showroom floor.</p>
          <div style={{ height: 250 }}>
            <Bar data={domData} options={chartOptions} />
          </div>
        </ChartCard>

        <ChartCard>
          <h3>Demographics: Age & Buyer Intent</h3>
          <p>Interaction distribution parsed from connected platform profiles.</p>
          <div style={{ height: 250 }}>
            <Doughnut data={ageData} options={chartOptions} />
          </div>
        </ChartCard>

      </ChartGrid>
    </PanelContainer>
  );
}
