"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { 

  Phone, 
  WhatsApp, 
  AutoAwesome, 
  Bolt, 
  Info, 
  FileDownload,
  DocumentScanner,
  Inventory,
  CloudUpload,
  Send
} from "@mui/icons-material";
import QualifiedLeads from "../../../../../components/inventory/QualifiedLeads";
import LiveViewersWidget from "../../../../../components/inventory/LiveViewersWidget";
import h337 from "heatmap.js";
import { useRef } from "react";
import MarketIntelligencePanel from "../../../../../components/market/MarketIntelligencePanel";

// --- GLOBAL LAYOUT --- 
const PageContainer = styled.div`
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 32px;
  color: #0f172a;
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// --- HEADER STRIP ---
const HeaderStrip = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 24px;
  max-width: 1400px;
  margin: 0 auto 24px auto;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const TitleCol = styled.div`
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #0f172a;
  }
  .sub {
    font-size: 1.2rem;
    color: #475569;
    font-weight: 500;
    margin-bottom: 12px;
  }
`;

const TagsRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  
  .stock-vin {
    color: #64748b;
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 4px;
  }
  .ready {
    background: #16a34a;
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
  }
  .hot {
    background: #fee2e2;
    color: #ef4444;
    padding: 4px 10px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Btn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;

  &:hover { opacity: 0.9; }
  
  &.call { background: #f1f5f9; color: #0f172a; }
  &.whatsapp { background: #16a34a; color: white; }
  &.reserve { background: #1e3a8a; color: white; }
  &.sold { background: #0f172a; color: white; }
`;

// --- METRICS ROW ---
const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
`;

const Metric = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .val {
    font-size: 1.2rem;
    font-weight: 800;
    color: #0f172a;
  }
  .blue { color: #1e3a8a; }
  .green { color: #16a34a; }
`;

// --- GALLERY ---
const GalleryBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const HeroImage = styled.div`
  width: 100%;
  height: 400px;
  background-color: #cbd5e1;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 12px;
  position: relative;
`;

const WatermarkToggle = styled.div`
  position: absolute;
  top: 12px; left: 12px;
  background: white;
  color: #0f172a;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ThumbRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

const Thumb = styled.div`
  height: 90px;
  background-color: #f1f5f9;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  border: ${props => props.active ? '2px solid #1e3a8a' : '2px solid transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.7rem;
  font-weight: 600;
`;

// --- TWIN PANELS ---
const TwinPanels = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const Panel = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  h3 {
    margin: 0 0 16px 0;
    font-size: 1rem;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  
  &:last-child { border: none; padding-bottom: 0; }
  
  .lbl { color: #64748b; }
  .val { font-weight: 700; color: #0f172a; }
`;

