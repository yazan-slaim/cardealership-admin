'use client'
import React from 'react'
import styled from '@emotion/styled'
import GenericTimeSeriesChart from './GenericTimeSeriesChart'
import DateFilteredRevenueChart from './Charts/DateFilteredRevenueChart'
import DateFilteredSalesCarMake from './Charts/DataFilteredSalesCarMake'
import DateFilteredEmployeeRevenueChart from './Charts/DateFilteredEmployeeRevenueChart'
import DateFilteredLeadFunnelChart from './Charts/DateFilteredLeadFunnelChart'
import DateFilteredInventoryMovementChart from './Charts/DateFilteredInventoryMovementChart'
import DateFilteredAvgDealSizeChart from './Charts/DateFilteredAvgDealSizeChart'

// layout grid
const Section = styled.section`
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
`

const Card = styled.div`
  grid-column: span 12;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  padding: 16px;
  min-height: 280px;

  @media (min-width: 1024px) {
    &.half { grid-column: span 6; }
  }
`

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
`

const Placeholder = styled.div`
  flex: 1;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.9rem;
  height: 200px;
`
const SectionTitle = styled.h2`
  font-size: 2.9rem;
  font-weight: 600;
`

export default function MiddleSection() {
  return (
    <>
    <SectionTitle>Middle-Section</SectionTitle>


    <Section>

      {/* row 1 */}
      <Card className="half">
  <CardTitle>📊 Agent / Salesperson Performance</CardTitle>
  <DateFilteredRevenueChart />
</Card>
      <Card className="half">
        <CardTitle>🥧 Sales by Car Make / Model</CardTitle>
        <DateFilteredSalesCarMake/>
      </Card>

      {/* row 2 */}
      <Card className="half">
        <CardTitle>📊 Agent / Salesperson Performance</CardTitle>
        <DateFilteredEmployeeRevenueChart/>
      </Card>
      <Card className="half">
        <CardTitle>📉 Lead Funnel</CardTitle>
        <DateFilteredLeadFunnelChart/>
      </Card>

      {/* row 3 */}
      <Card className="half">
        <CardTitle>🚗 Inventory Movement</CardTitle>
        <DateFilteredInventoryMovementChart/>
      </Card>
      <Card className="half">
        <CardTitle>💵 Avg Deal Size Trend</CardTitle>
        <DateFilteredAvgDealSizeChart/>
      </Card>

     
    </Section>
        </>

  )
}
