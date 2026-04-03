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
import { useSession } from "next-auth/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100vh",
  fontFamily: "Arial, sans-serif",
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const LeftPanel = styled("div")(({ theme }) => ({
  width: `fit-content`,
  padding: 20,
  borderRight: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  height: "100%",
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
  min-width: 400px;
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
const MessageBubble = styled.div`
  padding: 10px 14px;
  border-radius: 10px;
  max-width: 70%;
  margin-bottom: 10px;
  font-size: 14px;

  background: ${(props) =>
    props.direction === "outbound" ? "#2d7cff" : "#333"};

  align-self: ${(props) =>
    props.direction === "outbound" ? "flex-end" : "flex-start"};
`;
const Muted = styled("div")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 12,
}));

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In Progress" },
  { value: "waiting_for_documents", label: "Waiting for Documents" },
  { value: "submitted", label: "Submitted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "on_hold", label: "On Hold" },
  { value: "closed", label: "Closed" },
  { value: "interested", label: "Interested" },
  { value: "purchased", label: "Purchased" },
];
const temperatureOptions = [
  { value: "cold", label: "Cold" },
  { value: "warm", label: "Warm" },
  { value: "hot", label: "Hot" },
];
const staticAlerts = [
  { text: "Follow up on financing documents", date: "2026-03-05" },
  { text: "Call client about trade-in valuation", date: "2026-03-03" },
];
const staticTags = ["Finance", "Trade-in", "VIP", "High Priority"];
const currentUser = { _id: "123", name: "Admin User" };
const lossReasons = [
  { value: "price_too_high", label: "Price too high" },
  { value: "not_interested", label: "Not interested anymore" },
  { value: "bought_elsewhere", label: "Bought from another dealer" },
  { value: "financing_issue", label: "Financing issue" },
  { value: "no_response", label: "Stopped responding" },
  { value: "wrong_car", label: "Didn’t like the car" },
];
export default function Page() {
  const { data: session, status } = useSession();
  console.log("Session data:", session, "Status:", status);
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [interestedCars, setInterestedCars] = useState([]);
  const [clientStatus, setClientStatus] = useState("New");
  const [clientTemperature, setClientTemperature] = useState("cold");
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [whatsappHistory, setWhatsappHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentForm, setAppointmentForm] = useState({
    type: "visit",
    date: null,
    time: null,
    location: "",
    notes: "",
    status: "scheduled",
  });
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    note: "",
    assignedTo: "",
  });
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
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
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [sendingWhatsapp, setSendingWhatsapp] = useState(false);
  const notesPerPage = 3;
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [closeData, setCloseData] = useState({
    outcome: "won",
    reason: "",
  });

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/client/${id}`,
        );
        const data = await response.json();
        console.log(data.client);
        if (data.success) {
          setClient(data.client);
          const normalizedStatus = data.client.status
            ?.toLowerCase()
            .trim()
            .replace(/\s+/g, "_");

          const validStatus = statusOptions.find(
            (s) => s.value === normalizedStatus,
          );

          setClientStatus(validStatus ? validStatus.value : "new");
          setInterestedCars(data.client.interestedCars || []);
          const normalizedTemp = data.client.temperature?.toLowerCase().trim();

          const validTemp = temperatureOptions.find(
            (t) => t.value === normalizedTemp,
          );

          setClientTemperature(validTemp ? validTemp.value : "cold");
          setTasks(data.client.tasks || []);
          setNotes(data.notes || []);
          setFiles(data.client.files || []);
          setHistory(data.activity || []);
          setWhatsappHistory(data.communications || []);
          setAppointments(data.appointments || []);
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
    currentPage * notesPerPage,
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
      (agent) => agent.fullName.toLowerCase() === name.trim().toLowerCase(),
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
  async function handleUpdateAppointmentStatus(id, status) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.apiToken}`,
          },
          body: JSON.stringify({ id, status }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a)),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function postNote() {
    //if (!noteInput.trim()) return;
    if (!session?.user?.id) return;

    const payload = {
      content: noteInput.trim(),
      clientId: id,
      authorId: session.user.id,
      taggedAgents: assignedAgents.map((agent) => agent._id),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.id}`, // temporary until real JWT verify
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setNotes((prev) => [data.note, ...prev]);

        setNoteInput("");
        setAssignedAgents([]);
        setCurrentPage(1);
      } else {
        console.error("Failed to add note:", data.message);
      }
    } catch (err) {
      console.error("Error posting note:", err);
    }
  }
  async function sendEmail() {
    if (!emailForm.subject || !emailForm.message) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.apiToken}`,
        },
        body: JSON.stringify({
          clientId: id,
          subject: emailForm.subject,
          message: emailForm.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEmailModalOpen(false);

        setEmailForm({
          subject: "",
          message: "",
        });

        await refreshClient();
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function updateClient(payload) {
    if (!session?.user?.id) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clients`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session.user.apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to update client:", data.message);
        return;
      }

      return data.client;
    } catch (err) {
      console.error("Error updating client:", err);
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client/${id}`,
      );
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
  async function sendWhatsApp() {
    if (!whatsappMessage.trim()) return;

    try {
      setSendingWhatsapp(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/whatsapp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.apiToken}`,
          },
          body: JSON.stringify({
            clientId: id,
            message: whatsappMessage,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setWhatsappMessage("");
        await refreshClient();
      } else {
        console.error("WhatsApp send failed:", data.message);
      }
    } catch (err) {
      console.error("WhatsApp error:", err);
    } finally {
      setSendingWhatsapp(false);
    }
  }
  function buildStartDate(date, time) {
    if (!date || !time) return null;

    const combined = date
      .hour(time.hour())
      .minute(time.minute())
      .second(0)
      .millisecond(0);

    return combined.toDate();
  }

  async function handleCreateAppointment() {
    /*
    if (!appointmentForm.date || !appointmentForm.time) {
      alert("Date and time required");
      return;
    }
*/
    const startAt = buildStartDate(appointmentForm.date, appointmentForm.time);

    const payload = {
      client: id,
      agent: session.user.id,
      dealershipId: session.user.dealershipId,
      car: null, // optional for now
      startAt,
      endAt: new Date(startAt.getTime() + 30 * 60000), // +30 mins
      location: appointmentForm.location,
      type: appointmentForm.type,
      status: appointmentForm.status,
      notes: appointmentForm.notes,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.apiToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create appointment");
        return;
      }

      alert("Appointment created");
    } catch (err) {
      console.error(err);
    }
  }
  const AppointmentCard = ({ appt }) => (
    <div
      style={{
        background: "#2a2a2a",
        padding: "10px",
        borderRadius: "8px",
        marginTop: "10px",
      }}
    >
      <div style={{ fontWeight: "bold" }}>
        {appt.type.replace("_", " ").toUpperCase()}
        {appt.car?.title ? ` - ${appt.car.title}` : ""}
      </div>

      <div style={{ fontSize: "13px", opacity: 0.8 }}>
        {new Date(appt.startAt).toLocaleString()}
      </div>

      <div style={{ fontSize: "12px", opacity: 0.6 }}>
        {appt.location || "No location"}
      </div>

      <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
        <Select
          value={appt.status}
          onChange={(e) =>
            handleUpdateAppointmentStatus(appt._id, e.target.value)
          }
          size="small"
          sx={{
            color: "white",
            ".MuiSvgIcon-root": { color: "white" },
          }}
        >
          <MenuItem value="scheduled">Scheduled</MenuItem>
          <MenuItem value="arrived">Arrived</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="no_show">No Show</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </div>
    </div>
  );
  const now = new Date();

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.startAt) >= now,
  );

  const completedAppointments = appointments.filter(
    (a) => new Date(a.startAt) < now,
  );
  async function handleStatusUpdate(status, extra = {}) {
    setClientStatus(status);

    await updateClient({
      clientId: id,
      employeeId: session.user.id,
      status,
      ...extra,
    });
  }
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!client) return <div>Loading...</div>;
  return (
    <Container>
      <Modal open={assignModalOpen} onClose={() => setAssignModalOpen(false)}>
        <Box sx={modalStyle}>
          <h3 style={{ marginTop: 0 }}>Assign Agent</h3>

          <Autocomplete
            options={agents}
            getOptionLabel={(option) => option.fullName}
            value={selectedAgent}
            onChange={(e, newValue) => setSelectedAgent(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Agent"
                InputProps={{
                  ...params.InputProps,
                  style: { color: "white" },
                }}
              />
            )}
          />
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            <SmallButton onClick={() => setAssignModalOpen(false)}>
              Cancel
            </SmallButton>

            <SmallButton
              onClick={async () => {
                if (!selectedAgent) return;

                const updated = await updateClient({
                  clientId: id,
                  assignedAgent: selectedAgent._id,
                });

                if (updated) {
                  setClient(updated);
                  setAssignModalOpen(false);
                }
              }}
            >
              Save
            </SmallButton>
          </div>
        </Box>
      </Modal>
      <Modal open={emailModalOpen} onClose={() => setEmailModalOpen(false)}>
        <Box sx={modalStyle}>
          <h3>Send Email</h3>

          <TextField
            fullWidth
            label="Subject"
            value={emailForm.subject}
            onChange={(e) =>
              setEmailForm({
                ...emailForm,
                subject: e.target.value,
              })
            }
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={emailForm.message}
            onChange={(e) =>
              setEmailForm({
                ...emailForm,
                message: e.target.value,
              })
            }
            style={{ marginTop: 10 }}
          />

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <SmallButton onClick={() => setEmailModalOpen(false)}>
              Cancel
            </SmallButton>

            <SmallButton onClick={sendEmail}>Send</SmallButton>
          </div>
        </Box>
      </Modal>
      <Modal open={closeModalOpen} onClose={() => setCloseModalOpen(false)}>
        <Box sx={modalStyle}>
          <h3>Close Deal</h3>

          {/* Outcome */}
          <Select
            fullWidth
            value={closeData.outcome}
            onChange={(e) =>
              setCloseData({ ...closeData, outcome: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="won">Won</MenuItem>
            <MenuItem value="lost">Lost</MenuItem>
          </Select>

          {/* Reason (only if lost) */}
          {closeData.outcome === "lost" && (
            <Select
              fullWidth
              value={closeData.reason}
              onChange={(e) =>
                setCloseData({ ...closeData, reason: e.target.value })
              }
              displayEmpty
              sx={{
                marginTop: 2,
                color: "black",
              }}
            >
              <MenuItem value="" disabled>
                Select reason
              </MenuItem>

              {lossReasons.map((reason) => (
                <MenuItem key={reason.value} value={reason.value}>
                  {reason.label}
                </MenuItem>
              ))}
            </Select>
          )}

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <SmallButton onClick={() => setCloseModalOpen(false)}>
              Cancel
            </SmallButton>

            <SmallButton
              onClick={async () => {
                await handleStatusUpdate("closed", {
                  dealOutcome: closeData.outcome,
                  lossReason: closeData.reason,
                  closedAt: new Date(),
                });

                setCloseModalOpen(false);
              }}
            >
              Confirm
            </SmallButton>
          </div>
        </Box>
      </Modal>
      <LeftPanel>
        <InfoBlock style={{ display: "flex", justifyContent: "end" }}>
          <button onClick={() => setEmailModalOpen(true)}>
            <svg
              class="w-6 h-6 white dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z" />
              <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z" />
            </svg>
          </button>
        </InfoBlock>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <Title style={{ margin: 0 }}>{client.fullName}</Title>

          <div style={{ display: "flex", gap: "8px" }}>
            {/* Status Select */}
            <Select
              value={clientStatus}
              onChange={(e) => {
                const newStatus = e.target.value;

                if (newStatus === "closed") {
                  setCloseModalOpen(true);
                  return;
                }

                handleStatusUpdate(newStatus);
              }}
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
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>

            {/* Temperature Select */}
            <Select
              value={clientTemperature}
              onChange={async (e) => {
                const newTemp = e.target.value;

                setClientTemperature(newTemp);

                await updateClient({
                  clientId: id,
                  employeeId: session.user.id,
                  temperature: newTemp,
                });
              }}
              variant="outlined"
              size="small"
              sx={{
                backgroundColor:
                  clientTemperature === "hot"
                    ? "#8B0000"
                    : clientTemperature === "warm"
                      ? "#8B5E00"
                      : "#444",
                color: "white",
                borderRadius: "4px",
                fontSize: "14px",
                ".MuiSvgIcon-root": { color: "white" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#666",
                },
              }}
            >
              {temperatureOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>

        <InfoBlock>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div>
              <Label>Created At</Label>
              <Value>
                {client.createdAt
                  ? new Date(client.createdAt).toLocaleString()
                  : "N/A"}
              </Value>
            </div>

            <div>
              <Label>Last activity date</Label>
              <Value>
                {client.lastActivityAt
                  ? new Date(client.lastActivityAt).toLocaleString()
                  : "N/A"}
              </Value>
            </div>
          </div>
          <Label>Assigned Agent</Label>
          <Value
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => setAssignModalOpen(true)}
          >
            {client.assignedAgent?.fullName || "Assign Agent"}
          </Value>

          <Label>Email</Label>
          <Value>{client.email}</Value>

          <Label>Phone</Label>
          <Value>{client.phoneNumber}</Value>

          <Label>Preferred Contact</Label>
          <Value>{client.preferredContactMethod}</Value>

          <Label>Lead Source</Label>
          <Value>{client.leadSource}</Value>

          <Label>Interested Cars</Label>
          <Value>{client.interestedCars?.length || 0}</Value>
        </InfoBlock>

        <div>
          <div>
            <Label>Income</Label>
            <Value>$10,000.00</Value>
          </div>{" "}
          <div>
            <Label>Income</Label>
            <Value>$10,000.00</Value>
          </div>
        </div>
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
        <div style={{ marginBottom: "15px" }}>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            Tags
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {staticTags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          {/* 🔥 Alerts Section */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                fontSize: "14px",
                marginTop: "20px",
              }}
            >
              Alerts
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {staticAlerts.map((alert, index) => (
                <div
                  key={index}
                  style={{
                    width: "100%",
                    padding: "5px 12px",
                    borderRadius: "8px",
                    backgroundColor: "#257381",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: "12px" }}>{alert.text}</div>

                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    Due: {new Date(alert.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Tabs>
          {[
            "Dashboard",
            "History",
            "WhatsApp",
            "Docs",
            "Notes",
            "Calls",
            "Tasks",
            "Appointments",
          ].map((tab) => (
            <Tab
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Tab>
          ))}
        </Tabs>

        <TabContent>
          {activeTab === "Dashboard" &&
            (interestedCars?.length ? (
              <DashboardGrid>
                {interestedCars.map((car, i) => {
                  const isObj = typeof car === "object" && car !== null;
                  const idOrIdx = isObj ? (car._id ?? i) : i;
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
                              "This car isn't populated yet. Populate client.interestedCars or fetch the car first.",
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
          {activeTab === "WhatsApp" && (
            <div
              style={{
                maxWidth: "600px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3 style={{ color: "white" }}>WhatsApp Conversation</h3>

              {/* HISTORY */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "20px",
                  gap: "6px",
                }}
              >
                {whatsappHistory.length === 0 ? (
                  <div style={{ opacity: 0.6 }}>No messages yet</div>
                ) : (
                  whatsappHistory.map((msg) => (
                    <MessageBubble key={msg._id} direction={msg.direction}>
                      <div style={{ fontSize: "12px", opacity: 0.7 }}>
                        {msg.direction === "outbound" ? "Outbound" : "Inbound"}
                      </div>

                      <div>{msg.message}</div>

                      <div style={{ fontSize: "11px", opacity: 0.6 }}>
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </MessageBubble>
                  ))
                )}
              </div>

              {/* SEND FORM */}
              <StyledTextField
                fullWidth
                multiline
                rows={4}
                label="Message"
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
              />

              <div style={{ marginTop: 15 }}>
                <SubmitButton onClick={sendWhatsApp} disabled={sendingWhatsapp}>
                  {sendingWhatsapp ? "Sending..." : "Send WhatsApp"}
                </SubmitButton>
              </div>
            </div>
          )}
          {activeTab === "History" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {history.length === 0 ? (
                <div style={{ opacity: 0.6 }}>No history yet.</div>
              ) : (
                history.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "#2a2a2a",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{item.type}</div>

                    <div style={{ fontSize: "13px", opacity: 0.8 }}>
                      By: {item.performedBy?.fullName || "System"}
                    </div>

                    <div style={{ fontSize: "12px", opacity: 0.6 }}>
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
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
                                data.message,
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
          {activeTab === "Appointments" && (
            <div style={{ maxWidth: "500px" }}>
              <h3 style={{ color: "white" }}>Appointment Form</h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Select
                  value={appointmentForm.type}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      type: e.target.value,
                    })
                  }
                  size="small"
                  sx={{
                    color: "white",
                    ".MuiSvgIcon-root": { color: "white" },
                  }}
                >
                  <MenuItem value="visit">Visit</MenuItem>
                  <MenuItem value="test_drive">Test Drive</MenuItem>
                  <MenuItem value="delivery">Delivery</MenuItem>
                </Select>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={appointmentForm.date}
                    onChange={(newValue) =>
                      setAppointmentForm({ ...appointmentForm, date: newValue })
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />

                  <TimePicker
                    label="Time"
                    value={appointmentForm.time}
                    onChange={(newValue) =>
                      setAppointmentForm({ ...appointmentForm, time: newValue })
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>

                <StyledTextField
                  label="Location"
                  size="small"
                  value={appointmentForm.location}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      location: e.target.value,
                    })
                  }
                />

                <StyledTextField
                  label="Notes"
                  size="small"
                  multiline
                  rows={3}
                  value={appointmentForm.notes}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      notes: e.target.value,
                    })
                  }
                />

                <SubmitButton onClick={handleCreateAppointment}>
                  Create Appointment
                </SubmitButton>
              </div>
              <div style={{ marginTop: "30px" }}>
                <h3 style={{ color: "white" }}>Upcoming Appointments</h3>

                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appt) => (
                    <AppointmentCard key={appt._id} appt={appt} />
                  ))
                ) : (
                  <div style={{ opacity: 0.6 }}>No upcoming appointments</div>
                )}
                <h3 style={{ color: "white", marginTop: "30px" }}>
                  Completed / Past Appointments
                </h3>

                {completedAppointments.length > 0 ? (
                  completedAppointments.map((appt) => (
                    <AppointmentCard key={appt._id} appt={appt} />
                  ))
                ) : (
                  <div style={{ opacity: 0.6 }}>No past appointments</div>
                )}
              </div>
            </div>
          )}
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
                        (assigned) => assigned._id === agent._id,
                      ),
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
                        style: { color: "white" },
                        onKeyDown: handleKeyDown,
                      }}
                      InputLabelProps={{ style: { color: "white" } }}
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
