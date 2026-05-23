"use client";

import React, { useState, useCallback } from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Gavel,
  Shield,
  People,
  Campaign,
  Search,
  Warning,
  CheckCircle,
  Info,
  BatteryAlert,
  LocalShipping,
  AccountBalance,
  Verified,
  FilterList,
  Send,
  Visibility,
  Timer,
  Star,
  Block,
  QrCodeScanner,
} from "@mui/icons-material";
import VINScanner from "../scanner/VINScanner";

// ════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ════════════════════════════════════════════════════════════════════════
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.15); }
  50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.3); }
`;

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scanLine = keyframes`
  0% { top: 0; }
  100% { top: 100%; }
`;

const typeWriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  50% { border-color: transparent; }
`;

// ════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ════════════════════════════════════════════════════════════════════════
const PageContainer = styled.div`
  padding: 24px 32px;
  background: linear-gradient(135deg, #0a0e1a 0%, #0d1321 50%, #0a0e1a 100%);
  min-height: 100vh;
  color: #e2e8f0;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
`;

const TerminalHeader = styled.div`
  margin-bottom: 32px;
  position: relative;
`;

const SystemTitle = styled.h1`
  font-size: 1.1rem;
  font-weight: 400;
  color: #64748b;
  letter-spacing: 6px;
  text-transform: uppercase;
  margin: 0 0 4px 0;
`;

const MainTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #22c55e 0%, #10b981 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #475569;
  font-size: 0.95rem;
  margin: 0;
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => (p.$active ? "#22c55e" : "#475569")};
  box-shadow: ${(p) =>
    p.$active ? "0 0 8px rgba(34, 197, 94, 0.6)" : "none"};
`;

const StatusText = styled.span`
  font-size: 0.8rem;
  color: ${(p) => (p.$active ? "#22c55e" : "#64748b")};
  font-family: "JetBrains Mono", monospace;
  letter-spacing: 1px;
`;

// ── Input Section ──────────────────────────────────────────────────────
const InputSection = styled.div`
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 28px;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(34, 197, 94, 0.5),
      transparent
    );
  }
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 120px auto;
  gap: 16px;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.75rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 600;
  }
`;

const StyledInput = styled.input`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: #e2e8f0;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s;
  outline: none;

  &:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }

  &::placeholder {
    color: #475569;
  }
`;

const ExecuteButton = styled.button`
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  letter-spacing: 0.5px;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// ── Results Grid ───────────────────────────────────────────────────────
const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  animation: ${fadeSlideIn} 0.6s ease-out;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.15);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  transition: border-color 0.3s;
  animation: ${fadeSlideIn} 0.6s ease-out;
  animation-delay: ${(p) => p.$delay || "0s"};
  animation-fill-mode: both;

  &:hover {
    border-color: ${(p) => p.$accent || "rgba(34, 197, 94, 0.3)"};
  }
`;

const PanelHeader = styled.div`
  padding: 20px 24px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(100, 116, 139, 0.1);

  svg {
    color: ${(p) => p.$accent || "#22c55e"};
    font-size: 1.4rem;
  }
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${(p) => p.$accent || "#22c55e"};
  font-weight: 700;
`;

const PanelBody = styled.div`
  padding: 20px 24px 24px;
`;

// ── Data Row ───────────────────────────────────────────────────────────
const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(100, 116, 139, 0.08);

  &:last-child {
    border-bottom: none;
  }
`;

const DataLabel = styled.span`
  font-size: 0.85rem;
  color: #94a3b8;
`;

const DataValue = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${(p) => p.$color || "#e2e8f0"};
  font-family: "JetBrains Mono", "Fira Code", monospace;
`;

// ── Alert Banners ──────────────────────────────────────────────────────
const AlertBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  margin: 12px 0;
  font-size: 0.85rem;
  line-height: 1.5;
  background: ${(p) =>
    p.$type === "danger"
      ? "rgba(239, 68, 68, 0.08)"
      : p.$type === "warning"
      ? "rgba(245, 158, 11, 0.08)"
      : p.$type === "success"
      ? "rgba(34, 197, 94, 0.08)"
      : "rgba(59, 130, 246, 0.08)"};
  border: 1px solid
    ${(p) =>
      p.$type === "danger"
        ? "rgba(239, 68, 68, 0.2)"
        : p.$type === "warning"
        ? "rgba(245, 158, 11, 0.2)"
        : p.$type === "success"
        ? "rgba(34, 197, 94, 0.2)"
        : "rgba(59, 130, 246, 0.2)"};
  color: ${(p) =>
    p.$type === "danger"
      ? "#fca5a5"
      : p.$type === "warning"
      ? "#fcd34d"
      : p.$type === "success"
      ? "#86efac"
      : "#93c5fd"};

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    font-size: 1.1rem;
  }
`;

// ── Price Range Bar ────────────────────────────────────────────────────
const PriceBar = styled.div`
  margin: 16px 0;
`;

const PriceBarTrack = styled.div`
  height: 8px;
  background: rgba(100, 116, 139, 0.15);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

const PriceBarFill = styled.div`
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, #22c55e, #06b6d4);
  width: ${(p) => p.$width || "60%"};
  transition: width 1s ease-out;
`;

const PriceLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 0.75rem;
  color: #64748b;
`;

// ── Lead Card ──────────────────────────────────────────────────────────
const LeadCard = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(100, 116, 139, 0.12);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(34, 197, 94, 0.25);
    background: rgba(15, 23, 42, 0.6);
  }
`;

const LeadAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(p) => p.$bg || "linear-gradient(135deg, #3b82f6, #6366f1)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: white;
  flex-shrink: 0;
`;

const LeadInfo = styled.div`
  flex: 1;

  .name {
    font-weight: 600;
    font-size: 0.9rem;
    color: #e2e8f0;
  }
  .metric {
    font-size: 0.78rem;
    color: #64748b;
    margin-top: 2px;
  }
`;

