"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import { useParams } from "next/navigation";
import styled from "@emotion/styled";

const ScanContainer = styled.div`
  background: #000;
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: white;
  padding: 20px;
  text-align: center;
`;

const CameraFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
  border: 2px solid #3b82f6;
  border-radius: 12px;
  overflow: hidden;
  
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    height: 40px;
    border: 2px solid #ef4444;
    transform: translateY(-50%);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
    pointer-events: none;
  }
`;

const Status = styled.div`
  background: rgba(255,255,255,0.1);
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  font-family: monospace;
  font-size: 1.1rem;
`;

export default function MobileScanPage() {
  const { id } = useParams();
  const webcamRef = useRef(null);
  const [ocrText, setOcrText] = useState("");
  const [status, setStatus] = useState("Align VIN in the red box...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const capture = useCallback(async () => {
    if (isProcessing || success) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setIsProcessing(true);
    
    // INSTITUTIONAL UPGRADE: High-contrast filter simulation for OCR stability
    // We'll use a canvas to process the image before Tesseract
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = imageSrc;
    await new Promise((resolve) => (img.onload = resolve));

    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.filter = "contrast(200%) grayscale(100%)";
    ctx.drawImage(img, 0, 0);

    try {
      const { data: { text } } = await Tesseract.recognize(canvas.toDataURL("image/jpeg"), 'eng', {
        logger: m => console.log(m)
      });

      // SANITIZE & VALIDATE
      const sanitized = text.replace(/[^A-HJ-NPR-Z0-9]/gi, "").toUpperCase();
      const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;

      if (vinRegex.test(sanitized)) {
        setOcrText(sanitized);
        setStatus("✅ VALID VIN DETECTED!");
        setSuccess(true);
        
        // Push to Handshake API
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002'}/api/scan/session/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vin: sanitized })
        });

        if (res.ok) {
          setStatus("🚀 DATA SENT TO LAPTOP");
          if (navigator.vibrate) navigator.vibrate(200);
        } else {
          setStatus("❌ FAILED TO SEND DATA");
          setSuccess(false);
        }
      } else {
        setOcrText(sanitized.substring(0, 17));
        setStatus("Scanning...");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [id, isProcessing, success]);

  useEffect(() => {
    const interval = setInterval(() => {
      capture();
    }, 1500); // OCR pulse every 1.5s
    return () => clearInterval(interval);
  }, [capture]);

  return (
    <ScanContainer>
      <h2 style={{margin: 0}}>VIN SCANNER</h2>
      <p style={{fontSize: '0.8rem', color: '#94a3b8'}}>Zarqa Free Zone Protocol v1.0</p>
      
      <CameraFrame>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "environment" }}
          style={{ width: "100%" }}
        />
      </CameraFrame>

      <Status>
        <div style={{fontSize: '0.7rem', color: '#64748b', marginBottom: 5}}>STATUS</div>
        {status}
        <div style={{marginTop: 10, color: '#3b82f6'}}>{ocrText}</div>
      </Status>

      {success && (
        <div style={{marginTop: 30}}>
          <button 
            onClick={() => window.close()} 
            style={{background: '#16a34a', border: 'none', padding: '15px 40px', borderRadius: '30px', color: 'white', fontWeight: 700}}
          >
            DONE
          </button>
        </div>
      )}
    </ScanContainer>
  );
}
