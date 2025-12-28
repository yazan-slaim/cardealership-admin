'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

/* ========= Styled Components ========= */
const Card = styled.div`
  background: #fff;
  color: #111827; /* force dark text */
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  padding: 16px;
  margin-top: 16px;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 12px;
`;

const TableWrap = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  color: #111827;

  th, td {
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
    background: #fff;
  }

  th {
    background: #f9fafb;
    color: #374151;
    font-weight: 600;
  }

  tr.overdue td {
    background: #fee2e2; /* red tint for overdue */
  }
`;

const Button = styled.button`
  padding: 4px 8px;
  font-size: 0.8rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  margin-left: 6px;
  cursor: pointer;
  background: #fff;
  color: #111827;

  &:hover { background: #f9fafb; }
`;

const Status = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => props.type === 'done' ? '#dcfce7' : '#fef9c3'};
  color: #111827;
`;

/* ========= Component ========= */
export default function TasksTable() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await fetch('/api/lowersection/tasks');
      const json = await res.json();
      if (json.success) {
        setTasks(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markComplete(id) {
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: true }),
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { fetchTasks(); }, []);

  return (
    <Card>
      <Title>✅ Tasks & To-Dos</Title>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => {
                const overdue = !t.completed && new Date(t.dueDate) < new Date();
                return (
                  <tr key={t._id} className={overdue ? 'overdue' : ''}>
                    <td>{t.title}</td>
                    <td>{t.assignedTo?.fullName || 'Unassigned'}</td>
                    <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                    <td>
                      {t.completed
                        ? <Status type="done">Done</Status>
                        : <Status type="open">Open</Status>}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {!t.completed && (
                        <Button onClick={() => markComplete(t._id)}>
                          Mark Done
                        </Button>
                      )}
                      <Button>Reassign</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </Card>
  );
}