const LeadScore = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-weight: 700;
  font-size: 0.9rem;
  color: ${(p) =>
    p.$score >= 80 ? "#22c55e" : p.$score >= 50 ? "#f59e0b" : "#ef4444"};
`;

// ── Syndication Button ─────────────────────────────────────────────────
const SyndicateButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: 2px solid
    ${(p) => (p.$active ? "#22c55e" : "rgba(100, 116, 139, 0.2)")};
  background: ${(p) =>
    p.$active
      ? "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(6, 182, 212, 0.1))"
      : "rgba(15, 23, 42, 0.4)"};
  color: ${(p) => (p.$active ? "#22c55e" : "#64748b")};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;

  &:hover {
    border-color: #22c55e;
    color: #22c55e;
    background: rgba(34, 197, 94, 0.05);
  }
`;

const ReviewPublishButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  letter-spacing: 1px;
  margin-top: 16px;
  transition: all 0.3s;
  animation: ${pulseGlow} 3s infinite;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(34, 197, 94, 0.35);
  }
`;

// ── Loading Skeleton ───────────────────────────────────────────────────
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 80px 0;
`;

const LoadingText = styled.div`
  font-family: "JetBrains Mono", monospace;
  color: #22c55e;
  font-size: 0.9rem;
  margin-top: 20px;
  letter-spacing: 2px;
`;

const ProgressTrack = styled.div`
  width: 300px;
  height: 4px;
  background: rgba(100, 116, 139, 0.15);
  border-radius: 2px;
  margin: 16px auto 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #06b6d4);
  border-radius: 2px;
  width: ${(p) => p.$progress || "0%"};
  transition: width 0.5s ease-out;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: ${(p) => p.$bg || "rgba(34,197,94,0.1)"};
  color: ${(p) => p.$color || "#22c55e"};
  border: 1px solid ${(p) => p.$border || "rgba(34,197,94,0.2)"};
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(100, 116, 139, 0.12);
  margin: 16px 0;
`;

// ════════════════════════════════════════════════════════════════════════
// RISK INTELLIGENCE (Pure client-side auditing logic)
// ════════════════════════════════════════════════════════════════════════
function generateRiskAudit(make, model, year) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const risks = [];

  // EV Battery Risk
  const evMakes = ["tesla", "nissan", "bmw", "chevrolet", "hyundai", "kia", "rivian", "lucid", "polestar", "byd"];
  const evModels = ["model s", "model 3", "model x", "model y", "leaf", "i3", "i4", "ix", "bolt", "ioniq", "ev6", "niro ev"];
  const isEV =
    evMakes.includes(make.toLowerCase()) &&
    evModels.some((m) => model.toLowerCase().includes(m.replace("model ", "")));

  if (isEV && age > 5) {
    const degradation = Math.min(age * 2.3, 30);
    risks.push({
      type: "danger",
      icon: <BatteryAlert />,
      title: "Battery Degradation Risk",
      message: `This ${year} ${make} ${model} is ${age} years old. Estimated pack degradation: ~${degradation.toFixed(1)}%. DO NOT acquire or value this trade-in without a certified OBD2 State of Health (SOH) diagnostic. Recommended acquisition price adjustment: -${Math.round(degradation * 0.8)}%.`,
    });
  } else if (isEV) {
    risks.push({
      type: "info",
      icon: <CheckCircle />,
      title: "EV Battery Status",
      message: `Battery within expected lifecycle parameters (${age} years). Standard SOH verification recommended during PDI.`,
    });
  }

  // High mileage risk for older vehicles
  if (age > 10) {
    risks.push({
      type: "warning",
      icon: <Warning />,
      title: "Lifecycle Depreciation Flag",
      message: `Asset is ${age} years old. Verify structural integrity, suspension wear, and timing chain/belt status. Mandate mechanical inspection before committing acquisition capital.`,
    });
  }

  // Luxury maintenance risk
  const luxMakes = ["mercedes", "bmw", "audi", "porsche", "land rover", "jaguar", "maserati", "bentley"];
  if (luxMakes.some((l) => make.toLowerCase().includes(l)) && age > 5) {
    risks.push({
      type: "warning",
      icon: <Info />,
      title: "Premium Maintenance Overhead",
      message: `European luxury vehicles >5 years carry elevated maintenance costs (avg 2.1x market rate). Factor OEM parts availability and specialist labor into margin calculations.`,
    });
  }

  return { risks, isEV };
}

// ── Regulatory Intelligence ───────────────────────────────────────────
function generateRegulatory(make, model, year, isEV) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  const items = [];

  // Warranty restrictions
  if (age > 7) {
    items.push({
      type: "danger",
      icon: <Block />,
      label: "Warranty Generation",
      status: "RESTRICTED",
      detail: `Jordan MoITC mandate requires OEM backing for warranty issuance. ${year} chassis exceeds compliance window. Do NOT issue extended warranty certificates.`,
    });
  } else if (isEV && age > 3) {
    items.push({
      type: "warning",
      icon: <Shield />,
      label: "Warranty Generation",
      status: "CONDITIONAL",
      detail: `EV warranty conditional on SOH diagnostic ≥80%. Battery must pass independent verification before warranty commitments.`,
    });
  } else {
    items.push({
      type: "success",
      icon: <Verified />,
      label: "Warranty Generation",
      status: "AUTHORIZED",
      detail: `Standard 3-year/50,000 km dealership warranty compliant for ${year} ${make} chassis.`,
    });
  }

  // VAT & Transfer
  const estimatedVAT = 0.16; // Jordan 16% GST
  items.push({
    type: "info",
    icon: <AccountBalance />,
    label: "Tax Protocol",
    status: "STAGED",
    detail: `VAT (16% GST) + Transfer Fee (~1.5% assessed value) auto-calculated and staged for digital invoicing. Registration renewal fee: ~55 JOD.`,
  });

  // Import restrictions
  if (age > 5) {
    items.push({
      type: "warning",
      icon: <LocalShipping />,
      label: "Import Compliance",
      status: "FLAGGED",
      detail: `Vehicles >5 years may face elevated customs tariffs (25-40% CIF) and environmental surcharges under Jordan Customs directive.`,
    });
  }

  return items;
}