const HealthWidget = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;

  .icon {
    width: 40px; height: 40px;
    background: #dcfce7; color: #16a34a;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .info {
    display: flex; flex-direction: column;
    .lbl { font-size: 0.75rem; color: #64748b; font-weight: 600; }
    .val { font-size: 1rem; font-weight: 800; color: #0f172a; }
  }
`;

// --- TIMELINE ---
const TimelineBox = styled(Panel)`
  margin-top: 0;
`;

// --- SYNDICATION WIDGET ---
const SyndicationWidget = styled(Panel)`
  border: 2px solid #e2e8f0;
  h3 { margin-bottom: 24px; }
`;

const InputGroup = styled.div`
  display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;
  label { font-weight: 600; font-size: 0.85rem; color: #475569; }
  input { 
    padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; 
    font-size: 0.95rem; 
  }
`;

const ResultBox = styled.div`
  background: #f1f5f9; padding: 16px; border-radius: 8px; font-family: monospace;
  font-size: 0.9rem; color: #334155; margin-top: 16px; min-height: 50px;
`;

const ActionButton = styled.button`
  background: #1e3a8a; color: white; border: none; padding: 12px 20px;
  border-radius: 8px; font-weight: 700; width: 100%; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: 0.2s;
  &:hover { opacity: 0.9; }
`;
const TimeItem = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  position: relative;
  
  &:last-child { margin-bottom: 0; }
  
  .dot {
    width: 32px; height: 32px;
    background: #f1f5f9;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #64748b;
    z-index: 2;
  }
  .content {
    flex: 1;
    .title { font-weight: 600; font-size: 0.95rem; color: #0f172a; margin-bottom: 4px; }
    .meta { font-size: 0.8rem; color: #64748b; }
  }
`;

// --- RIGHT COL WIDGETS ---
const AICard = styled.div`
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  border-radius: 12px;
  padding: 24px;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.4);

  h3 { margin: 0 0 12px 0; font-size: 1rem; display: flex; align-items: center; gap: 8px; }
  p { font-size: 0.9rem; line-height: 1.5; color: #e0e7ff; margin: 0 0 16px 0; }
  
  .rec {
    background: rgba(255,255,255,0.1);
    padding: 12px; border-radius: 8px;
    font-size: 0.85rem; font-style: italic; margin-bottom: 16px; border-left: 3px solid #60a5fa;
  }
  
  button {
    width: 100%; background: white; color: #1e3a8a;
    border: none; padding: 12px; border-radius: 8px;
    font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  }
`;

const LeadCard = styled(Panel)`
  .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  h3 { margin: 0; }
  .badge { background: #dbeafe; color: #1e3a8a; font-size: 0.7rem; padding: 4px 8px; border-radius: 12px; font-weight: 700;}
`;

const LeadItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  display: flex; justify-content: space-between; align-items: center;
  &:last-child { border: none; padding-bottom: 0; }
  
  .info {
    .name { font-weight: 700; font-size: 0.95rem; color: #0f172a; margin-bottom: 2px;}
    .desc { font-size: 0.8rem; color: #64748b; display: flex; align-items: center; gap: 4px;}
  }
`;

const NegCard = styled(Panel)`
  background: #f8fafc;
`;
const NegRow = styled.div`
  display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;
  .lbl { color: #64748b; }
  .val { font-weight: 700; color: #0f172a;}
`;

const DocCard = styled(Panel)``;
const DocRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px;
  .info {
    .name { font-weight: 600; font-size: 0.85rem; margin-bottom: 2px; color: #0f172a;}
    .meta { font-size: 0.7rem; color: #64748b;}
  }
  .icon { color: #64748b; cursor: pointer; }
`;

const AdvancedPanel = styled(Panel)`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  grid-column: 1 / -1;
  margin-top: 24px;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const EditGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
  input, select { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem; }
`;

const SectionTitle = styled.h4`
  font-size: 0.85rem;
  font-weight: 800;
  color: #1e3a8a;
  text-transform: uppercase;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e2e8f0;
  &:first-of-type { margin-top: 0; }
`;

const TabRow = styled.div`
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 24px;
`;

const Tab = styled.div`
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 700;
  color: ${props => props.active ? '#1e3a8a' : '#64748b'};
  border-bottom: 3px solid ${props => props.active ? '#1e3a8a' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    color: #1e3a8a;
    background: #f1f5f9;
  }
`;


export default function MasterStockDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDocUploading, setIsDocUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('management');
  
  // History State
  const [history, setHistory] = useState([]);
  
  // Remote Scan State
  const [scanSessionId, setScanSessionId] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  // Auto-Poster State
  const [syndicateState, setSyndicateState] = useState(null);
  const [syndicatePlatform, setSyndicatePlatform] = useState(null);

  // Heatmap State
  const [heatmapVisible, setHeatmapVisible] = useState(false);
  const [screenshotData, setScreenshotData] = useState(null);
  const [screenshotWidth, setScreenshotWidth] = useState(0);
  const [screenshotHeight, setScreenshotHeight] = useState(0);
  const [isHeatmapLoading, setIsHeatmapLoading] = useState(false);
  const [rawHeatmapData, setRawHeatmapData] = useState([]);
  const heatmapInstance = useRef(null);
  const heatmapContainer = useRef(null); // which platform is currently running
  const [fbEmail, setFbEmail] = useState("");
  const [fbPassword, setFbPassword] = useState("");
  const [osEmail, setOsEmail] = useState("");
  const [osPassword, setOsPassword] = useState("");

  const triggerSyndicate = async (platform = 'both') => {
    // Validate credentials based on platform
    if ((platform === 'facebook' || platform === 'both') && (!fbEmail || !fbPassword)) {
      setSyndicateState("Error: Please enter FB Email and Password!");
      return;
    }
    if ((platform === 'opensooq' || platform === 'both') && (!osEmail || !osPassword)) {
      setSyndicateState("Error: Please enter OpenSooq Email and Password!");
      return;
    }

    const platformLabel = platform === 'facebook' ? 'Facebook' : platform === 'opensooq' ? 'OpenSooq' : 'Both Platforms';
    setSyndicatePlatform(platform);
    setSyndicateState(`Initializing ${platformLabel} Bot & Fetching Images...`);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/syndicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          platform,
          carId: car._id,
          // Identification
          title: car.title,
          carMake: car.carMake,
          model: car.model,
          trim: car.trim,
          year: car.year,
          // Condition & History
          condition: car.condition,
          mileage: car.mileage,
          paint: car.paint,
          // Powertrain
          fuel: car.fuel,
          transmission: car.transmission,
          engineSize: car.engineSize,
          // Specs & Type
          bodyType: car.bodyType,
          color: car.color,
          regionalSpecs: car.regionalSpecs,
          specifications: car.specifications,
          interiorOptions: car.interiorOptions,
          exteriorOptions: car.exteriorOptions,
          // Legals
          carCustoms: car.carCustoms,
          carLicense: car.carLicense,
          insurance: car.insurance,
          // Pricing
          price: car.price,
          paymentMethod: car.paymentMethod,
          vinNumber: car.vinNumber,
          // Media
          images: car.images || [],
          // Auth
          fbEmail,
          fbPassword,
          osEmail,
          osPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setSyndicateState(`✅ ${platformLabel}: Posted successfully!`);
      } else {
        setSyndicateState("Error: " + data.error);
      }
    } catch (err) {
      setSyndicateState("Network Error reaching backend Puppeteer API.");
    }
    setSyndicatePlatform(null);
  };

  useEffect(() => {
    if (!id) return;
    async function fetchCar() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/cars/${id}`);
        const data = await res.json();
        setCar(data.car);
        setEditData(data.car); // Initialize edit data
      } catch (err) {
        console.error(err);
      }
    }
    fetchCar();
    fetchHistory();
  }, [id]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/cars/${id}/activities`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setHistory(data.activities);
        }
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/cars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (data.success) {
        setCar(data.car);
        setIsEditing(false);
      } else {
        alert("Error saving: " + data.error);
      }
    } catch (err) {
      alert("Network error saving car.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    try {
      const res = await fetch("/api/uploadMultipleImages", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.links && data.links.length > 0) {
        // Append new images to existing ones
        const updatedImages = [...(car.images || []), ...data.links];
        
        // Save to database
        const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/cars/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: updatedImages })
        });
        const saveData = await saveRes.json();
        
        if (saveData.success) {
          setCar(saveData.car);
          setEditData(saveData.car);
          setActiveImageIndex(updatedImages.length - data.links.length);
        }
      }
    } catch (err) {
      alert("Error uploading images.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsDocUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("carId", id);
    formData.append("name", file.name);
    formData.append("fileType", "generic");

    try {
      const res = await fetch("/api/files/vehicle/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        // Refresh car to get updated files list
        const carRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/cars/${id}`);
        const carData = await carRes.json();
        setCar(carData.car);
      }
    } catch (err) {
      alert("Error uploading document.");
    } finally {
      setIsDocUploading(false);
    }
  };

  const deleteDoc = async (fileId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      // Assuming a generic delete-file route exists or we use a custom one
      const res = await fetch("/api/files/delete-file", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, carId: id })
      });
      if (res.ok) {
        const carRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/cars/${id}`);
        const carData = await carRes.json();
        setCar(carData.car);
      }
    } catch (err) {
      alert("Error deleting document.");
    }
  };

  const startRemoteScan = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002'}/api/scan/session`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.sessionId) {
        setScanSessionId(data.sessionId);
        setIsPolling(true);
      }
    } catch (err) {
      alert("Failed to start scan session.");
    }
  };

  const fetchAndShowHeatmap = async () => {
    setIsHeatmapLoading(true);
    setHeatmapVisible(true);
    try {
      const publicUrl = `http://localhost:3001/stock/${id}`;
      // Fetch both concurrently
      const [screenRes, heatRes] = await Promise.all([
        fetch(`/api/takescreenshot?url=${encodeURIComponent(publicUrl)}`),
        fetch(`/api/heatmap/getheatmap?page=/stock/${id}`)
      ]);
      
      const screenData = await screenRes.json();
      
      if (heatRes.ok) {
        const heatmapData = await heatRes.json();
        setRawHeatmapData(heatmapData);
      }

      if (screenData.image) {
        setScreenshotData(screenData.image);
      }
    } catch (error) {
      console.error("Heatmap Error:", error);
      setIsHeatmapLoading(false);
    }
  };

  const handleHeatmapImageLoad = () => {
    if (!heatmapContainer.current || !rawHeatmapData) return;
    
    // Ensure cleanup of previous instances
    if (heatmapInstance.current) {
      heatmapInstance.current.setData({ data: [] });
      heatmapContainer.current.innerHTML = "";
    }

    heatmapInstance.current = h337.create({
      container: heatmapContainer.current,
      radius: 35,
      maxOpacity: 0.7,
      minOpacity: 0.1,
      blur: 0.8,
    });
    
    const rect = heatmapContainer.current.getBoundingClientRect();
    
    heatmapInstance.current.setData({
      max: 10,
      data: rawHeatmapData.map(({ x, y }) => ({
        x: Math.round((x / 100) * rect.width),
        y: Math.round((y / 100) * rect.height),
        value: 5,
      })),
    });
    
    setIsHeatmapLoading(false);
  };

  const closeHeatmap = () => {
    setHeatmapVisible(false);
    if (heatmapInstance.current) {
      heatmapInstance.current.setData({ data: [] });
      heatmapInstance.current = null;
    }
  };

  useEffect(() => {
    let interval;
    if (isPolling && scanSessionId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002'}/api/scan/session/${scanSessionId}`);
          const data = await res.json();
          if (data.status === 'completed' && data.vin) {
            handleInputChange('vinNumber', data.vin);
            setIsPolling(false);
            setScanSessionId(null);
            if (!isEditing) setIsEditing(true); // Open edit mode if not already
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPolling, scanSessionId, isEditing]);

  if (!car) return <div style={{ padding: 48, fontWeight: 600 }}>Loading Vehicle Intelligence...</div>;

  const totalLandedCost = car.totalLandedCost || (car.price ? car.price * 0.85 : 0);
  const floorPrice = car.minimumAcceptedPrice || Math.ceil(totalLandedCost * 1.08);
  const profitAtAsk = (car.price || 0) - totalLandedCost;
  const roiEstimate = totalLandedCost > 0 ? (((car.price || 0) - totalLandedCost) / totalLandedCost) * 100 : 0;
  
  const formattedCreatedAt = new Date(car.createdAt).toLocaleDateString();
  const formattedUpdatedAt = new Date(car.updatedAt).toLocaleDateString();

  return (
    <PageContainer>
      
      {/* 🔴 HEADER STRIP */}
      <HeaderStrip>
        <TitleRow>
          <TitleCol>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '80px' }} type="number" value={editData.year} onChange={e => handleInputChange('year', e.target.value)} placeholder="Year" />
                <input style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} type="text" value={editData.carMake} onChange={e => handleInputChange('carMake', e.target.value)} placeholder="Make" />
                <input style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} type="text" value={editData.model} onChange={e => handleInputChange('model', e.target.value)} placeholder="Model" />
              </div>
            ) : (
              <h1>{car.year} {car.carMake} {car.model}</h1>
            )}
            
            {isEditing ? (
              <input style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '12px', display: 'block' }} type="text" value={editData.trim} onChange={e => handleInputChange('trim', e.target.value)} placeholder="Trim / Subtitle" />
            ) : (
              <div className="sub">({car.trim || "Base Trim"})</div>
            )}

            <TagsRow>
              <div className="stock-vin">Stock: #{car._id.slice(-6).toUpperCase()}</div>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} type="text" value={editData.vinNumber} onChange={e => handleInputChange('vinNumber', e.target.value)} placeholder="VIN Number" />
                  <button onClick={startRemoteScan} style={{ padding: '4px 8px', borderRadius: '4px', background: '#3b82f6', color: 'white', border: 'none', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>📱 SCAN ON MOBILE</button>
                  <button onClick={() => router.push('/stock/post-product')} style={{ padding: '4px 8px', borderRadius: '4px', background: '#10b981', color: 'white', border: 'none', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>➕ POST CAR</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div className="stock-vin">VIN: {car.vinNumber || "N/A"}</div>
                  <button onClick={startRemoteScan} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Remote Scan</button>
                  <button onClick={() => router.push('/stock/post-product')} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Post Car</button>
                </div>
              )}
            </TagsRow>
            <TagsRow style={{ marginTop: 12 }}>
              <div className="ready">{car.sold ? 'SOLD' : 'READY FOR SALE'}</div>
              {car.statusLevel === 'HOT' && <div className="hot">🔥 HOT</div>}
            </TagsRow>
          </TitleCol>

          <ActionsRow>
            {isEditing ? (
              <>
                <Btn className="whatsapp" onClick={saveChanges} disabled={isSaving}>
                  {isSaving ? "Saving..." : "✅ Save Changes"}
                </Btn>
                <Btn className="call" onClick={() => { setIsEditing(false); setEditData(car); }}>❌ Cancel</Btn>
              </>
            ) : (
              <>
                <Btn className="reserve" style={{ background: '#0f172a' }} onClick={() => setIsEditing(true)}>✍️ Edit Vehicle</Btn>
                <Btn className="call"><Phone fontSize="small"/> Call</Btn>
                <Btn className="whatsapp"><WhatsApp fontSize="small"/> WhatsApp</Btn>
                <Btn className="reserve">Reserve</Btn>
                <Btn className="sold">Mark Sold</Btn>
              </>
            )}
          </ActionsRow>
        </TitleRow>

        <MetricsRow>
          <Metric>
            <label>Asking Price</label>
            {isEditing ? (
              <input style={{ padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100px' }} type="number" value={editData.price} onChange={e => handleInputChange('price', e.target.value)} />
            ) : (
              <div className="val blue">{car.price ? `${car.price.toLocaleString()} JOD` : 'N/A'}</div>
            )}
          </Metric>
          <Metric>
            <label>Floor Price</label>
            <div className="val">{floorPrice ? `${floorPrice.toLocaleString()} JOD` : 'N/A'}</div>
          </Metric>
          <Metric>
            <label>Profit @ Ask</label>
            <div className="val green">{profitAtAsk > 0 ? `+${profitAtAsk.toLocaleString()} JOD` : `${profitAtAsk.toLocaleString()} JOD`}</div>
          </Metric>
          <Metric>
            <label>Days In Stock</label>
            {isEditing ? (
              <input style={{ padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '60px' }} type="number" value={editData.daysInStock} onChange={e => handleInputChange('daysInStock', e.target.value)} />
            ) : (
              <div className="val">{car.daysInStock || 0} Days</div>
            )}
          </Metric>
          <Metric>
            <label>Lead Score</label>
            <div className="val">{car.leadScore || 0}/100</div>
          </Metric>
        </MetricsRow>
      </HeaderStrip>

      {/* 🔴 MAIN GRID */}
      <LayoutGrid>
        
        {/* LEFT COLUMN */}
        <LeftCol>
          <TabRow>
            <Tab active={activeTab === 'management'} onClick={() => setActiveTab('management')}>📝 Asset Management</Tab>
            <Tab active={activeTab === 'intelligence'} onClick={() => setActiveTab('intelligence')}>📈 Market Intelligence</Tab>
            <Tab active={activeTab === 'history'} onClick={() => setActiveTab('history')}>📖 History Log</Tab>
          </TabRow>

          {activeTab === 'management' ? (
            <>
              <GalleryBox>
            <HeroImage src={car.images?.[activeImageIndex] || "https://placehold.co/1200x800/cbd5e1/1e293b?text=No+Image+Available"}>
              <WatermarkToggle><DocumentScanner fontSize="small"/> Watermark: ON</WatermarkToggle>
              
              <label style={{ 
                position: 'absolute', bottom: '12px', right: '12px', 
                background: '#1e3a8a', color: 'white', padding: '8px 16px', 
                borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', 
                fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px',
                opacity: isUploading ? 0.7 : 1
              }}>
                <CloudUpload fontSize="small"/> {isUploading ? "Uploading..." : "Add Photos"}
                <input type="file" multiple hidden onChange={handleFileUpload} disabled={isUploading} />
              </label>
            </HeroImage>
            <ThumbRow>
              {car.images?.map((img, idx) => (
                <Thumb 
                  key={idx} 
                  active={idx === activeImageIndex} 
                  src={img} 
                  onClick={() => setActiveImageIndex(idx)} 
                />
              ))}
              {(!car.images || car.images.length < 4) && Array.from({ length: 4 - (car.images?.length || 0) }).map((_, i) => (
                <Thumb key={`missing-${i}`}>📸 MISSING</Thumb>
              ))}
            </ThumbRow>
          </GalleryBox>

          <TwinPanels>
            <Panel>
              <h3><Info fontSize="small"/> VIN Decoded Data</h3>
              <SpecRow>
                <span className="lbl">Engine</span>
                {isEditing ? (
                  <input style={{ width: '80px', textAlign: 'right' }} type="text" value={editData.engineSize} onChange={e => handleInputChange('engineSize', e.target.value)} />
                ) : (
                  <span className="val">{car.engineSize ? `${car.engineSize}L` : 'N/A'}</span>
                )}
              </SpecRow>
              <SpecRow>
                <span className="lbl">Drive Type</span>
                {isEditing ? (
                  <input style={{ width: '120px', textAlign: 'right' }} type="text" value={editData.transmission} onChange={e => handleInputChange('transmission', e.target.value)} />
                ) : (
                  <span className="val">{car.transmission || 'N/A'}</span>
                )}
              </SpecRow>
              <SpecRow>
                <span className="lbl">Mileage</span>
                {isEditing ? (
                  <input style={{ width: '80px', textAlign: 'right' }} type="number" value={editData.mileage} onChange={e => handleInputChange('mileage', e.target.value)} />
                ) : (
                  <span className="val">{car.mileage ? `${car.mileage} km` : 'N/A'}</span>
                )}
              </SpecRow>
              <SpecRow>
                <span className="lbl">Fuel Type</span>
                {isEditing ? (
                  <select style={{ padding: '2px' }} value={editData.fuel} onChange={e => handleInputChange('fuel', e.target.value)}>
                    <option value="Benzine">Benzine</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Mild Hybrid">Mild Hybrid</option>
                  </select>
                ) : (
                  <span className="val">{car.fuel || 'N/A'}</span>
                )}
              </SpecRow>
            </Panel>
            <Panel>
              <h3><AutoAwesome fontSize="small"/> Health & History</h3>
              <HealthWidget>
                <div className="icon"><Bolt /></div>
                <div className="info">
                  <span className="lbl">Battery Health</span>
                  <span className="val">{car.batteryHealth ? `${car.batteryHealth}%` : 'N/A'}</span>
                </div>
              </HealthWidget>
              <HealthWidget style={{ background: car.carSeerHistory?.clean ? '#dcfce7' : '#fef2f2' }}>
                <div className="icon" style={{ background: car.carSeerHistory?.clean ? '#bbf7d0' : '#fecaca', color: car.carSeerHistory?.clean ? '#166534' : '#991b1b' }}><DocumentScanner /></div>
                <div className="info">
                  <span className="lbl">CarSeer History</span>
                  <span className="val" style={{color: car.carSeerHistory?.clean ? '#166534' : '#991b1b'}}>{car.carSeerHistory?.clean ? 'CLEAN REPORT' : (car.carSeerHistory?.primaryDamage || 'PENDING / UNKNOWN')}</span>
                </div>
              </HealthWidget>
            </Panel>
          </TwinPanels>

          <SyndicationWidget>
            <h3><CloudUpload fontSize="small"/> Multi-Channel Headless Poster</h3>
            <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: 16}}>
              Authenticate to physically launch the Puppeteer Agent. It will download the car's S3 images directly to the bot's memory and automatically push the listing.
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <InputGroup>
                  <label>Facebook Email</label>
                  <input type="text" value={fbEmail} onChange={e => setFbEmail(e.target.value)} placeholder="FB Email/Phone" />
                </InputGroup>
                <InputGroup>
                  <label>Facebook Password</label>
                  <input type="password" value={fbPassword} onChange={e => setFbPassword(e.target.value)} placeholder="FB Password" />
                </InputGroup>
              </div>
              <div style={{ flex: 1 }}>
                <InputGroup>
                  <label>OpenSooq Email</label>
                  <input type="text" value={osEmail} onChange={e => setOsEmail(e.target.value)} placeholder="OS Email/Phone" />
                </InputGroup>
                <InputGroup>
                  <label>OpenSooq Password</label>
                  <input type="password" value={osPassword} onChange={e => setOsPassword(e.target.value)} placeholder="OS Password" />
                </InputGroup>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <ActionButton 
                onClick={() => triggerSyndicate('facebook')} 
                disabled={syndicatePlatform !== null}
                style={{ 
                  background: syndicatePlatform === 'facebook' ? '#93c5fd' : '#1877F2', 
                  flex: 1, 
                  minWidth: '140px',
                  opacity: syndicatePlatform !== null ? 0.7 : 1,
                  cursor: syndicatePlatform !== null ? 'wait' : 'pointer'
                }}
              >
                {syndicatePlatform === 'facebook' ? '⏳' : '📘'} Post to Facebook
              </ActionButton>
              <ActionButton 
                onClick={() => triggerSyndicate('opensooq')} 
                disabled={syndicatePlatform !== null}
                style={{ 
                  background: syndicatePlatform === 'opensooq' ? '#86efac' : '#16a34a', 
                  flex: 1, 
                  minWidth: '140px',
                  opacity: syndicatePlatform !== null ? 0.7 : 1,
                  cursor: syndicatePlatform !== null ? 'wait' : 'pointer'
                }}
              >
                {syndicatePlatform === 'opensooq' ? '⏳' : '🟢'} Post to OpenSooq
              </ActionButton>
              <ActionButton 
                onClick={() => triggerSyndicate('both')} 
                disabled={syndicatePlatform !== null}
                style={{ 
                  background: syndicatePlatform === 'both' ? '#c4b5fd' : '#7c3aed', 
                  flex: '1 0 100%',
                  opacity: syndicatePlatform !== null ? 0.7 : 1,
                  cursor: syndicatePlatform !== null ? 'wait' : 'pointer'
                }}
              >
                {syndicatePlatform === 'both' ? '⏳' : <Send fontSize="small"/>} Post to Both Platforms
              </ActionButton>
            </div>
            {(syndicateState) && (
              <ResultBox>
                {syndicateState}
              </ResultBox>
            )}
          </SyndicationWidget>

          <TimelineBox>
            <h3>Activity Timeline</h3>
            <TimeItem>
              <div className="dot" style={{ background: '#dbeafe', color: '#1e3a8a' }}><AutoAwesome fontSize="small"/></div>
              <div className="content">
                <div className="title">Listing Updated</div>
                <div className="meta">{formattedUpdatedAt} • System</div>
              </div>
            </TimeItem>
            {car.daysInStock > 30 && (
              <TimeItem>
                <div className="dot" style={{ background: '#fee2e2', color: '#ef4444' }}><Bolt fontSize="small"/></div>
                <div className="content">
                  <div className="title">High Days In Stock Alert</div>
                  <div className="meta">Asset has been in inventory for {car.daysInStock} days.</div>
                </div>
              </TimeItem>
            )}
            <TimeItem>
              <div className="dot"><Inventory fontSize="small"/></div>
              <div className="content">
                <div className="title">Car added to Active Inventory</div>
                <div className="meta">{formattedCreatedAt} • By Admin</div>
              </div>
            </TimeItem>
          </TimelineBox>
            </>
          ) : activeTab === 'intelligence' ? (
            <MarketIntelligencePanel car={car} />
          ) : (
            <div style={{ background: 'white', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>System Audit Log</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  Automated Tracker
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {history.length === 0 ? (
                  <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '32px' }}>
                    No system events logged for this asset yet.
                  </div>
                ) : (
                  history.map((activity, idx) => (
                    <div key={activity._id || idx} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                      {/* Timeline Line */}
                      {idx !== history.length - 1 && (
                        <div style={{ position: 'absolute', left: '15px', top: '32px', bottom: '-16px', width: '2px', background: '#e2e8f0' }} />
                      )}
                      
                      {/* Icon */}
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1e3a8a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, fontSize: '1rem' }}>
                        ⚡
                      </div>

                      {/* Content Card */}
                      <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <strong style={{ color: '#0f172a', textTransform: 'capitalize' }}>
                            {activity.type.replace('_', ' ')}
                          </strong>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {new Date(activity.createdAt).toLocaleString()}
                          </span>
                        </div>

                        {activity.metadata?.changes && activity.metadata.changes.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {activity.metadata.changes.map((change, i) => (
                              <div key={i} style={{ fontSize: '0.9rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                <strong style={{ color: '#0f172a', width: '120px' }}>{change.field}</strong>
                                <span style={{ color: '#ef4444', textDecoration: 'line-through' }}>{String(change.old || 'None')}</span>
                                <span style={{ color: '#64748b' }}>→</span>
                                <span style={{ color: '#10b981', fontWeight: 700 }}>{String(change.new || 'None')}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ color: '#334155', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                            {activity.metadata?.text || JSON.stringify(activity.metadata)}
                          </div>
                        )}
                        
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </LeftCol>

        {/* RIGHT COLUMN */}
        <RightCol>
          <LiveViewersWidget />
          <AICard>
            <h3><AutoAwesome fontSize="small"/> AI Copilot Strategy</h3>
            <p>Asset <strong>#{car._id.slice(-6).toUpperCase()}</strong> has a lead score of <strong>{car.leadScore || 0}</strong>. {car.leadScore > 50 ? 'Strong engagement detected.' : 'Low engagement so far.'}</p>
            <div className="rec">
              {car.leadScore > 50 ? '"Reach out to recent leads and emphasize the low Landed Cost margin to close the deal fast."' : '"Consider generating a TikTok video or dropping the price slightly to trigger the Fav-List alerts."'}
            </div>
            <button onClick={fetchAndShowHeatmap} disabled={isHeatmapLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: isHeatmapLoading ? 0.7 : 1 }}>
              <AutoAwesome fontSize="small"/> {isHeatmapLoading ? "Generating Thermal Map..." : "View Engagement Heatmap"}
            </button>
          </AICard>

          <QualifiedLeads carId={id} carSummaryText={`${car.year || ''} ${car.carMake || ''} ${car.model || ''} (Stock #${car._id?.slice(-6).toUpperCase()})`} />

          <NegCard>
            <h3>Negotiation Helper</h3>
            <NegRow>
              <span className="lbl">Landed Cost</span>
              {isEditing ? (
                <input style={{ width: '100px', textAlign: 'right' }} type="number" value={editData.totalLandedCost} onChange={e => handleInputChange('totalLandedCost', e.target.value)} />
              ) : (
                <span className="val">{totalLandedCost.toLocaleString()} JOD</span>
              )}
            </NegRow>
            <NegRow><span className="lbl">Current ROI Estimate</span><span className="val">{roiEstimate.toFixed(1)}%</span></NegRow>
            <div style={{ background: 'white', padding: 12, borderRadius: 8, marginTop: 16, display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, background: '#f1f5f9', padding: 8, borderRadius: 6, fontWeight: 700 }}>Floor: {floorPrice.toLocaleString()} JOD</div>
              <div style={{ flex: 1, background: '#bbf7d0', color: '#166534', padding: 8, borderRadius: 6, fontWeight: 700, textAlign: 'center' }}>
                Spread: {(car.price - floorPrice).toLocaleString()} JOD
              </div>
            </div>
          </NegCard>

          <DocCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}><FileDownload fontSize="small"/> Documents & Paperwork</h3>
              <label style={{ 
                background: '#f1f5f9', color: '#0f172a', padding: '6px 12px', 
                borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, 
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                {isDocUploading ? "Uploading..." : "Upload New"}
                <input type="file" hidden onChange={handleDocUpload} disabled={isDocUploading} />
              </label>
            </div>
            
            {(car.files && car.files.length > 0) ? car.files.map((file, idx) => (
              <DocRow key={idx}>
                <div className="info">
                  <div className="name" onClick={() => window.open(file.url)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{file.name}</div>
                  <div className="meta">{file.fileType?.toUpperCase() || 'DOCUMENT'} • {new Date(file.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="icon" onClick={() => deleteDoc(file._id)} style={{ color: '#ef4444' }}>🗑️</div>
              </DocRow>
            )) : (
              <div style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '20px 0' }}>
                No official documents attached to this asset.
              </div>
            )}
          </DocCard>

        </RightCol>

        {isEditing && (
          <AdvancedPanel>
            <h3><Bolt fontSize="small"/> Advanced Configuration (Full Schema)</h3>
            
            <SectionTitle>Mogul Sabermetrics (Cost Breakdown)</SectionTitle>
            <FieldGrid>
              <EditGroup><label>Purchase Price</label><input type="number" value={editData.purchasePrice} onChange={e => handleInputChange('purchasePrice', e.target.value)} /></EditGroup>
              <EditGroup><label>Shipping Cost</label><input type="number" value={editData.shippingCost} onChange={e => handleInputChange('shippingCost', e.target.value)} /></EditGroup>
              <EditGroup><label>Customs Duty</label><input type="number" value={editData.customsDuty} onChange={e => handleInputChange('customsDuty', e.target.value)} /></EditGroup>
              <EditGroup><label>Repair Cost</label><input type="number" value={editData.repairCost} onChange={e => handleInputChange('repairCost', e.target.value)} /></EditGroup>
              <EditGroup><label>Inspection Cost</label><input type="number" value={editData.inspectionCost} onChange={e => handleInputChange('inspectionCost', e.target.value)} /></EditGroup>
              <EditGroup><label>Storage Cost</label><input type="number" value={editData.storageCost} onChange={e => handleInputChange('storageCost', e.target.value)} /></EditGroup>
              <EditGroup><label>Marketing Cost</label><input type="number" value={editData.marketingCost} onChange={e => handleInputChange('marketingCost', e.target.value)} /></EditGroup>
            </FieldGrid>

            <SectionTitle>Logistics & Legal</SectionTitle>
            <FieldGrid>
              <EditGroup>
                <label>Customs Status</label>
                <select value={editData.customsStatus} onChange={e => handleInputChange('customsStatus', e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Missing Docs">Missing Docs</option>
                </select>
              </EditGroup>
              <EditGroup>
                <label>Repair Stage</label>
                <select value={editData.repairStage} onChange={e => handleInputChange('repairStage', e.target.value)}>
                  <option value="None">None</option>
                  <option value="Paint">Paint</option>
                  <option value="Mechanic">Mechanic</option>
                  <option value="Detailing">Detailing</option>
                  <option value="Ready">Ready</option>
                </select>
              </EditGroup>
              <EditGroup><label>Auction Name</label><input type="text" value={editData.auctionName} onChange={e => handleInputChange('auctionName', e.target.value)} /></EditGroup>
              <EditGroup><label>Lot Number</label><input type="text" value={editData.lotNumber} onChange={e => handleInputChange('lotNumber', e.target.value)} /></EditGroup>
              <EditGroup><label>Arrival Port</label><input type="text" value={editData.arrivalPort} onChange={e => handleInputChange('arrivalPort', e.target.value)} /></EditGroup>
              <EditGroup><label>Number of Keys</label><input type="number" value={editData.numberOfKeys} onChange={e => handleInputChange('numberOfKeys', e.target.value)} /></EditGroup>
            </FieldGrid>

            <SectionTitle>EV Intelligence</SectionTitle>
            <FieldGrid>
              <EditGroup><label>Battery Size (kWh)</label><input type="text" value={editData.batterySize} onChange={e => handleInputChange('batterySize', e.target.value)} /></EditGroup>
              <EditGroup><label>Estimated Range (km)</label><input type="text" value={editData.estimatedRange} onChange={e => handleInputChange('estimatedRange', e.target.value)} /></EditGroup>
              <EditGroup>
                <label>Charger Included</label>
                <select value={editData.chargerIncluded} onChange={e => handleInputChange('chargerIncluded', e.target.value === 'true')}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </EditGroup>
              <EditGroup><label>Battery Health (%)</label><input type="number" value={editData.batteryHealth} onChange={e => handleInputChange('batteryHealth', e.target.value)} /></EditGroup>
            </FieldGrid>

            <SectionTitle>Marketing & Status</SectionTitle>
            <FieldGrid>
              <EditGroup>
                <label>Status Level</label>
                <select value={editData.statusLevel} onChange={e => handleInputChange('statusLevel', e.target.value)}>
                  <option value="COLD">COLD</option>
                  <option value="WARM">WARM</option>
                  <option value="HOT">HOT</option>
                  <option value="HOLD">HOLD</option>
                </select>
              </EditGroup>
              <EditGroup>
                <label>Featured</label>
                <select value={editData.Featured} onChange={e => handleInputChange('Featured', e.target.value === 'true')}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </EditGroup>
              <EditGroup>
                <label>New Arrival</label>
                <select value={editData.NewArrival} onChange={e => handleInputChange('NewArrival', e.target.value === 'true')}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </EditGroup>
              <EditGroup>
                <label>Special Deal</label>
                <select value={editData.SpecialDeal} onChange={e => handleInputChange('SpecialDeal', e.target.value === 'true')}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </EditGroup>
            </FieldGrid>
          </AdvancedPanel>
        )}

      </LayoutGrid>

      {/* 📱 REMOTE SCAN MODAL */}
      {scanSessionId && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 9999, padding: 20 
        }}>
          <div style={{ background: 'white', padding: 32, borderRadius: 20, maxWidth: 400, textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
            <h2 style={{ margin: '0 0 16px 0' }}>Scan with Mobile</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: 24 }}>
              Scan this QR code with your phone camera to launch the remote scanner. 
              The VIN will auto-populate here once detected.
            </p>
            
            <div style={{ background: '#f1f5f9', padding: 20, borderRadius: 12, marginBottom: 24 }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent((process.env.NEXT_PUBLIC_ADMIN_URL || window.location.origin) + '/scan/' + scanSessionId)}`} 
                alt="Scan QR" 
                style={{ width: 200, height: 200 }}
              />
            </div>

            <div style={{ fontWeight: 700, color: '#1e3a8a', marginBottom: 24 }}>
              SESSION ID: {scanSessionId}
            </div>

            <button 
              onClick={() => { setScanSessionId(null); setIsPolling(false); }}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel Scan
            </button>
          </div>
        </div>
      )}

      {/* 🌡️ HEATMAP MODAL */}
      {heatmapVisible && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(15,23,42,0.95)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 9999, padding: 40 
        }}>
          <div style={{ background: '#1e293b', padding: 20, borderRadius: 16, width: '100%', maxWidth: '1000px', height: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ color: 'white' }}>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><AutoAwesome style={{color: '#f59e0b'}}/> Thermal Engagement Map</h2>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Visualizing real customer interaction data on public listing</span>
              </div>
              <button 
                onClick={closeHeatmap}
                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Close Heatmap
              </button>
            </div>
            
            <div style={{ flex: 1, overflow: 'auto', background: '#000', borderRadius: '8px', position: 'relative' }}>
              {screenshotData ? (
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: 'max-content'
                }}>
                  <img 
                    src={screenshotData} 
                    alt="Listing Screenshot" 
                    onLoad={handleHeatmapImageLoad}
                    style={{ width: '100%', display: 'block', opacity: 0.8 }} 
                  />
                  <div 
                    ref={heatmapContainer}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0,
                      width: '100%', height: '100%',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                  Loading thermal visual...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </PageContainer>
  );
}
