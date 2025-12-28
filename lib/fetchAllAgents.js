'use client';

import { useParams } from 'next/navigation';

import { useState, useEffect } from "react";
import {
  TextField, Select,
  MenuItem
} from "@mui/material";
import styled from "@emotion/styled";
import { ReactSortable } from "react-sortablejs";

const Container = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
  background: #1e1e1e;
  color: white;
`;

const LeftPanel = styled.div`
  width: 300px;
  padding: 20px;
  border-right: 1px solid #333;
  background: #2b2b2b;
`;
const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#888',
    },
    '&:hover fieldset': {
      borderColor: '#aaa',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ff6600',
    },
  },
});

const RightPanel = styled.div`
  flex: 1;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

const InfoBlock = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.div`
  font-weight: bold;
  margin-top: 10px;
`;

const Value = styled.div`
  margin-left: 5px;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 2px solid #444;
`;

const Tab = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  color: #aaa;
  border-bottom: 3px solid transparent;

  &:hover {
    color: white;
  }

  &.active {
    border-color: #ff6600;
    color: white;
  }
`;

const TabContent = styled.div`
  margin-top: 20px;
`;

const NotesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoteForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const NoteInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 10px;
  font-size: 14px;
  resize: vertical;
  color: black;
`;

const SubmitButton = styled.button`
  width: max-content;
  background: #ff6600;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
`;

const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const NoteItem = styled.div`
  background: #333;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  *{
    color: white;
  }
`;

const NoteMeta = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 5px;
`;

const Tag = styled.span`
  background: #555;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 5px;
  font-size: 12px;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  font-family: Arial, sans-serif;
`;

const PageText = styled.div`
  font-size: 32px;
  display: flex;
  align-items: center;
`;

const PageNumber = styled.span`
  color: white;
  cursor: pointer;
  margin: 0 5px;
  font-size: 16px;

  &.active {
    color: orange;
    border-radius: 50%;
    padding: 2px 8px;
  }
`;

const Next = styled.span`
  color: white;
  margin-left: 10px;
  cursor: pointer;
`;
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  color:"black",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const StyledLabel = styled.label`
  color: white;
  display: block;
  margin-bottom: 5px;
  min-width: 100px;
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 5px;
`;

const StyledFile = styled.img`
  width: 300px;
border-bottom: 1px solid gray;

  cursor: pointer;
  border-radius: 8px;
  object-fit: cover;
`;

const FilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const FilesSecondContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-around;
`;

const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  color: white;
  margin: 10px;
  background: ${(props) =>
    props.background ? `url(${props.background})` : "rgba(0, 0, 0, 0.2)"};
  background-size: cover;
  background-position: center;
`;

const StyledBlock = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 15px;
  margin-top: 15px;
  border-radius: 8px;
`;
const SmallButton = styled.button`
  max-height: 25px;
  padding: 5px 10px;
  background-color: ${(props) => (props.red ? "darkred" : "black")};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  min-width: fit-content;
  white-space: nowrap;
  transition: all 0.3s;

  &:hover {
    background: white;
    color: black;
  }
`;
const statusOptions = [
  "New",
  "Contacted",
  "In Progress",
  "Waiting for Documents",
  "Submitted",
  "Approved",
  "Rejected",
  "On Hold",
  "Closed",
];
const currentUser = { _id: '123', name: 'Admin User' };