// ── Mock Lead Data ─────────────────────────────────────────────────────
function generateLeads(make, model) {
  const leadPool = [
    { name: "Ahmad K.", initials: "AK", bg: "linear-gradient(135deg, #3b82f6, #6366f1)", score: 92, metric: `Viewed ${make} ${model} specs for 4m 12s • 3 return visits` },
    { name: "Sara M.", initials: "SM", bg: "linear-gradient(135deg, #ec4899, #f43f5e)", score: 87, metric: `Saved 2 similar listings • Submitted price inquiry 6h ago` },
    { name: "Omar T.", initials: "OT", bg: "linear-gradient(135deg, #f59e0b, #ef4444)", score: 74, metric: `Viewed premium sedans 8 times this week • Active financing lead` },
    { name: "Lina R.", initials: "LR", bg: "linear-gradient(135deg, #06b6d4, #3b82f6)", score: 68, metric: `Cross-referenced with 3 competitor listings • Budget: 15-25K JOD` },
    { name: "Khaled D.", initials: "KD", bg: "linear-gradient(135deg, #8b5cf6, #a855f7)", score: 45, metric: `General browser • Low engagement metrics • No direct inquiries` },
  ];

  const quarantined = [
    { name: "Yousef B.", reason: "Proposed 2008 Hyundai Accent barter (est. value: 2,800 JOD). Asymmetric offer quarantined." },
    { name: "Nadia S.", reason: "Multiple low-ball offers across 5 listings in 24h. Pattern flagged as non-serious buyer." },
  ];

  return { leads: leadPool, quarantined };
}

