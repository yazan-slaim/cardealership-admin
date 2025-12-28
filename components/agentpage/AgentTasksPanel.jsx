'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useTheme, alpha } from '@mui/material/styles';
import { useParams } from 'next/navigation';

const Panel = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
}));

const Filters = styled('form')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  alignItems: 'flex-end',
  flexWrap: 'wrap',
}));

const Field = styled('label')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: 13,
}));

const Input = styled('input')(({ theme }) => ({
  padding: '8px 10px',
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const Select = styled('select')(({ theme }) => ({
  padding: '8px 10px',
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const Button = styled('button')(({ theme }) => ({
  padding: '8px 12px',
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  cursor: 'pointer',
  '&:disabled': { cursor: 'default', background: alpha(theme.palette.primary.main, 0.12) },
}));

const List = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  maxHeight: 420,
  overflowY: 'auto',
  paddingRight: 4,
}));

const Card = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'start',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  borderRadius: 10,
}));

const Title = styled('div')(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 1.2,
}));

const Meta = styled('div')(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.text.secondary,
}));

const Note = styled('div')(({ theme }) => ({
  fontSize: 13,
  color: theme.palette.text.primary,
}));

const RowActions = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: 8,
}));

const InlineInput = styled(Input)({ padding: '6px 8px' });

const InlineTextarea = styled('textarea')(({ theme }) => ({
  padding: '6px 8px',
  minHeight: 60,
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  resize: 'vertical',
}));

/**
 * Expects backend endpoints:
 *  - GET /api/tasks/my?start=YYYY-MM-DD&end=YYYY-MM-DD&completed=all|true|false&q=...
 *      -> { success: true, tasks: Task[] }  // already scoped to current agent on server
 *  - PUT /api/tasks/tick-task    { taskId, completed }
 *  - PUT /api/tasks/update-task  { taskId, title, note, dueDate }
 */
