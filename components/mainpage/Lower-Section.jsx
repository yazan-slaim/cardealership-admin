'use client';

import React from 'react';
import styled from '@emotion/styled';
import TasksTable from './lowersectioncards/TaskTable';

/* ============= Layout ============= */
const Section = styled.section`
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
`;

const Card = styled.div`
  grid-column: span 12;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  padding: 16px;
  min-height: 220px;

  @media (min-width: 1024px) {
    &.wide { grid-column: span 8; }
    &.narrow { grid-column: span 4; }
    &.half { grid-column: span 6; }
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

const Actions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  font-size: 0.85rem;

  &:hover { background: #f9fafb; }
`;

/* ============= Table ============= */
const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;

  th, td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
  }

  th {
    color: #6b7280;
    font-weight: 600;
    background: #fafafa;
  }

  tr:hover td { background: #fafafa; }
  tr.overdue td { background: #fff1f2; } /* red-tinted row */
`;

const Tag = styled.span`
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #fff;
`;

const Status = styled.span`
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  color: #111827;
  background: ${({ tone }) =>
    tone === 'success' ? '#dcfce7' :
    tone === 'warn'    ? '#fef9c3' :
    tone === 'danger'  ? '#fee2e2' :
                         '#e0f2fe'};
`;


/* ============= Placeholder Data (replace later) ============= */
const demoTasks = [
  { id: 1, title: 'Call lead: Ahmad', agent: 'Omar', due: '2025-09-12', priority: 'High', overdue: true },
  { id: 2, title: 'Prep BMW X5 docs', agent: 'Lina', due: '2025-09-18', priority: 'Medium' },
  { id: 3, title: 'Schedule test drive', agent: 'Samir', due: '2025-09-20', priority: 'Low' },
];

const demoLeads = [
  { id: 101, name: 'Sara Ali', contact: 'sara@example.com', source: 'Website', agent: 'Lina', status: 'new' },
  { id: 102, name: 'Mohammad K', contact: '+9627XXXXXXXX', source: 'Instagram', agent: 'Omar', status: 'contacted' },
  { id: 103, name: 'Jamal R', contact: 'jamal@example.com', source: 'Referral', agent: 'Samir', status: 'hot' },
];

const demoLeaderboard = [
  { id: 'a1', agent: 'Omar', revenue: 42000, units: 5, avg: 8400, trend: 'up' },
  { id: 'a2', agent: 'Lina', revenue: 36000, units: 4, avg: 9000, trend: 'down' },
  { id: 'a3', agent: 'Samir', revenue: 21000, units: 3, avg: 7000, trend: 'flat' },
];

const demoInventoryAlerts = [
  { id: 'c1', car: 'Toyota Corolla 2020', days: 74, qty: 1, price: 13500 },
  { id: 'c2', car: 'BMW 3 Series 2018', days: 63, qty: 2, price: 22500 },
  { id: 'c3', car: 'Hyundai Elantra 2021', days: 12, qty: 1, price: 14500 },
];

const demoAppointments = [
  { id: 't1', client: 'Yousef', when: 'Today 16:00', status: 'confirmed', agent: 'Omar' },
  { id: 't2', client: 'Rana', when: 'Today 18:30', status: 'pending', agent: 'Lina' },
  { id: 't3', client: 'Hani', when: 'This Week Fri 11:00', status: 'missed', agent: 'Samir' },
];

/* ============= Component ============= */
export default function LowerSection() {
  return (
    <Section>
      <Card>
<TasksTable/>
      </Card>

      {/* 2) Enquiries / Leads Feed */}
      <Card className="narrow">
        <TitleRow>
          <CardTitle>🧲 Enquiries / Leads</CardTitle>
          <Actions>
            <Button>All</Button>
            <Button>New</Button>
            <Button>Hot</Button>
          </Actions>
        </TitleRow>

        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Source</th>
                <th>Agent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {demoLeads.map(l => (
                <tr key={l.id}>
                  <td>{l.name}</td>
                  <td>{l.contact}</td>
                  <td>{l.source}</td>
                  <td>{l.agent}</td>
                  <td>
                    {l.status === 'new' && <Status tone="info">New</Status>}
                    {l.status === 'contacted' && <Status tone="warn">Contacted</Status>}
                    {l.status === 'hot' && <Status tone="danger">Hot</Status>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      {/* 3) Agent Leaderboard */}
      <Card className="half">
        <TitleRow>
          <CardTitle>🏆 Agent Leaderboard (MTD)</CardTitle>
          <Actions>
            <Button>This month</Button>
            <Button>Last month</Button>
          </Actions>
        </TitleRow>

        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Revenue</th>
                <th>Units</th>
                <th>Avg Deal</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {demoLeaderboard.map((a) => (
                <tr key={a.id}>
                  <td>{a.agent}</td>
                  <td>${a.revenue.toLocaleString()}</td>
                  <td>{a.units}</td>
                  <td>${a.avg.toLocaleString()}</td>
                  <td>
                    {a.trend === 'up' && '📈'}
                    {a.trend === 'down' && '📉'}
                    {a.trend === 'flat' && '⟷'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      {/* 4) Low-Stock & Aging Alerts */}
      <Card className="half">
        <TitleRow>
          <CardTitle>🚨 Low-Stock & Aging Alerts</CardTitle>
          <Actions>
            <Button>In stock</Button>
            <Button>Aging &gt; 60d</Button>
          </Actions>
        </TitleRow>

        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Car</th>
                <th>Days on Lot</th>
                <th>Qty</th>
                <th>List Price</th>
              </tr>
            </thead>
            <tbody>
              {demoInventoryAlerts.map((c) => (
                <tr key={c.id} className={c.days > 60 ? 'overdue' : ''}>
                  <td>{c.car}</td>
                  <td>{c.days}</td>
                  <td>{c.qty}</td>
                  <td>${c.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      {/* 5) Client Follow-ups / Appointments */}
      <Card className="wide">
        <TitleRow>
          <CardTitle>📅 Client Follow-ups / Appointments</CardTitle>
          <Actions>
            <Button>Today</Button>
            <Button>This week</Button>
          </Actions>
        </TitleRow>

        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Client</th>
                <th>When</th>
                <th>Status</th>
                <th>Agent</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {demoAppointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.client}</td>
                  <td>{a.when}</td>
                  <td>
                    {a.status === 'confirmed' && <Status tone="success">Confirmed</Status>}
                    {a.status === 'pending' && <Status tone="warn">Pending</Status>}
                    {a.status === 'missed' && <Status tone="danger">Missed</Status>}
                  </td>
                  <td>{a.agent}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Button>Reschedule</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

    </Section>
  );
}