export default function Page() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [clientStatus, setClientStatus] = useState('New');
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    note: '',
    assignedTo: '',
  });
  const [agents, setAgents] = useState([
    { _id: '1', name: 'John Doe' },
    { _id: '2', name: 'Jane Smith' },
  ]);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('History');
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState([
    {
      content: 'Client called to ask about payment plan options.',
      tags: ['call', 'payment'],
      createdAt: new Date('2024-07-08T10:00:00'),
    },
    {
      content: 'Left a voicemail for the client regarding missed documents.',
      tags: ['voicemail'],
      createdAt: new Date('2024-07-06T14:30:00'),
    },
    {
      content: 'Client confirmed submission of all required documents.',
      tags: ['documents'],
      createdAt: new Date('2024-07-05T09:45:00'),
    },
    {
      content: 'Reminder set for final follow-up on 07/10.',
      tags: ['reminder'],
      createdAt: new Date('2024-07-04T12:15:00'),
    },
    {
      content: 'Client asked for clarification on loan terms.',
      tags: ['loan'],
      createdAt: new Date('2024-07-03T15:20:00'),
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 3;
  const [open, setOpen] = useState(false);
  const [fileData, setFileData] = useState({
    fileName: '',
    fileType: '',
  });

  useEffect(() => {
    async function fetchClient() {
      try {
        const response = await fetch(`/api/client/get-client?id=${id}`);
        const data = await response.json();
        if (data.success) {
          setClient(data.client);
          setClientStatus(data.client.status);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch client data');
        console.error(err);
      }
    }

    if (id) fetchClient();

  }, [id]);
    console.log(client);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const newNote = {
      content: noteInput.trim(),
      tags: [],
      createdAt: new Date(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setNoteInput('');
    setCurrentPage(1);
  };

  const fileinformation = () => {
    handleOpen();
  };

  const totalPages = Math.ceil(notes.length / notesPerPage);
const paginatedNotes = ([] || []).slice(
  (currentPage - 1) * notesPerPage,
  currentPage * notesPerPage
);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function uploadFiles(ev) {
    fileinformation();
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }

      const response = await fetch('/api/uploadMultipleFiles', {
        method: 'POST',
        body: data,
      });

      const responseData = await response.json();
      setFiles((oldFiles) => [...oldFiles, ...responseData.links]);
      setIsUploading(false);
    }
  }

  function updateFileOrder(newFiles) {
    setFiles(newFiles);
  }

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!client) return <div>Loading...</div>;
  return (
    <Container>
      <LeftPanel>
       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
  <Title style={{ margin: 0 }}>test tester</Title>
  <Select
    value={clientStatus}
    onChange={(e) => setClientStatus(e.target.value)}
    variant="outlined"
    size="small"
    sx={{
      backgroundColor: "#444",
      color: "white",
      borderRadius: "4px",
      fontSize: "14px",
      '.MuiSvgIcon-root': { color: "white" },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: "#666",
      },
    }}
  >
    {statusOptions.map((status) => (
      <MenuItem key={status} value={status}>
        {status}
      </MenuItem>
    ))}
  </Select>
</div>

        <InfoBlock>
          <Label>Customer ID</Label>
          <Value>MAT</Value>
          <Label>Assigned Company</Label>
          <Value>MTC</Value>
          <Label>Email</Label>
          <Value>uniqueemail1232@test.net</Value>
          <Label>Phone</Label>
          <Value>614-546-8845</Value>
        </InfoBlock>
        <InfoBlock>
          <Label>Income</Label>
          <Value>$10,000.00</Value>
          <Label>Expenses</Label>
          <Value>$9,400.00</Value>
        </InfoBlock>
        <InfoBlock>
          <button>Send External Form Request</button>
          <button>Execute Webhook</button>
        </InfoBlock>
      </LeftPanel>

      <RightPanel>
        <Tabs>
{['History', 'Docs', 'Notes', 'Calls', 'Tasks'].map((tab) => (
            <Tab
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Tab>
          ))}
        </Tabs>

        <TabContent>
          {activeTab === 'History' && <div>Mass Edit Performed - Jul 08 '24</div>}
          {activeTab === 'Tasks' && (
  <div>
    <h3 style={{ color: 'white' }}>Create Task</h3>
    <form
      onSubmit={(e) => {
        e.preventDefault();
const newTaskObj = {
  ...newTask,
  completed: false,
  createdBy: currentUser.name, // or currentUser._id if you handle IDs
};
setTasks(prev => [newTaskObj, ...prev]);        setNewTask({ title: '', dueDate: '', note: '', assignedTo: '' });
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}
    >
      <StyledTextField
        label="Title"
        variant="outlined"
        size="small"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <StyledTextField
        type="date"
        label="Due Date"
        variant="outlined"
        size="small"
        InputLabelProps={{ shrink: true }}
        value={newTask.dueDate}
        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
      />
      <StyledTextField
        label="Note"
        variant="outlined"
        size="small"
        multiline
        rows={2}
        value={newTask.note}
        onChange={(e) => setNewTask({ ...newTask, note: e.target.value })}
      />
    <Select
  value={newTask.assignedTo}
  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
  displayEmpty
  variant="outlined"
  size="small"
  sx={{
    color: 'white',
    '.MuiSelect-icon': { color: 'white' },
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: '#888',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#aaa',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ff6600',
    },
  }}
>
  <MenuItem value="" disabled>
    Assign to Agent
  </MenuItem>
  {agents.map((agent) => (
    <MenuItem key={agent._id} value={agent.name}>
      {agent.name}
    </MenuItem>
  ))}
</Select>

      <SubmitButton type="submit">Create Task</SubmitButton>
    </form>

    <h3 style={{ color: 'white' }}>Tasks</h3>
    {tasks.map((task, index) => (
     <NoteItem key={index} style={{ display: 'flex', flexDirection: 'column' }}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',color:'white' }}>
    <strong>{task.title}</strong>
    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => {
          const updatedTasks = [...tasks];
          updatedTasks[index].completed = !updatedTasks[index].completed;
          setTasks(updatedTasks);
        }}
      />
      <span>{task.completed ? 'Completed' : 'Pending'}</span>
    </label>
  </div>

  <NoteMeta>
    Assigned to: {task.assignedTo} <br />
    Created by: {task.createdBy} <br />
    Due: {task.dueDate} <br />
    {task.note}
  </NoteMeta>
</NoteItem>

    ))}
  </div>
)}

          {activeTab === 'Docs' &&                         <FilesContainer>
                                    <h1 style={{color:'black'}}>Files Container</h1>
                                    <FilesSecondContainer>
                                      <ReactSortable
                                        list={files}
                                        className="flex flex-wrap gap-1"
                                        setList={updateFileOrder}
                                      >
                                       {!!files?.length &&
  files.map((link, imgindex) => {
    const downloadLink = `${link}?response-content-disposition=attachment`;

    return (
      <FilePreview key={link}>
        <h1>file{imgindex}</h1>
        <StyledFile src={link} alt="" />
        <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <SmallButton>Open</SmallButton>
          </a>
          <a href={downloadLink}>
            <SmallButton>Download</SmallButton>
          </a>
          <SmallButton onClick={() => handleRemoveFile(imgindex)} red>
            Remove
          </SmallButton>
        </div>
      </FilePreview>
    );
  })}

                                      </ReactSortable>
                                      {isUploading && <FilePreview>...loading</FilePreview>}
                                      <UploadLabel style={{ width: "100px", height: "100px" }}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="feather feather-upload"
                                        >
                                          <path d="M16 13v4H8v-4H4l8-8 8 8h-4z"></path>
                                          <line x1="12" y1="2" x2="12" y2="13"></line>
                                        </svg>
                                        <div>Add File</div>
                                        <input
                                          type="file"
                                          onChange={uploadFiles}
                                          className="hidden"
                                        />
                                      </UploadLabel>
                                    </FilesSecondContainer>
                                  </FilesContainer>}
          {activeTab === 'Calls' && <div>No calls logged.</div>}

          {activeTab === 'Notes' && (
            <NotesWrapper>
              <NoteForm onSubmit={handleSubmit}>
                <NoteInput
                  placeholder="Write a note..."
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                />
                <SubmitButton type="submit">Add Note</SubmitButton>
              </NoteForm>

              <NotesList>
                {paginatedNotes.map((note, index) => (
                  <NoteItem key={index}>
                    {note.content}
                    <NoteMeta>
                      {note.tags.map((tag, i) => (
                        <Tag key={i}>{tag}</Tag>
                      ))}
                      <div>{note.createdAt.toLocaleString()}</div>
                    </NoteMeta>
                  </NoteItem>
                ))}
              </NotesList>

              {totalPages > 1 && (
                <Pagination>
                  <PageText>
                 
                    {[...Array(totalPages)].map((_, i) => (
                      <PageNumber
                        key={i}
                        className={currentPage === i + 1 ? 'active' : ''}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PageNumber>
                    ))}
                  
                    <Next
                      onClick={() =>
                        setCurrentPage(p => (p < totalPages ? p + 1 : p))
                      }
                    >
                      &nbsp;Next
                    </Next>
                  </PageText>
                </Pagination>
              )}
            </NotesWrapper>
          )}
        </TabContent>
      </RightPanel>
    </Container>
  );
}
