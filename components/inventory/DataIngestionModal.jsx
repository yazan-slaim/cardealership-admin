"use client";

import styled from "@emotion/styled";
import { useState } from "react";
import { Close, DocumentScanner, QrCodeScanner, CheckCircle } from "@mui/icons-material";

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: white;
  width: 90%;
  max-width: 600px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const Content = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: #334155;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  text-transform: uppercase;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.$bg || "#1e3a8a"};
  color: white;
  border: none;
  padding: 0 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Dropzone = styled.div`
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  background-color: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  &:hover {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
  }
`;

const ResultBox = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 16px;
  border-radius: 8px;
  color: #166534;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default function DataIngestionModal({ isOpen, onClose }) {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [pdfStatus, setPdfStatus] = useState(null); // 'uploading', 'success'

  if (!isOpen) return null;

  const handleVinLookup = async () => {
    if (vin.length !== 17) return alert("VIN must be 17 characters");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/vin-decode?vin=${vin}`);
      const data = await res.json();
      if (data.success) {
        setResult(data.vehicle);
      } else {
        alert(data.error || "Failed to decode");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handlePdfSimulation = () => {
    setPdfStatus('uploading');
    setTimeout(() => {
      setPdfStatus('success');
    }, 2000);
  };

  return (
    <Overlay>
      <ModalBox>
        <Header>
          <h2><QrCodeScanner /> Zero-Typing Data Ingestion</h2>
          <Close style={{ cursor: "pointer", color: "#64748b" }} onClick={onClose} />
        </Header>
        <Content>
          
          <Section>
            <Label>Step 1: Free Public Spec Fetch (NHTSA)</Label>
            <InputGroup>
              <Input 
                placeholder="Enter 17 Character VIN" 
                maxLength={17} 
                value={vin} 
                onChange={(e) => setVin(e.target.value.toUpperCase())}
              />
              <Button onClick={handleVinLookup} disabled={loading}>
                {loading ? "Fetching..." : "Decode"}
              </Button>
            </InputGroup>
          </Section>

          {result && (
            <ResultBox>
              <strong><CheckCircle fontSize="small" /> Successfully Imported specs:</strong>
              {result.year} {result.carMake} {result.model} ({result.trim || result.engineSize + "L"})
            </ResultBox>
          )}

          <Section style={{ marginTop: 12 }}>
            <Label>Step 2: Premium History / Battery Fetch (CarSeer)</Label>
            <Dropzone onClick={handlePdfSimulation}>
              {pdfStatus === 'uploading' ? (
                <p>Analyzing PDF with AI...</p>
              ) : pdfStatus === 'success' ? (
                <div style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                   <CheckCircle /> CarSeer Data Extracted (98.4% Battery Health)
                </div>
              ) : (
                <>
                  <DocumentScanner style={{ fontSize: 48, color: "#94a3b8" }} />
                  <p><strong>Click to Upload CarSeer PDF.</strong><br/>AI will automatically extract damage & spec tables.</p>
                </>
              )}
            </Dropzone>
          </Section>

          <Button style={{ marginTop: 16, padding: "16px", justifyContent: "center" }}>
            Add Inventory Item to Database
          </Button>

        </Content>
      </ModalBox>
    </Overlay>
  );
}
