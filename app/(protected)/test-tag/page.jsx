'use client';

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';

export default function NotesWithAssign() {
  const [agents, setAgents] = useState([]);
  const [assignedAgents, setAssignedAgents] = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [submittedNotes, setSubmittedNotes] = useState([]);


  // Fetch agents from API on mount
  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch('/api/employee/get-employees');
        const data = await res.json();
        if (data.success) {
          setAgents(data.agents);
        } else {
          console.error('Failed to load agents:', data.message);
        }
      } catch (err) {
        console.error('Error fetching agents:', err);
      }
    }
    fetchAgents();
  }, []);

  // Helper to find agent by exact fullName (case-insensitive)
  const findAgentByName = (name) => {
    return agents.find(
      (agent) => agent.fullName.toLowerCase() === name.trim().toLowerCase()
    );
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const matchedAgent = findAgentByName(inputValue);
      if (
        matchedAgent &&
        !assignedAgents.some((a) => a._id === matchedAgent._id)
      ) {
        setAssignedAgents([...assignedAgents, matchedAgent]);
        setInputValue('');
      }
    }
  };

  const handleChange = (event, newValue) => {
    setAssignedAgents(newValue);
  };

  // New function to handle adding note on button click
  const handleAddNote = () => {
    if (!noteContent.trim()) return;

    const newNote = {
      content: noteContent.trim(),
      tags: assignedAgents,
      createdAt: new Date(),
    };

    setSubmittedNotes((prev) => [newNote, ...prev]);
    setNoteContent('');
    setAssignedAgents([]);
    setInputValue('');
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '30px auto',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'white',
        color: 'black',
      }}
    >
      <h2>Note with Assign To (multi-select searchable)</h2>

      {/* Removed <form> wrapper */}
      <Autocomplete
        multiple
        options={agents.filter(
          (agent) => !assignedAgents.some((assigned) => assigned._id === agent._id)
        )}
        getOptionLabel={(option) => option.fullName}
        value={assignedAgents}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        filterSelectedOptions
        freeSolo={false}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option.fullName}
              {...getTagProps({ index })}
              key={option._id}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Assign To"
            placeholder="Search and select agents"
            margin="normal"
            InputProps={{
              ...params.InputProps,
              style: { color: 'black' },
              onKeyDown: handleKeyDown,
            }}
            InputLabelProps={{ style: { color: 'black' } }}
          />
        )}
      />

      <TextField
        label="Note"
        multiline
        rows={4}
        fullWidth
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        margin="normal"
        InputProps={{ style: { color: 'black' } }}
        InputLabelProps={{ style: { color: 'black' } }}
      />

      <button
        type="button"
        onClick={handleAddNote}
        style={{
          padding: '8px 16px',
          backgroundColor: '#ff6600',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Add Note
      </button>

      <h3 style={{ marginTop: 40 }}>Submitted Notes</h3>
      {submittedNotes.length === 0 && <div>No notes yet.</div>}

      {submittedNotes.map((note, i) => (
        <div
          key={i}
          style={{
            background: '#f9f9f9',
            padding: 10,
            borderRadius: 6,
            marginTop: 15,
            color: 'black',
          }}
        >
          <div style={{ whiteSpace: 'pre-wrap' }}>{note.content}</div>
          <div style={{ marginTop: 6, fontSize: 12, color: '#555' }}>
            Assigned To:{' '}
            {note.tags.length > 0
              ? note.tags.map((agent) => agent.fullName).join(', ')
              : 'None'}
          </div>
          <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
            Created at: {note.createdAt.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
