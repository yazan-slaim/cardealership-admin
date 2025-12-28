'use client'
import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  padding: 1rem;
`
const SectionTitle = styled.h2`
  font-size: 2.9rem;
  font-weight: 600;
`
const LoadingText = styled.div`opacity: 0.6;`
const ErrorText = styled.div`color: #dc2626;`
const MetricBox = styled.div`margin-top: 1rem;`
const MetricTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: #374151;
`
const MetricValue = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 0.25rem;
`
const DateRange = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`

function TopSection() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/MTD', {
          method: 'GET',
          signal: ac.signal,
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const returnedData = await res.json()
        setData(returnedData)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    })()
    return () => ac.abort()
  }, [])

  // Safe destructuring with defaults
  const {
    revenueMTD = 0,
    soldunits = 0,
    avgDeal = 0,
    // prev-month conversion + inventory/tasks
    totalLeadsPM = 0,
    closedLeadsPM = 0,
    conversionPM = 0, // percentage
    inventoryOnLot = 0,
    agingStock60d = 0,
    inventoryValue = 0,
    // dates (support both shapes)
    periodStartUTC,
    startOfMonthUTC,
    nowUTC,
  } = data || {}

  const rangeStartISO = periodStartUTC || startOfMonthUTC
  const currency = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD', // change to your store currency
    maximumFractionDigits: 0,
  })

  return (
    <Wrapper>
      <SectionTitle>Top-Section</SectionTitle>

      {loading && <LoadingText>Loading…</LoadingText>}
      {error && <ErrorText>Error: {error}</ErrorText>}

      {!loading && !error && data && (
        <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
          {/* Existing tiles */}
          <MetricBox>
            <MetricTitle>MTD Revenue</MetricTitle>
            <MetricValue>{currency.format(revenueMTD)}</MetricValue>
            {rangeStartISO && nowUTC && (
              <DateRange>
                From {new Date(rangeStartISO).toLocaleDateString()} to{' '}
                {new Date(nowUTC).toLocaleDateString()}
              </DateRange>
            )}
          </MetricBox>

          <MetricBox>
            <MetricTitle>MTD Units Sold</MetricTitle>
            <MetricValue>{soldunits}</MetricValue>
            {rangeStartISO && nowUTC && (
              <DateRange>
                From {new Date(rangeStartISO).toLocaleDateString()} to{' '}
                {new Date(nowUTC).toLocaleDateString()}
              </DateRange>
            )}
          </MetricBox>

          <MetricBox>
            <MetricTitle>MTD Avg Deal Size</MetricTitle>
            <MetricValue>{currency.format(avgDeal)}</MetricValue>
            {rangeStartISO && nowUTC && (
              <DateRange>
                From {new Date(rangeStartISO).toLocaleDateString()} to{' '}
                {new Date(nowUTC).toLocaleDateString()}
              </DateRange>
            )}
          </MetricBox>

          {/* NEW: Inventory On Lot */}
          <MetricBox>
            <MetricTitle>Inventory On Lot</MetricTitle>
            <MetricValue>{inventoryOnLot}</MetricValue>
          </MetricBox>

          {/* NEW: Aging Stock > 60d */}
          <MetricBox>
            <MetricTitle>Aging Stock &gt; 60d</MetricTitle>
            <MetricValue>{agingStock60d}</MetricValue>
          </MetricBox>

          {/* NEW: Inventory Value */}
          <MetricBox>
            <MetricTitle>Inventory Value</MetricTitle>
            <MetricValue>{currency.format(inventoryValue)}</MetricValue>
          </MetricBox>

          {/* NEW: Overdue Tasks */}
          <MetricBox>
            <MetricTitle>Overdue Tasks</MetricTitle>
            <MetricValue>{data?.overdueTasks ?? 0}</MetricValue>
          </MetricBox>

          {/* Prev Month Conversion (matches API fields) */}
          <MetricBox>
            <MetricTitle>Lead → Sale Conversion (Prev Month)</MetricTitle>
            <MetricValue>{Number(conversionPM).toFixed(2)}%</MetricValue>
            {rangeStartISO && nowUTC && (
              <DateRange>
                From {new Date(rangeStartISO).toLocaleDateString()} to{' '}
                {new Date(nowUTC).toLocaleDateString()}
              </DateRange>
            )}
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
              {closedLeadsPM} / {totalLeadsPM} leads converted
            </p>
          </MetricBox>
        </div>
      )}
    </Wrapper>
  )
}

export default TopSection