// ════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════
export default function DOSTerminal() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Syndication state
  const [channels, setChannels] = useState({
    facebook: true,
    opensooq: true,
  });

  const [showForensics, setShowForensics] = useState(false);
  const [forensicData, setForensicData] = useState(null);

  const toggleChannel = (ch) =>
    setChannels((prev) => ({ ...prev, [ch]: !prev[ch] }));

  const executeQuery = useCallback(async () => {
    if (!make || !model || !year) return;

    setLoading(true);
    setError(null);
    setResults(null);
    setProgress(0);

    try {
      // Phase 1: Discovery
      setLoadingPhase("NODE ALPHA — Scanning marketplace endpoints...");
      setProgress(15);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
      const res = await fetch(`${apiUrl}/api/market-intelligence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          make,
          model,
          year: parseInt(year, 10),
          scrapeMode: "antigravity",
          sites: "dooz,opensooq",
        }),
      });

      setLoadingPhase("NODE BETA — Deep extraction in progress...");
      setProgress(60);

      if (!res.ok) {
        throw new Error(`Engine returned HTTP ${res.status}`);
      }

      const data = await res.json();

      setLoadingPhase("Computing risk audit & regulatory index...");
      setProgress(85);

      // Generate client-side intelligence
      const yearNum = parseInt(year, 10);
      const { risks, isEV } = generateRiskAudit(make, model, yearNum);
      const regulatory = generateRegulatory(make, model, yearNum, isEV);
      const { leads, quarantined } = generateLeads(make, model);

      setProgress(100);
      setLoadingPhase("COMPLETE");

      // Small delay for visual polish
      await new Promise((r) => setTimeout(r, 400));

      // Merge annotated listings from stats into the listings array
      // so Market Evidence panel shows price context badges
      const enrichedListings = data.stats?.annotatedListings || data.listings || [];

      setResults({
        market: {
          ...data,
          listings: enrichedListings,
        },
        risks,
        isEV,
        regulatory,
        leads,
        quarantined,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [make, model, year]);

  return (
    <PageContainer>
      {/* ── Terminal Header ──────────────────────────────────────────── */}
      <TerminalHeader>
        <SystemTitle>Dealership Operating System</SystemTitle>
        <MainTitle>Market Intelligence Terminal</MainTitle>
        <Subtitle>
          Real-time asset valuation, regulatory compliance, lead orchestration &
          multi-channel syndication
        </Subtitle>
        <StatusBar>
          <StatusDot $active={!loading} />
          <StatusText $active={!loading}>
            {loading ? "ENGINE ACTIVE" : "SYSTEM READY"}
          </StatusText>
          <span style={{ color: "#334155" }}>|</span>
          <StatusText>ANTIGRAVITY v2.0 — MSRP ANCHORED</StatusText>
          <span style={{ color: "#334155" }}>|</span>
          <StatusText>
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </StatusText>
          <div style={{ flex: 1 }} />
          <button 
            onClick={() => setShowForensics(true)}
            style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              border: '1px solid rgba(59, 130, 246, 0.4)', 
              color: '#3b82f6', 
              borderRadius: 6, 
              padding: '4px 12px', 
              fontSize: '0.7rem', 
              fontWeight: 800, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <QrCodeScanner sx={{ fontSize: 14 }} />
            INGEST VIN FOR FORENSIC AUDIT
          </button>
        </StatusBar>
      </TerminalHeader>

      {/* ── Query Input ─────────────────────────────────────────────── */}
      <InputSection>
        <InputGrid>
          <FieldGroup>
            <label>Make</label>
            <StyledInput
              id="dos-input-make"
              placeholder="Toyota, BMW, Tesla..."
              value={make}
              onChange={(e) => setMake(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && executeQuery()}
            />
          </FieldGroup>
          <FieldGroup>
            <label>Model</label>
            <StyledInput
              id="dos-input-model"
              placeholder="Camry, X5, Model S..."
              value={model}
              onChange={(e) => setModel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && executeQuery()}
            />
          </FieldGroup>
          <FieldGroup>
            <label>Year</label>
            <StyledInput
              id="dos-input-year"
              type="number"
              placeholder="2022"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && executeQuery()}
            />
          </FieldGroup>
          <ExecuteButton
            id="dos-execute-btn"
            onClick={executeQuery}
            disabled={loading || !make || !model || !year}
          >
            <Search fontSize="small" />
            {loading ? "SCANNING..." : "EXECUTE"}
          </ExecuteButton>
        </InputGrid>
      </InputSection>

      {/* ── Loading State ───────────────────────────────────────────── */}
      {loading && (
        <LoadingContainer>
          <LoadingText>{loadingPhase}</LoadingText>
          <ProgressTrack>
            <ProgressFill $progress={`${progress}%`} />
          </ProgressTrack>
          <p style={{ color: "#475569", fontSize: "0.8rem", marginTop: 12 }}>
            Stealth browser navigating marketplace endpoints...
          </p>
        </LoadingContainer>
      )}

      {/* ── Error State ─────────────────────────────────────────────── */}
      {error && (
        <AlertBanner $type="danger">
          <Warning />
          <div>
            <strong>Engine Error:</strong> {error}
          </div>
        </AlertBanner>
      )}

      {/* ── Results Dashboard ───────────────────────────────────────── */}
      {results && (
        <ResultsGrid>
          {/* ═══════════════════════════════════════════════════════════
               PANEL 1: ASSET VALUATION MATRIX
             ═══════════════════════════════════════════════════════════ */}
          <Panel $accent="rgba(34, 197, 94, 0.3)" $delay="0s">
            <PanelHeader $accent="#22c55e">
              <TrendingUp />
              <PanelTitle $accent="#22c55e">
                Asset Valuation Matrix
              </PanelTitle>
            </PanelHeader>
            <PanelBody>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  marginBottom: 16,
                  letterSpacing: 1,
                }}
              >
                FINANCIAL LEDGER — {year} {make.toUpperCase()} {model.toUpperCase()}
              </div>

              {/* Price Stats */}
              {results.market.stats?.median ? (
                <>
                  <DataRow>
                    <DataLabel>Median Market Value</DataLabel>
                    <DataValue $color="#22c55e">
                      {results.market.stats.median?.toLocaleString()} JOD
                    </DataValue>
                  </DataRow>
                  <DataRow>
                    <DataLabel>Floor Price</DataLabel>
                    <DataValue>
                      {results.market.stats.min?.toLocaleString()} JOD
                    </DataValue>
                  </DataRow>
                  <DataRow>
                    <DataLabel>Ceiling Price</DataLabel>
                    <DataValue>
                      {results.market.stats.max?.toLocaleString()} JOD
                    </DataValue>
                  </DataRow>
                  <DataRow>
                    <DataLabel>Average</DataLabel>
                    <DataValue>
                      {results.market.average?.toLocaleString() ||
                        results.market.stats.average?.toLocaleString()}{" "}
                      JOD
                    </DataValue>
                  </DataRow>
                  <DataRow>
                    <DataLabel>Sample Size</DataLabel>
                    <DataValue $color="#06b6d4">
                      {results.market.stats.samples || results.market.samples} listings
                    </DataValue>
                  </DataRow>

                  {/* Price Range Visual */}
                  <PriceBar>
                    <PriceBarTrack>
                      <PriceBarFill $width="100%" />
                    </PriceBarTrack>
                    <PriceLabels>
                      <span>
                        {results.market.stats.min?.toLocaleString()} JOD
                      </span>
                      <span style={{ color: "#22c55e", fontWeight: 600 }}>
                        ▲ {results.market.stats.median?.toLocaleString()}
                      </span>
                      <span>
                        {results.market.stats.max?.toLocaleString()} JOD
                      </span>
                    </PriceLabels>
                  </PriceBar>

                  {/* Spread */}
                  <DataRow>
                    <DataLabel>Arbitrage Spread</DataLabel>
                    <DataValue $color="#f59e0b">
                      {(
                        results.market.stats.max - results.market.stats.min
                      ).toLocaleString()}{" "}
                      JOD
                    </DataValue>
                  </DataRow>

                  <Divider />

                  {/* Command Recommendations */}
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      marginBottom: 12,
                      letterSpacing: 1,
                    }}
                  >
                    COMMAND RECOMMENDATIONS (ACQUISITION STRATEGY)
                  </div>
                  <DataRow>
                    <DataLabel>Dealer Buy Target (MAX)</DataLabel>
                    <DataValue $color="#22c55e">
                      {results.market.stats.buyTarget?.toLocaleString()} JOD
                    </DataValue>
                  </DataRow>
                  <DataRow>
                    <DataLabel>Retail Sell Target</DataLabel>
                    <DataValue $color="#06b6d4">
                      {results.market.stats.sellTarget?.toLocaleString()} JOD
                    </DataValue>
                  </DataRow>
                  <DataRow>
                    <DataLabel>Potential ROI / Margin</DataLabel>
                    <DataValue $color="#f59e0b">
                      +{results.market.stats.estProfit?.toLocaleString()} JOD
                    </DataValue>
                  </DataRow>

                  <Divider />

                  {/* ── MSRP Intelligence Section ──────────────────────── */}
                  {results.market.stats?.msrp?.msrpAvailable && (
                    <>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 12, letterSpacing: 1 }}>
                        MSRP ANCHOR — OFFICIAL PRICING INTELLIGENCE
                      </div>
                      <DataRow>
                        <DataLabel>MSRP (New Price)</DataLabel>
                        <DataValue>{results.market.stats.msrp.msrpNew?.toLocaleString()} JOD</DataValue>
                      </DataRow>
                      <DataRow>
                        <DataLabel>Depreciated Book Value</DataLabel>
                        <DataValue $color="#3b82f6">
                          {results.market.stats.msrp.bookValue?.toLocaleString()} JOD
                        </DataValue>
                      </DataRow>
                      <DataRow>
                        <DataLabel>Market vs Book</DataLabel>
                        <DataValue $color={results.market.stats.msrp.deltaPct < 0 ? '#22c55e' : '#ef4444'}>
                          {results.market.stats.msrp.deltaPct > 0 ? '+' : ''}{results.market.stats.msrp.deltaPct}%
                        </DataValue>
                      </DataRow>
                      <DataRow>
                        <DataLabel>Signal</DataLabel>
                        <Tag
                          $bg={results.market.stats.msrp.signal === 'UNDERVALUED' ? 'rgba(34, 197, 94, 0.15)' : results.market.stats.msrp.signal === 'OVERPRICED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)'}
                          $color={results.market.stats.msrp.signal === 'UNDERVALUED' ? '#22c55e' : results.market.stats.msrp.signal === 'OVERPRICED' ? '#ef4444' : '#3b82f6'}
                          $border={results.market.stats.msrp.signal === 'UNDERVALUED' ? 'rgba(34, 197, 94, 0.3)' : results.market.stats.msrp.signal === 'OVERPRICED' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}
                        >
                          {results.market.stats.msrp.signal === 'UNDERVALUED' ? '🟢' : results.market.stats.msrp.signal === 'OVERPRICED' ? '🔴' : '🔵'} {results.market.stats.msrp.signal}
                        </Tag>
                      </DataRow>

                      <Divider />

                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          marginBottom: 12,
                          letterSpacing: 1,
                        }}
                      >
                        REGULATORY FLOOR (JCD 2026 MATRIX)
                      </div>
                      <DataRow>
                        <DataLabel>Est. CIF Value</DataLabel>
                        <DataValue>{results.market.stats.jcd.cifValue?.toLocaleString()} JOD</DataValue>
                      </DataRow>
                      <DataRow>
                        <DataLabel>JCD Base Customs Value</DataLabel>
                        <DataValue>{results.market.stats.jcd.baseCustomsValue?.toLocaleString()} JOD (After -{results.market.stats.jcd.appliedDepreciationPercentage}% Depr.)</DataValue>
                      </DataRow>
                      <DataRow>
                        <DataLabel>Special Tax ({results.market.stats.jcd.specialTaxRateApplied}%)</DataLabel>
                        <DataValue $color="#f59e0b">+{results.market.stats.jcd.specialTaxJOD?.toLocaleString()} JOD</DataValue>
                      </DataRow>
                      <DataRow>
                        <DataLabel>Weight & Reg. Fees</DataLabel>
                        <DataValue $color="#f59e0b">+{ (results.market.stats.jcd.weightFeeJOD + results.market.stats.jcd.registrationFeeJOD).toLocaleString() } JOD</DataValue>
                      </DataRow>
                      <DataRow>
                        <DataLabel>Total Landed Cost</DataLabel>
                        <DataValue $color="#ef4444" style={{ fontWeight: 800 }}>
                          {results.market.stats.jcd.totalLandedCost?.toLocaleString()} JOD
                        </DataValue>
                      </DataRow>
                      <Divider />

                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          marginBottom: 12,
                          letterSpacing: 1,
                        }}
                      >
                        SABERMETRIC TARGETS (LIQUIDITY ENGINE)
                      </div>
                      <DataRow>
                        <DataLabel>Liquidity Adjusted Retail</DataLabel>
                        <DataValue>
                          {results.market.stats.bid.adjustedRetailPrice?.toLocaleString()} JOD 
                          {results.market.stats.bid.liquidityApplied && <span style={{ color: '#ef4444', marginLeft: 8, fontSize: '0.7rem' }}>(-3% LIQUIDITY MODIFIER)</span>}
                        </DataValue>
                      </DataRow>
                      <DataRow>
                        <DataLabel>Max Confident Bid</DataLabel>
                        <DataValue $color="#22c55e" style={{ fontWeight: 800, fontSize: '1.2rem' }}>
                          {results.market.stats.bid.maximumBid?.toLocaleString()} JOD
                        </DataValue>
                      </DataRow>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
                        * Includes {results.market.stats.bid.breakdown.profitTarget?.toLocaleString()} JOD profit target & {results.market.stats.bid.breakdown.reconditioning?.toLocaleString()} JOD recond.
                      </div>
                      <Divider />

                      <DataRow>
                        <DataLabel>MSRP Signal (2026 Anchor)</DataLabel>
                        <Tag
                          $bg={results.market.stats.msrp.signal === 'UNDERVALUED' ? 'rgba(34, 197, 94, 0.15)' : results.market.stats.msrp.signal === 'OVERPRICED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)'}
                          $color={results.market.stats.msrp.signal === 'UNDERVALUED' ? '#22c55e' : results.market.stats.msrp.signal === 'OVERPRICED' ? '#ef4444' : '#3b82f6'}
                          $border={results.market.stats.msrp.signal === 'UNDERVALUED' ? 'rgba(34, 197, 94, 0.3)' : results.market.stats.msrp.signal === 'OVERPRICED' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}
                        >
                          {results.market.stats.msrp.signal === 'UNDERVALUED' ? '🟢' : results.market.stats.msrp.signal === 'OVERPRICED' ? '🔴' : '🔵'} {results.market.stats.msrp.signal}
                        </Tag>
                      </DataRow>
                      <DataRow>
                        <DataLabel>Projected Margin</DataLabel>
                        <DataValue $color="#22c55e">
                          +{results.market.stats.msrp.projectedMargin?.toLocaleString()} JOD ({results.market.stats.msrp.marginPct}%)
                        </DataValue>
                      </DataRow>
                      {/* MSRP Explanation */}
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '12px 0 0', lineHeight: 1.6, background: 'rgba(59, 130, 246, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                        💡 {results.market.stats.msrp.explanation}
                      </p>
                      <Divider />
                    </>
                  )}
                  {results.market.stats?.msrp && !results.market.stats.msrp.msrpAvailable && (
                    <AlertBanner $type="warning">
                      <Warning />
                      <div>
                        <strong>No MSRP Reference:</strong> This make/model is not in the official pricing database yet. Buy/sell targets are market-only estimates.
                      </div>
                    </AlertBanner>
                  )}

                  {/* Market Intelligence Metrics */}
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      marginBottom: 12,
                      letterSpacing: 1,
                    }}
                  >
                    MARKET INTELLIGENCE (DEMAND & VELOCITY)
                  </div>
                  <DataRow>
                    <DataLabel>Market Velocity</DataLabel>
                    <Tag 
                      $bg={results.market.stats.marketVelocity === 'HIGH' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)'}
                      $color={results.market.stats.marketVelocity === 'HIGH' ? '#22c55e' : '#f59e0b'}
                    >
                      {results.market.stats.marketVelocity}
                    </Tag>
                  </DataRow>
                  <DataRow>
                    <DataLabel>Market Tone</DataLabel>
                    <DataValue>{results.market.stats.marketTone}</DataValue>
                  </DataRow>
                  <DataRow>
                    <DataLabel>Avg Views / Listing</DataLabel>
                    <DataValue>{results.market.stats.avgViewsPerListing?.toLocaleString()}</DataValue>
                  </DataRow>
                  {results.market.stats.avgDaysOnMarket > 0 && (
                    <DataRow>
                      <DataLabel>Avg Days on Market</DataLabel>
                      <DataValue>{results.market.stats.avgDaysOnMarket}d</DataValue>
                    </DataRow>
                  )}
                  {results.market.stats.capitalVelocity > 0 && (
                    <DataRow>
                      <DataLabel>Capital Velocity</DataLabel>
                      <DataValue $color={results.market.stats.capitalVelocity > 50 ? '#22c55e' : results.market.stats.capitalVelocity > 20 ? '#f59e0b' : '#ef4444'}>
                        {results.market.stats.capitalVelocity} views/day — {results.market.stats.capitalVelocity > 50 ? '🔥 HOT' : results.market.stats.capitalVelocity > 20 ? '🟡 WARM' : '❄️ COLD'}
                      </DataValue>
                    </DataRow>
                  )}

                  {/* ── Price Distribution Chart ──────────────── */}
                  {results.market.listings?.length > 2 && (
                    <>
                      <Divider />
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 12, letterSpacing: 1 }}>
                        PRICE DISTRIBUTION
                      </div>
                      <div style={{ width: '100%', height: 180 }}>
                        <ResponsiveContainer>
                          <BarChart data={
                            results.market.listings
                              .filter(l => l.price)
                              .sort((a, b) => a.price - b.price)
                              .map((l, i) => ({ name: `#${i+1}`, price: l.price, source: l.source }))
                          } margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                            <Tooltip
                              contentStyle={{ background: '#1e293b', border: '1px solid rgba(100,116,139,0.2)', borderRadius: 8, fontSize: '0.8rem' }}
                              labelStyle={{ color: '#94a3b8' }}
                              formatter={(v) => [`${v?.toLocaleString()} JOD`, 'Price']}
                            />
                            {results.market.stats?.median && (
                              <ReferenceLine y={results.market.stats.median} stroke="#22c55e" strokeDasharray="3 3" label={{ value: 'Median', fill: '#22c55e', fontSize: 10 }} />
                            )}
                            <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                              {results.market.listings
                                .filter(l => l.price)
                                .sort((a, b) => a.price - b.price)
                                .map((entry, i) => {
                                  const median = results.market.stats?.median || 0;
                                  const pct = median ? ((entry.price - median) / median) * 100 : 0;
                                  let fill = '#3b82f6';
                                  if (pct < -10) fill = '#22c55e';
                                  else if (pct > 10) fill = '#ef4444';
                                  else if (pct < -5) fill = '#10b981';
                                  else if (pct > 5) fill = '#f59e0b';
                                  return <Cell key={i} fill={fill} />;
                                })}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: '0.7rem', color: '#64748b', justifyContent: 'center', marginTop: 4 }}>
                        <span>🟢 Below market</span>
                        <span>🔵 At market</span>
                        <span>🔴 Above market</span>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <AlertBanner $type="warning">
                  <Warning />
                  <div>
                    No active listings found on marketplace. Asset may be
                    unlisted or extremely rare in Jordan.
                  </div>
                </AlertBanner>
              )}

              <Divider />

              {/* Risk Audit */}
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  marginBottom: 8,
                  letterSpacing: 1,
                }}
              >
                RISK AUDIT
              </div>
              {results.risks.length > 0 ? (
                results.risks.map((risk, i) => (
                  <AlertBanner key={i} $type={risk.type}>
                    {risk.icon}
                    <div>
                      <strong>{risk.title}</strong>
                      <br />
                      {risk.message}
                    </div>
                  </AlertBanner>
                ))
              ) : (
                <AlertBanner $type="success">
                  <CheckCircle />
                  <div>
                    No elevated risk flags detected. Standard acquisition
                    protocols apply.
                  </div>
                </AlertBanner>
              )}

              {/* Customs Status */}
              <Divider />
              <DataRow>
                <DataLabel>Customs Status Check</DataLabel>
                <Tag
                  $bg="rgba(245, 158, 11, 0.1)"
                  $color="#fcd34d"
                  $border="rgba(245, 158, 11, 0.2)"
                >
                  VERIFY VIN
                </Tag>
              </DataRow>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#64748b",
                  margin: "8px 0 0",
                  lineHeight: 1.5,
                }}
              >
                Cross-reference specific VIN against Zarqa Free Zone registry to
                determine &quot;Clearance Pending&quot; vs &quot;Duty Paid&quot;
                status.
              </p>
            </PanelBody>
          </Panel>

          {/* ═══════════════════════════════════════════════════════════
               PANEL 2: REGULATORY & COMPLIANCE INDEX
             ═══════════════════════════════════════════════════════════ */}
          <Panel $accent="rgba(59, 130, 246, 0.3)" $delay="0.1s">
            <PanelHeader $accent="#3b82f6">
              <Shield />
              <PanelTitle $accent="#3b82f6">
                Regulatory & Compliance Index
              </PanelTitle>
            </PanelHeader>
            <PanelBody>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  marginBottom: 16,
                  letterSpacing: 1,
                }}
              >
                LEGAL SHIELD — MoITC MANDATE AUDIT
              </div>

              {results.regulatory.map((item, i) => (
                <React.Fragment key={i}>
                  <DataRow>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {React.cloneElement(item.icon, {
                        style: {
                          fontSize: "1.1rem",
                          color:
                            item.type === "danger"
                              ? "#ef4444"
                              : item.type === "warning"
                              ? "#f59e0b"
                              : item.type === "success"
                              ? "#22c55e"
                              : "#3b82f6",
                        },
                      })}
                      <DataLabel>{item.label}</DataLabel>
                    </div>
                    <Tag
                      $bg={
                        item.type === "danger"
                          ? "rgba(239, 68, 68, 0.1)"
                          : item.type === "warning"
                          ? "rgba(245, 158, 11, 0.1)"
                          : item.type === "success"
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(59, 130, 246, 0.1)"
                      }
                      $color={
                        item.type === "danger"
                          ? "#fca5a5"
                          : item.type === "warning"
                          ? "#fcd34d"
                          : item.type === "success"
                          ? "#86efac"
                          : "#93c5fd"
                      }
                      $border={
                        item.type === "danger"
                          ? "rgba(239, 68, 68, 0.3)"
                          : item.type === "warning"
                          ? "rgba(245, 158, 11, 0.3)"
                          : item.type === "success"
                          ? "rgba(34, 197, 94, 0.3)"
                          : "rgba(59, 130, 246, 0.3)"
                      }
                    >
                      {item.status}
                    </Tag>
                  </DataRow>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      margin: "4px 0 16px",
                      lineHeight: 1.5,
                      paddingLeft: 28,
                    }}
                  >
                    {item.detail}
                  </p>
                </React.Fragment>
              ))}
            </PanelBody>
          </Panel>

          {/* ═══════════════════════════════════════════════════════════
               PANEL 3: AI LEAD ORCHESTRATION
             ═══════════════════════════════════════════════════════════ */}
          <Panel $accent="rgba(168, 85, 247, 0.3)" $delay="0.2s">
            <PanelHeader $accent="#a855f7">
              <People />
              <PanelTitle $accent="#a855f7">
                AI Lead Orchestration
              </PanelTitle>
            </PanelHeader>
            <PanelBody>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  marginBottom: 16,
                  letterSpacing: 1,
                }}
              >
                HIGH-INTENT BUYER RANKING
              </div>

              {results.leads.map((lead, i) => (
                <LeadCard key={i}>
                  <LeadAvatar $bg={lead.bg}>{lead.initials}</LeadAvatar>
                  <LeadInfo>
                    <div className="name">{lead.name}</div>
                    <div className="metric">{lead.metric}</div>
                  </LeadInfo>
                  <LeadScore $score={lead.score}>{lead.score}%</LeadScore>
                </LeadCard>
              ))}

              <Divider />

              {/* Quarantined */}
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#ef4444",
                  marginBottom: 10,
                  letterSpacing: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FilterList fontSize="small" />
                QUARANTINED OFFERS
              </div>

              {results.quarantined.map((q, i) => (
                <AlertBanner key={i} $type="danger">
                  <Block fontSize="small" />
                  <div>
                    <strong>{q.name}</strong> — {q.reason}
                  </div>
                </AlertBanner>
              ))}
            </PanelBody>
          </Panel>

          {/* ═══════════════════════════════════════════════════════════
               PANEL 4: SYNDICATION CHECKPOINT
             ═══════════════════════════════════════════════════════════ */}
          <Panel $accent="rgba(6, 182, 212, 0.3)" $delay="0.3s">
            <PanelHeader $accent="#06b6d4">
              <Campaign />
              <PanelTitle $accent="#06b6d4">
                Syndication Checkpoint
              </PanelTitle>
            </PanelHeader>
            <PanelBody>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  marginBottom: 16,
                  letterSpacing: 1,
                }}
              >
                MULTI-CHANNEL DISTRIBUTION — HITL PROTOCOL
              </div>

              {/* Generated listing copy */}
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 16,
                  border: "1px solid rgba(100, 116, 139, 0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#64748b",
                    marginBottom: 8,
                    letterSpacing: 1,
                  }}
                >
                  AUTO-GENERATED LISTING COPY
                </div>
                <p
                  style={{
                    color: "#e2e8f0",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  🚗 <strong>{year} {make} {model}</strong> — Available Now
                  <br />
                  {results.market.stats?.median && (
                    <>💰 Asking: {results.market.stats.median.toLocaleString()} JOD<br /></>
                  )}
                  📍 Location: Amman, Jordan
                  <br />
                  ✅ Comprehensive inspection completed
                  <br />
                  📞 Contact dealership for viewing appointment
                </p>
              </div>

              {/* Channel Selection */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <SyndicateButton
                  $active={channels.facebook}
                  onClick={() => toggleChannel("facebook")}
                >
                  {channels.facebook ? <CheckCircle fontSize="small" /> : null}
                  Facebook Marketplace
                </SyndicateButton>
                <SyndicateButton
                  $active={channels.opensooq}
                  onClick={() => toggleChannel("opensooq")}
                >
                  {channels.opensooq ? <CheckCircle fontSize="small" /> : null}
                  OpenSooq
                </SyndicateButton>
              </div>

              <AlertBanner $type="info">
                <Info />
                <div>
                  <strong>HITL Protocol Active:</strong> Automation completes
                  99% of data entry. Final publish requires manual confirmation
                  to protect dealership accounts from platform detection.
                </div>
              </AlertBanner>

              {/* THE BUTTON */}
              <ReviewPublishButton
                id="dos-review-publish"
                onClick={() =>
                  alert(
                    `Staging ${year} ${make} ${model} for syndication to: ${
                      Object.entries(channels)
                        .filter(([, v]) => v)
                        .map(([k]) => k)
                        .join(", ")
                    }. Headless browser will launch for HITL review.`
                  )
                }
              >
                REVIEW & PUBLISH
              </ReviewPublishButton>
            </PanelBody>
          </Panel>
          {/* ═══════════════════════════════════════════════════════════
               PANEL 5: MARKET EVIDENCE (LIVE SAMPLES)
             ═══════════════════════════════════════════════════════════ */}
          <Panel $accent="rgba(100, 116, 139, 0.3)" $delay="0.4s" style={{ gridColumn: "1 / -1" }}>
            <PanelHeader $accent="#94a3b8">
              <Visibility />
              <PanelTitle $accent="#94a3b8">
                Market Evidence (Live Samples)
              </PanelTitle>
            </PanelHeader>
            <PanelBody>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {results.market.listings?.map((item, i) => (
                  <div key={i} style={{ 
                    background: 'rgba(15, 23, 42, 0.4)', 
                    border: '1px solid rgba(100, 116, 139, 0.1)', 
                    borderRadius: '12px', 
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#22c55e' }}>
                        {item.price?.toLocaleString()} JOD
                      </div>
                      <Tag $bg="rgba(100, 116, 139, 0.1)" $color="#94a3b8" $border="rgba(100, 116, 139, 0.2)">
                        {item.source}
                      </Tag>
                    </div>
                    
                    {/* Price Context Badge */}
                    {item.priceContext && (
                      <div style={{
                        fontSize: '0.72rem',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: item.priceContext.includes('below') ? 'rgba(34, 197, 94, 0.1)' 
                          : item.priceContext.includes('above') ? 'rgba(239, 68, 68, 0.1)' 
                          : 'rgba(59, 130, 246, 0.1)',
                        color: item.priceContext.includes('below') ? '#22c55e' 
                          : item.priceContext.includes('above') ? '#ef4444' 
                          : '#3b82f6',
                        fontWeight: 600,
                        letterSpacing: 0.5,
                      }}>
                        {item.priceContext}
                      </div>
                    )}

                    <div style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>📅 {item.year}</span>
                      {item.mileage && <span>🛣️ {item.mileage}</span>}
                      {item.condition && <span>📊 {item.condition}</span>}
                      {item.color && <span>🎨 {item.color}</span>}
                    </div>

                    {/* Context Reasons */}
                    {item.contextReasons && (
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                        {item.contextReasons}
                      </p>
                    )}

                    {item.description && (
                      <p style={{ 
                        fontSize: '0.8rem', 
                        color: '#64748b', 
                        margin: 0, 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5
                      }}>
                        {item.description}
                      </p>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                      <a 
                        href={item.listingUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ 
                          fontSize: '0.75rem', 
                          color: '#3b82f6', 
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        VIEW ORIGINAL LISTING <Send style={{ fontSize: '0.8rem' }} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </PanelBody>
          </Panel>
        </ResultsGrid>
      )}
      {/* ── FORENSIC OVERLAY ─────────────────────────────────────────── */}
      {showForensics && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 500, position: 'relative' }}>
            <button 
              onClick={() => setShowForensics(false)}
              style={{ position: 'absolute', top: -40, right: 0, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}
            >
              [ CLOSE TERMINAL ]
            </button>
            <VINScanner 
              onForensicsComplete={(data) => {
                setForensicData(data);
                // Optionally auto-search for the car found in forensics
                if (data.analysis.tax) {
                  setMake(data.analysis.audit.rawAudit.includes('Toyota') ? 'Toyota' : 'Toyota'); // Mock logic
                  setModel('Camry');
                  setYear('2022');
                }
              }} 
            />
            
            {forensicData && (
              <div style={{ marginTop: 20, background: '#111', border: '1px solid #222', borderRadius: 16, padding: 20, animation: `${fadeSlideIn} 0.4s ease-out` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                  <Shield style={{ color: forensicData.analysis.audit.riskTag === 'RED' ? '#ef4444' : '#22c55e' }} />
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>FORENSIC RESULTS: {forensicData.analysis.audit.riskTag}</h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {forensicData.analysis.audit.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <div style={{ marginTop: 15, paddingTop: 15, borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#475569' }}>MAX CONFIDENT BID</div>
                    <div style={{ fontSize: '1.2rem', color: '#22c55e', fontWeight: 800 }}>{forensicData.analysis.bid.maximumBid.toLocaleString()} JOD</div>
                  </div>
                  <button 
                    onClick={() => {
                      setShowForensics(false);
                      executeQuery();
                    }}
                    style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '0 20px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    SYNC MARKET DATA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
