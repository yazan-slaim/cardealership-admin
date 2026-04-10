"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { createWorker } from "tesseract.js";
import styled, { keyframes } from "styled-components";
import { X, Camera, RefreshCw, Check, Loader2 } from "lucide-react";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const scanAnimation = keyframes`
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const ScannerContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 640px;
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.4s ease-out;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  padding: 8px;
  color: white;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.2); transform: rotate(90deg); }
`;

const Viewfinder = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: #000;
`;

const ScanLine = styled.div`
  position: absolute;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  box-shadow: 0 0 15px #3b82f6;
  z-index: 5;
  animation: ${scanAnimation} 3s infinite linear;
  display: ${props => props.$isScanning ? 'block' : 'none'};
`;

const GuideBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 60px;
  border: 2px solid rgba(59, 130, 246, 0.5);
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  z-index: 4;
  &::before {
    content: "ALIGN VIN HERE";
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    color: #3b82f6;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
  }
`;

const Controls = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const StatusText = styled.p`
  color: ${props => props.$error ? '#ef4444' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 14px;
  text-align: center;
  margin: 0;
`;

const ScanButton = styled.button`
  background: ${props => props.$isScanning ? 'transparent' : '#fff'};
  color: ${props => props.$isScanning ? '#fff' : '#000'};
  border: ${props => props.$isScanning ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'};
  padding: 12px 32px;
  border-radius: 100px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(255, 255, 255, 0.2);
  }
`;

const ResultCard = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

const VinText = styled.span`
  font-family: 'Monaco', 'Consolas', monospace;
  color: #fff;
  font-size: 18px;
  letter-spacing: 2px;
`;

const VinScanner = ({ onScan, onClose }) => {
  const webcamRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState("Align the VIN within the box");
  const [capturedVin, setCapturedVin] = useState("");
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const workerRef = useRef(null);

  useEffect(() => {
    const initWorker = async () => {
      setStatus("Initializing OCR engine...");
      const worker = await createWorker('eng');
      workerRef.current = worker;
      setIsWorkerReady(true);
      setStatus("Ready to scan");
    };
    initWorker();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const capture = useCallback(async () => {
    if (!isWorkerReady || isScanning) return;

    setIsScanning(true);
    setStatus("Processing image...");
    
    const imageSrc = webcamRef.current.getScreenshot();
    
    if (imageSrc) {
      try {
        const { data: { text, confidence } } = await workerRef.current.recognize(imageSrc);
        
        // Basic VIN patterns: 17 alphanumeric characters, excluding I, O, Q
        const vinPattern = /[A-HJ-NPR-Z0-9]{17}/;
        // Clean text from spaces and special characters
        const cleanedText = text.replace(/[\s\W]/g, "").toUpperCase();
        const match = cleanedText.match(vinPattern);

        if (match) {
          const vin = match[0];
          setCapturedVin(vin);
          setStatus(`VIN detected with ${Math.round(confidence)}% confidence`);
          // Note: If confidence is low, we could suggest a re-scan as per user comments
        } else {
          setStatus("Could not detect a clear VIN. Please try again.");
        }
      } catch (error) {
        console.error("OCR Error:", error);
        setStatus("Error during scan. Please try again.");
      }
    }
    
    setIsScanning(false);
  }, [isWorkerReady, isScanning]);

  const handleConfirm = () => {
    onScan(capturedVin);
    onClose();
  };

  const handleRetry = () => {
    setCapturedVin("");
    setStatus("Align the VIN within the box");
  };

  return (
    <Overlay>
      <ScannerContainer>
        <CloseButton onClick={onClose}><X size={20} /></CloseButton>
        
        <Viewfinder>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment", width: 1280, height: 720 }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <GuideBox />
          <ScanLine $isScanning={isScanning} />
        </Viewfinder>

        <Controls>
          {capturedVin ? (
            <>
              <StatusText>Review detected VIN</StatusText>
              <ResultCard>
                <VinText>{capturedVin}</VinText>
                <div style={{ display: "flex", gap: "8px" }}>
                  <SmallBtn onClick={handleRetry}><RefreshCw size={16} /></SmallBtn>
                  <SmallBtn $primary onClick={handleConfirm}><Check size={16} /></SmallBtn>
                </div>
              </ResultCard>
            </>
          ) : (
            <>
              <StatusText>{status}</StatusText>
              <ScanButton 
                onClick={capture} 
                disabled={!isWorkerReady || isScanning}
                $isScanning={isScanning}
              >
                {isScanning ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Camera size={20} />
                )}
                {isScanning ? "Processing..." : "Capture VIN"}
              </ScanButton>
            </>
          )}
        </Controls>
      </ScannerContainer>
    </Overlay>
  );
};

const SmallBtn = styled.button`
  background: ${props => props.$primary ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover { background: ${props => props.$primary ? '#2563eb' : 'rgba(255, 255, 255, 0.2)'}; }
`;

export default VinScanner;