export default function AgentTasksPanel() {
  const theme = useTheme();
  const { id } = useParams();

  // filters (status/date/search)
  const todayISO = new Date().toISOString().slice(0, 10);
  const startOfMonthISO = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const [status, setStatus] = useState('all'); // 'all' | 'completed' | 'pending'
  const [start, setStart] = useState(startOfMonthISO);
  const [end, setEnd] = useState(todayISO);
  const [q, setQ] = useState('');

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');

  // inline edit state
  const [editing, setEditing] = useState({}); // { [taskId]: { title, dueDate, note } }

  // fetch tasks (server already scopes to current agent)
  useEffect(() => {
    const params = new URLSearchParams({
      start,
      end,
      completed: status === 'all' ? 'all' : status === 'completed' ? 'true' : 'false',
      q,
      id,

    });

    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/employee/fetch-tasks?${params.toString()}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to fetch tasks');
        setTasks(json.tasks || []);
      } catch (e) {
        console.error('[AgentTasksPanel] fetch', e);
        setError(e?.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    })();
  }, [start, end, status, q]);

  // client-side extra safety filter
  const filtered = useMemo(() => {
    const startD = start ? new Date(start) : null;
    const endD = end ? new Date(end) : null;
    return (tasks || []).filter((t) => {
      if (status !== 'all') {
        const wantCompleted = status === 'completed';
        if (!!t.completed !== wantCompleted) return false;
      }
      if (startD || endD) {
        const d = t?.dueDate ? new Date(t.dueDate) : new Date(t.createdAt || 0);
        if (startD && d < new Date(startD.setHours(0, 0, 0, 0))) return false;
        if (endD && d > new Date(new Date(end).setHours(23, 59, 59, 999))) return false;
      }
      if (q) {
        const hay = `${t.title || ''} ${t.note || ''}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [tasks, status, start, end, q]);

  async function toggleComplete(task) {
    try {
      setSavingId(task._id);
      const res = await fetch('/api/tasks/tick-task', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task._id, completed: !task.completed }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed');
      setTasks((prev) => prev.map((t) => (t._id === task._id ? data.task : t)));
    } catch (e) {
      console.error('[toggleComplete]', e);
      setError(e?.message || 'Failed to update task');
    } finally {
      setSavingId(null);
    }
  }

  function startEdit(task) {
    setEditing((prev) => ({
      ...prev,
      [task._id]: {
        title: task.title || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
        note: task.note || '',
      },
    }));
  }

  function cancelEdit(taskId) {
    setEditing((prev) => {
      const copy = { ...prev };
      delete copy[taskId];
      return copy;
    });
  }

  async function saveEdit(taskId) {
    const payload = editing[taskId];
    if (!payload) return;
    try {
      setSavingId(taskId);
      const res = await fetch('/api/tasks/update-task', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, ...payload }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to save');
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data.task : t)));
      cancelEdit(taskId);
    } catch (e) {
      console.error('[saveEdit]', e);
      setError(e?.message || 'Failed to save task');
    } finally {
      setSavingId(null);
    }
  }

  function onEditField(taskId, field, value) {
    setEditing((prev) => ({ ...prev, [taskId]: { ...prev[taskId], [field]: value } }));
  }

  function onSubmitFilters(e) {
    e.preventDefault();
    if (start && end && new Date(start) > new Date(end)) {
      setError('Start date must be before end date');
      return;
    }
  }

  return (
    <Panel>
      <Filters onSubmit={onSubmitFilters}>
        <Field>
          <span>Status</span>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
        </Field>

        <Field>
          <span>Start</span>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>

        <Field>
          <span>End</span>
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </Field>

        <Field style={{ flex: 1, minWidth: 200 }}>
          <span>Search</span>
          <Input placeholder="Title or note…" value={q} onChange={(e) => setQ(e.target.value)} />
        </Field>

        <Button type="submit" disabled={loading}>
          {loading ? 'Filtering…' : 'Apply'}
        </Button>
      </Filters>

      {error && <div style={{ color: theme.palette.error.main }}>{error}</div>}

      {loading ? (
        <div style={{ color: theme.palette.text.secondary }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: theme.palette.text.secondary }}>No tasks found.</div>
      ) : (
        <List>
          {filtered.map((task) => {
            const edit = editing[task._id];
            const busy = savingId === task._id;
            return (
              <Card key={task._id}>
                <div style={{ paddingTop: 4 }}>
                  <input
                    type="checkbox"
                    checked={!!task.completed}
                    onChange={() => toggleComplete(task)}
                    disabled={busy}
                    title="Toggle completed"
                  />
                </div>

                <div style={{ display: 'grid', gap: 6 }}>
                  {edit ? (
                    <>
                      <InlineInput
                        value={edit.title}
                        onChange={(e) => onEditField(task._id, 'title', e.target.value)}
                        placeholder="Task title"
                      />
                      <InlineInput
                        type="date"
                        value={edit.dueDate || ''}
                        onChange={(e) => onEditField(task._id, 'dueDate', e.target.value)}
                      />
                      <InlineTextarea
                        value={edit.note}
                        onChange={(e) => onEditField(task._id, 'note', e.target.value)}
                        placeholder="Notes…"
                      />
                    </>
                  ) : (
                    <>
                      <Title>{task.title || 'Untitled task'}</Title>
                      <Meta>
                        {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
                        {task.updatedAt ? ` · Updated: ${new Date(task.updatedAt).toLocaleString()}` : ''}
                      </Meta>
                      {task.note ? <Note>{task.note}</Note> : null}
                    </>
                  )}
                </div>

                <RowActions>
                  {edit ? (
                    <>
                      <Button onClick={() => saveEdit(task._id)} disabled={busy}>
                        {busy ? 'Saving…' : 'Save'}
                      </Button>
                      <Button onClick={() => cancelEdit(task._id)} disabled={busy}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => startEdit(task)} disabled={busy}>
                      Edit
                    </Button>
                  )}
                </RowActions>
              </Card>
            );
          })}
        </List>
      )}
    </Panel>
  );
}
