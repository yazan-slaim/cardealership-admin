"use client";

import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import { Calculate, AutoFixHigh, Send, CloudUpload, CameraAlt, Search } from "@mui/icons-material";

const SandboxContainer = styled.div`
  padding: 32px;
  background-color: #f8fafc;
  min-height: 100vh;
  color: #0f172a;
`;

const Header = styled.div`
  margin-bottom: 32px;
  h1 { margin: 0 0 8px 0; font-size: 2rem; color: #1e3a8a; }
  p { margin: 0; color: #64748b; font-size: 1.1rem; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
`;

const Widget = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);

  h2 {
    display: flex; align-items: center; gap: 8px;
    margin: 0 0 16px 0; font-size: 1.2rem; color: #0f172a;
    border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;
  }
`;

const InputGroup = styled.div`
  display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;
  label { font-weight: 600; font-size: 0.85rem; color: #475569; }
  input, select { 
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
  &:hover { background: #1e40af; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export default function SandboxPage() {
  // --- WARRANTY MATH STATE ---
  const [warrantyCarPrice, setWarrantyCarPrice] = useState(25000);
  const [warrantyResult, setWarrantyResult] = useState(null);

  const calculateWarranty = () => {
    // Pure algorithmic prototype logic
    // 1 Year is 2.5% of car cost + base fee of $200
    // 3 Year is 6% of car cost + base fee of $400
    const oneYear = (warrantyCarPrice * 0.025) + 200;
    const threeYear = (warrantyCarPrice * 0.06) + 400;
    setWarrantyResult({ '1_Year_Plan': oneYear, '3_Year_Plan': threeYear });
  };

  // --- OMNICHANNEL AUTO POSTING STATE ---
  const [postingState, setPostingState] = useState(null);
  const [fbEmail, setFbEmail] = useState("");
  const [fbPassword, setFbPassword] = useState("");
  const [osEmail, setOsEmail] = useState("");
  const [osPassword, setOsPassword] = useState("");

  const triggerPuppeteerSim = async () => {
    if (!fbEmail || !fbPassword) {
      setPostingState("Error: Please enter FB Email and Password!");
      return;
    }
    
    setPostingState("Initializing Headless Browser Backend...");
    try {
      const res = await fetch("http://localhost:3002/api/syndicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          carId: "TEST_CAR", 
          make: "Toyota", 
          model: "Camry", 
          price: 25000,
          fbEmail,
          fbPassword,
          osEmail,
          osPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setPostingState("SUCCESS! Browser visibly launched. Check the server screen.");
      } else {
        setPostingState("Error: " + data.error);
      }
    } catch (err) {
      setPostingState("Network Error reaching backend Puppeteer API.");
    }
  };

  // --- AUTO WATERMARK STATE ---
  const canvasRef = useRef(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = 400;
        canvas.height = (img.height / img.width) * 400;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Add Watermark
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Shadow box
        ctx.fillRect(10, canvas.height - 40, 200, 30);
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("PRECISION NAVIGATOR", 20, canvas.height - 20);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <SandboxContainer>
      <Header>
        <h1>Functional Sandbox</h1>
        <p>Testing ground for raw algorithms, Headless APIs, and Calculators.</p>
      </Header>

      <Grid>
        
        {/* WIDGET 1: CALCULATOR */}
        <Widget>
          <h2><Calculate /> Warranty Algorithm Engine</h2>
          <InputGroup>
            <label>Car Price ($)</label>
            <input type="number" value={warrantyCarPrice} onChange={e => setWarrantyCarPrice(e.target.value)} />
          </InputGroup>
          <ActionButton onClick={calculateWarranty}>Calculate Profit Margins</ActionButton>
          {warrantyResult && (
            <ResultBox>
              1-Year Plan: ${warrantyResult['1_Year_Plan'].toLocaleString()}<br/>
              3-Year Plan: ${warrantyResult['3_Year_Plan'].toLocaleString()}
            </ResultBox>
          )}
        </Widget>

        {/* WIDGET 2: OMNICHANNEL POSTER */}
        <Widget>
          <h2><CloudUpload /> FB / OpenSooq Headless Poster</h2>
          <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: 16}}>
            Enter dummy or real FB credentials to watch the robot log in and bypass the gateway automatically. This data is not stored!
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <InputGroup>
                <label>Facebook Email</label>
                <input type="text" value={fbEmail} onChange={e => setFbEmail(e.target.value)} placeholder="FB Email or Phone" />
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

          <ActionButton onClick={triggerPuppeteerSim} style={{ background: '#16a34a', marginTop: '8px' }}>
            <Send fontSize="small"/> Execute Multi-Channel Post
          </ActionButton>
          <ResultBox>
            {postingState || "Waiting to execute..."}
          </ResultBox>
        </Widget>

        {/* WIDGET 3: AUTO WATERMARK PIPELINE */}
        <Widget>
          <h2><CameraAlt /> Media Lab: Auto-Watermark</h2>
          <InputGroup>
            <label>Upload standard Car Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </InputGroup>
          <canvas ref={canvasRef} style={{ width: '100%', background: '#e2e8f0', borderRadius: 8, marginTop: 12, display: 'block' }}></canvas>
        </Widget>

        {/* WIDGET 4: BULK EV MARKETING ENGINE */}
        <Widget>
          <h2><AutoFixHigh /> Bulk Lead Marketing Query</h2>
          <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: 16}}>
            Queries Mongoose for ALL leads who viewed EVs in the past 7 days and formats a WhatsApp blast list.
          </p>
          <ActionButton onClick={() => alert("Querying Mongoose Models for EV Interest tags...")} style={{ background: '#0f172a' }}>
             Run Database Aggregation
          </ActionButton>
          <ResultBox>
            [Query Awaiting Execution...]
          </ResultBox>
        </Widget>

      </Grid>
    </SandboxContainer>
  );
}
