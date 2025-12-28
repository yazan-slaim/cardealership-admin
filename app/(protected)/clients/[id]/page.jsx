"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Modal,
  Box,
} from "@mui/material";
import styled from "@emotion/styled";
import { ReactSortable } from "react-sortablejs";
import SaleDialog from "@/components/SaleDialog";

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100vh",
  fontFamily: "Arial, sans-serif",
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const LeftPanel = styled("div")(({ theme }) => ({
  width: 300,
  padding: 20,
  borderRight: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": { color: theme.palette.text.primary },
  "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: theme.palette.divider },
    "&:hover fieldset": { borderColor: theme.palette.text.secondary },
    "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
  },
}));

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

const Tabs = styled("div")(({ theme }) => ({
  display: "flex",
  borderBottom: `2px solid ${theme.palette.divider}`,
}));


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
    border-color: #ffffff;
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

export const SubmitButton = styled("button")(({ theme }) => ({
  width: "max-content",
  padding: "8px 16px",
  borderRadius: 8,
  background: "transparent",
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  cursor: "pointer",
  transition: "background .2s, border-color .2s",
  "&:hover": {
    background: theme.palette.action.hover,
    borderColor: theme.palette.text.secondary,
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
}));

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
  * {
    color: white;
  }
`;

const NoteMeta = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 5px;
`;

const Tag = styled("span")(({ theme }) => ({
  background: theme.palette.action.selected,
  color: theme.palette.text.primary,
  padding: "2px 8px",
  borderRadius: 999,
  fontSize: 12,
}));


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
    color: #ffffff;
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
  color: "black",
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
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
`;


const Card = styled("div")(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: 14,
}));


const CardTitle = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
`;

const Stat = styled.div`
  font-size: 28px;
  font-weight: 800;
`;

const CarCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CarThumb = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  background: #111;
`;

const Muted = styled("div")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 12,
}));

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
  "interested",
];
const currentUser = { _id: "123", name: "Admin User" };

export default function Page() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [interestedCars, setInterestedCars] = useState([]);
  const [clientStatus, setClientStatus] = useState("New");
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    note: "",
    assignedTo: "",
  });
  const [agents, setAgents] = useState([]);
  const [assignedAgents, setAssignedAgents] = useState([]);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [noteInput, setNoteInput] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [saleOpen, setSaleOpen] = useState(false);
  const [carForSale, setCarForSale] = useState(null);
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 3;

  const [open, setOpen] = useState(false);
  const [fileForm, setFileForm] = useState({
    name: "",
    fileType: "generic",
    file: null,
  });
  const fileTypes = ["generic", "id", "agreement", "income", "other"];

  useEffect(() => {
    async function fetchClient() {
      try {
        const response = await fetch(`/api/client/get-client?id=${id}`);
        const data = await response.json();
        if (data.success) {
          setClient(data.client);
          setClientStatus(data.client.status);
          setInterestedCars(data.client.interestedCars || []);
          setTasks(data.client.tasks || []);
          setNotes(data.client.notes || []);
          setFiles(data.client.files || []);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch client data");
        console.error(err);
      }
    }
    async function fetchAgents() {
      const res = await fetch("/api/employee/get-employees");
      const data = await res.json();
      console.log(data);
      if (data.success) {
        setAgents(data.agents);
      }
    }
    fetchAgents();
    if (id) fetchClient();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const newNote = {
      content: noteInput.trim(),
      tags: [],
      createdAt: new Date(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setNoteInput("");
    setCurrentPage(1);
  };

  const buyerPrefill = {};
  const fileinformation = () => {
    handleOpen();
  };

  const totalPages = Math.ceil(notes.length / notesPerPage);
  const paginatedNotes = notes.slice(
    (currentPage - 1) * notesPerPage,
    currentPage * notesPerPage
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function updateFileOrder(newFiles) {
    setFiles(newFiles);
  }
  const handleChange = (event, newValue) => {
    setAssignedAgents(newValue);
  };
  const handleCreateTask = async () => {
    console.log("this is new task object", newTask);
    const res = await fetch("/api/tasks/post-task", {
      method: "POST",
      body: JSON.stringify({
        ...newTask,
        relatedClient: id,
        createdBy: "686c14f0e183f7e633c8f5e4",
        relatedCar: "66f9bfe39d94d5d534920be5",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.success) {
      setTasks((prev) => [data.task, ...prev]); // Update UI immediately
    }
  };
  const findAgentByName = (name) => {
    return agents.find(
      (agent) => agent.fullName.toLowerCase() === name.trim().toLowerCase()
    );
  };
  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const matchedAgent = findAgentByName(inputValue);
      if (
        matchedAgent &&
        !assignedAgents.some((a) => a._id === matchedAgent._id)
      ) {
        setAssignedAgents([...assignedAgents, matchedAgent]);
        setInputValue("");
      }
    }
  };
  async function postNote() {
    if (!noteInput.trim()) return;

    // Prepare your payload — assign tags as IDs (adjust according to your schema)
    const payload = {
      content: noteInput.trim(),
      clientId: id,
      authorId: "686c14f0e183f7e633c8f5e4",
      taggedAgents: assignedAgents.map((agent) => agent._id),
    };

    try {
      const res = await fetch("/api/notes/post-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Add the returned note (or refetch from server)
        setNotes((prev) => [data.note, ...prev]);
        setNoteInput("");
        setAssignedAgents([]);
        setCurrentPage(1);
      } else {
        console.error("Failed to add note:", data.message);
        // optionally show error UI
      }
    } catch (err) {
      console.error("Error posting note:", err);
      // optionally show error UI
    }
  }
  async function handleSaveFile() {
    try {
      if (!fileForm.file || !fileForm.name) return;
      setIsUploading(true);

      const fd = new FormData();
      fd.append("file", fileForm.file);
      fd.append("name", fileForm.name);
      fd.append("fileType", fileForm.fileType);
      fd.append("clientId", id);
      fd.append("uploadedBy", currentUser._id);

      const res = await fetch("/api/files/client/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Upload failed");

      setFiles((prev) => [...prev, data.file]);
      setClient((c) => ({ ...c, files: [...(c?.files || []), data.file] }));
      setFileForm({ name: "", fileType: "generic", file: null });
      setIsUploading(false);
      handleClose();
    } catch (e) {
      console.error(e);
      setIsUploading(false);
    }
  }
  async function refreshClient() {
    try {
      const res = await fetch(`/api/client/get-client?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setClient(data.client);
        setInterestedCars(data.client.interestedCars || []);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Optional: delete a file (from Azure + Mongo)
  async function handleRemoveFile(index) {
    try {
      const f = files[index];
      const isDoc = typeof f === "object" && f !== null;
      if (!isDoc) {
        // legacy: just remove the URL locally
        setFiles((prev) => prev.filter((_, i) => i !== index));
        return;
      }
      const res = await fetch("/api/files/delete-file", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: f._id, clientId: id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Delete failed");

      setFiles((prev) => prev.filter((_, i) => i !== index));
      setClient((c) => ({
        ...c,
        files: (c?.files || []).filter((_, i) => i !== index),
      }));
    } catch (err) {
      console.error("Delete file failed:", err);
    }
  }
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!client) return <div>Loading...</div>;
  return (
    <Container>
      <LeftPanel>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <Title style={{ margin: 0 }}>{client.fullName}</Title>
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
              ".MuiSvgIcon-root": { color: "white" },
              "& .MuiOutlinedInput-notchedOutline": {
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
          <Label>Email</Label>
          <Value>{client.email}</Value>

          <Label>Phone</Label>
          <Value>{client.phoneNumber}</Value>

          <Label>Preferred Contact</Label>
          <Value>{client.preferredContactMethod}</Value>

          <Label>Lead Source</Label>
          <Value>{client.leadSource}</Value>

          <Label>Assigned Agent</Label>
          <Value>
            {typeof client.assignedAgent === "object"
              ? client.assignedAgent.fullName
              : client.assignedAgent}
          </Value>

          <Label>Interested Cars</Label>
          <Value>{client.interestedCars?.length || 0}</Value>
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
      <SaleDialog
        open={saleOpen}
        onClose={() => setSaleOpen(false)}
        car={carForSale} // {_id, title, price, images?}
        client={{
          id: client._id,
          name: client.fullName,
          email: client.email,
          phone: client.phoneNumber,
        }}
        agentid={"686c14f0e183f7e633c8f5e4"}
        onSaved={async () => {
          // Option A: simply refetch the client to reflect changes
          await refreshClient();
          setSaleOpen(false);
        }}
      />
      <RightPanel>
        <Tabs>
          {["Dashboard", "History", "Docs", "Notes", "Calls", "Tasks"].map(
            (tab) => (
              <Tab
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Tab>
            )
          )}
        </Tabs>

        <TabContent>
          {activeTab === "Dashboard" &&
            (interestedCars?.length ? (
              <DashboardGrid>
                {interestedCars.map((car, i) => {
                  const isObj = typeof car === "object" && car !== null;
                  const idOrIdx = isObj ? car._id ?? i : i;
                  const name =
                    (isObj &&
                      (car.title ||
                        [car.make, car.model, car.year]
                          .filter(Boolean)
                          .join(" "))) ||
                    String(car);
                  const img = isObj ? car.images?.[0] || car.image : null;
                  const price =
                    isObj && car.price != null
                      ? Number(car.price).toLocaleString()
                      : null;

                  return (
                    <CarCard key={idOrIdx}>
                      {img ? (
                        <CarThumb src={img} alt={name || "car"} />
                      ) : (
                        <div
                          style={{
                            height: 120,
                            background: "#111",
                            borderRadius: 10,
                          }}
                        />
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>{name || "Car"}</div>
                        {price && <Tag>{`$${price}`}</Tag>}
                      </div>
                      {isObj && car.status && (
                        <Muted>Status: {car.status}</Muted>
                      )}
                      <SmallButton
                        onClick={() => {
                          if (!isObj) {
                            alert(
                              "This car isn't populated yet. Populate client.interestedCars or fetch the car first."
                            );
                            return;
                          }
                          setCarForSale(car);
                          setSaleOpen(true);
                        }}
                        style={{ marginTop: 8 }}
                      >
                        Make Sale
                      </SmallButton>
                    </CarCard>
                  );
                })}
              </DashboardGrid>
            ) : (
              <Card>
                <Muted>No interested cars yet.</Muted>
              </Card>
            ))}

          {activeTab === "History" && (
            <div>Mass Edit Performed - Jul 08 '24</div>
          )}
          {activeTab === "Tasks" && (
            <div>
              <h3 style={{ color: "white" }}>Create Task</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newTaskObj = {
                    ...newTask,
                    completed: false,
                    createdBy: currentUser.name, // or currentUser._id if you handle IDs
                  };
                  setTasks((prev) => [newTaskObj, ...prev]);
                  setNewTask({
                    title: "",
                    dueDate: "",
                    note: "",
                    assignedTo: "",
                  });
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <StyledTextField
                  label="Title"
                  variant="outlined"
                  size="small"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
                <StyledTextField
                  type="date"
                  label="Due Date"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
                <StyledTextField
                  label="Note"
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                  value={newTask.note}
                  onChange={(e) =>
                    setNewTask({ ...newTask, note: e.target.value })
                  }
                />
                <Select
                  value={newTask.assignedTo}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignedTo: e.target.value })
                  }
                  displayEmpty
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "white",
                    ".MuiSelect-icon": { color: "white" },
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "#888",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#aaa",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ffffff",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Assign to Agent
                  </MenuItem>
                  {agents.map((agent) => (
                    <MenuItem key={agent._id} value={agent._id}>
                      {agent.fullName}
                    </MenuItem>
                  ))}
                </Select>

                <SubmitButton onClick={handleCreateTask}>
                  Create Task
                </SubmitButton>
              </form>

              <h3 style={{ color: "white" }}>Tasks</h3>
              {tasks.map((task, index) => (
                <NoteItem
                  key={index}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      color: "white",
                    }}
                  >
                    <strong>{task.title}</strong>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={async () => {
                          try {
                            const res = await fetch("/api/tasks/tick-task", {
                              method: "PUT",
                              body: JSON.stringify({
                                taskId: task._id,
                                completed: !task.completed,
                              }),
                              headers: {
                                "Content-Type": "application/json",
                              },
                            });

                            const data = await res.json();

                            if (res.ok && data.success) {
                              const updatedTasks = [...tasks];
                              updatedTasks[index] = data.task;
                              setTasks(updatedTasks);
                            } else {
                              console.error(
                                "Failed to update task:",
                                data.message
                              );
                            }
                          } catch (err) {
                            console.error("Error updating task:", err);
                          }
                        }}
                      />

                      <span>{task.completed ? "Completed" : "Pending"}</span>
                    </label>
                  </div>

                  <NoteMeta>
                    Assigned to:{" "}
                    {typeof task.assignedTo === "object"
                      ? task.assignedTo.fullName
                      : task.assignedTo}{" "}
                    <br />
                    Created by:{" "}
                    {typeof task.createdBy === "object"
                      ? task.createdBy.fullName
                      : task.createdBy}{" "}
                    <br />
                    Due: {task.dueDate} <br />
                    {task.note}
                  </NoteMeta>
                </NoteItem>
              ))}
            </div>
          )}

          {activeTab === "Docs" && (
            <FilesContainer>
              <h1 style={{ color: "white" }}>Files</h1>
              <FilesSecondContainer>
                <ReactSortable
                  list={files}
                  className="flex flex-wrap gap-1"
                  setList={updateFileOrder}
                >
                  {!!files?.length &&
                    files.map((f, idx) => {
                      const isDoc = typeof f === "object" && f !== null;
                      const url = isDoc ? f.url : f;
                      const name = isDoc ? f.name : `file${idx + 1}`;
                      const fileType = isDoc ? f.fileType : "generic";
                      const downloadLink = `${url}?response-content-disposition=attachment`;

                      return (
                        <FilePreview key={isDoc ? f._id : url}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <strong>{name}</strong> <Tag>{fileType}</Tag>
                          </div>
                          <StyledFile src={url} alt={name} />
                          <div
                            style={{
                              display: "flex",
                              gap: "5px",
                              marginTop: "5px",
                            }}
                          >
                            <a href={downloadLink}>
                              <SmallButton>Download</SmallButton>
                            </a>
                            <SmallButton
                              onClick={() => handleRemoveFile(idx)}
                              red
                            >
                              Remove
                            </SmallButton>
                          </div>
                        </FilePreview>
                      );
                    })}
                </ReactSortable>

                {isUploading && <FilePreview>...uploading</FilePreview>}

                {/* Open modal instead of instant upload */}
                <UploadLabel
                  style={{ width: "100px", height: "100px" }}
                  onClick={() => {
                    setOpen(true);
                  }}
                >
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
                </UploadLabel>
              </FilesSecondContainer>

              {/* Modal for Name + Type + File */}
              <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                  <h3 style={{ marginTop: 0 }}>Add File</h3>

                  <StyledLabel>File Name</StyledLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={fileForm.name}
                    onChange={(e) =>
                      setFileForm((f) => ({ ...f, name: e.target.value }))
                    }
                    InputProps={{ style: { color: "black" } }}
                  />

                  <StyledLabel style={{ marginTop: 10 }}>File Type</StyledLabel>
                  <Select
                    fullWidth
                    size="small"
                    value={fileForm.fileType}
                    onChange={(e) =>
                      setFileForm((f) => ({ ...f, fileType: e.target.value }))
                    }
                  >
                    {fileTypes.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </Select>

                  <StyledLabel style={{ marginTop: 10 }}>
                    Choose File
                  </StyledLabel>
                  <input
                    type="file"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setFileForm((prev) => ({
                        ...prev,
                        file: f,
                        name: prev.name || (f?.name ?? ""),
                      }));
                    }}
                  />

                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      gap: 8,
                      justifyContent: "flex-end",
                    }}
                  >
                    <SmallButton onClick={handleClose}>Cancel</SmallButton>
                    <SmallButton onClick={handleSaveFile}>Save</SmallButton>
                  </div>
                </Box>
              </Modal>
            </FilesContainer>
          )}
          {activeTab === "Calls" && <div>No calls logged.</div>}

          {activeTab === "Notes" && (
            <NotesWrapper>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <Autocomplete
                  multiple
                  options={agents.filter(
                    (agent) =>
                      !assignedAgents.some(
                        (assigned) => assigned._id === agent._id
                      )
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
                        style: { color: "black" },
                        onKeyDown: handleKeyDown,
                      }}
                      InputLabelProps={{ style: { color: "black" } }}
                    />
                  )}
                />
                <NoteInput
                  placeholder="Write a note..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                <SubmitButton onClick={postNote}>Add Note</SubmitButton>
              </div>

              <NotesList>
                {paginatedNotes.map((note, index) => (
                  <NoteItem key={index}>
                    {note.content}
                    <NoteMeta>
                      <div>{new Date(note.createdAt).toLocaleString()}</div>
                      {note.taggedAgents && note.taggedAgents.length > 0 && (
                        <div>
                          Tagged Agents:{" "}
                          {note.taggedAgents.map((agentId) => {
                            const agent = agents.find((a) => a._id === agentId);
                            return (
                              <Tag key={agentId}>
                                {agent ? agent.fullName : "Unknown"}
                              </Tag>
                            );
                          })}
                        </div>
                      )}
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
                        className={currentPage === i + 1 ? "active" : ""}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PageNumber>
                    ))}

                    <Next
                      onClick={() =>
                        setCurrentPage((p) => (p < totalPages ? p + 1 : p))
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
