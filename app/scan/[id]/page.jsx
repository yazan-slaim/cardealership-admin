"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import { useParams } from "next/navigation";
import styled from "@emotion/styled";

const ScanContainer = styled.div`
  background: #000;
  min-height: 100vh;
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
    left: 5%;
    right: 5%;
    height: 50px;
    border: 2px solid #ef4444;
    transform: translateY(-50%);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
    pointer-events: none;
    z-index: 2;
  }
`;

const Status = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  font-family: monospace;
  font-size: 1.1rem;
`;

const ManualInput = styled.input`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid #3b82f6;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 1.1rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  width: 100%;
  max-width: 350px;
  outline: none;
  &:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

// Common VIN OCR misreads
const VIN_CORRECTIONS = {
  O: "0",
  Q: "0",
  I: "1",
  o: "0",
  q: "0",
  i: "1",
  l: "1",
  "|": "1",
  "!": "1",
  $: "5",
  B: "8", // only correct if position suggests numeric
};

function sanitizeVin(raw) {
  // Strip everything that isn't vaguely alphanumeric
  let cleaned = raw.replace(/[^A-Za-z0-9|!$]/g, "");

  // Apply common OCR corrections character-by-character
  let corrected = "";
  for (const ch of cleaned) {
    corrected += VIN_CORRECTIONS[ch] || ch;
  }

  // Uppercase and strip any remaining illegal VIN chars (I, O, Q are illegal in real VINs)
  corrected = corrected.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");

  return corrected;
}

export default function MobileScanPage() {
  const { id } = useParams();
  const webcamRef = useRef(null);
  const [ocrText, setOcrText] = useState("");
  const [status, setStatus] = useState("Align VIN in the red box...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualVin, setManualVin] = useState("");
  const candidatesRef = useRef([]); // Multi-frame consensus buffer

  // Crop to just the red-box scan region and apply heavy preprocessing
  const preprocessFrame = useCallback(async (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    await new Promise((resolve) => (img.onload = resolve));

    const fullW = img.width;
    const fullH = img.height;

    // Crop region matching the red box overlay (center strip, 5%-95% width, ~40%-60% height)
    const cropX = Math.floor(fullW * 0.05);
    const cropY = Math.floor(fullH * 0.38);
    const cropW = Math.floor(fullW * 0.9);
    const cropH = Math.floor(fullH * 0.24);

    const canvas = document.createElement("canvas");
    // Upscale 3x for better OCR on small text
    canvas.width = cropW * 3;
    canvas.height = cropH * 3;
    const ctx = canvas.getContext("2d");

    // Draw cropped + upscaled
    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropW,
      cropH,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    // Get pixel data for manual threshold
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale then apply Otsu-like binary threshold
    const grays = [];
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      grays.push(gray);
    }

    // Calculate threshold using mean (simple but effective for VIN plates)
    const mean = grays.reduce((a, b) => a + b, 0) / grays.length;
    const threshold = mean * 0.9; // Slightly aggressive to catch embossed text

    for (let i = 0; i < grays.length; i++) {
      const val = grays[i] < threshold ? 0 : 255;
      data[i * 4] = val;
      data[i * 4 + 1] = val;
      data[i * 4 + 2] = val;
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL("image/png");
  }, []);

  const submitVin = useCallback(
    async (vin) => {
      setOcrText(vin);
      setStatus("✅ VALID VIN DETECTED!");
      setSuccess(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/api/scan/session/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vin }),
          },
        );

        if (res.ok) {
          setStatus("🚀 DATA SENT TO LAPTOP");
          if (navigator.vibrate) navigator.vibrate(200);
        } else {
          setStatus("❌ FAILED TO SEND DATA");
          setSuccess(false);
        }
      } catch (err) {
        console.error(err);
        setStatus("❌ NETWORK ERROR");
        setSuccess(false);
      }
    },
    [id],
  );

  const capture = useCallback(async () => {
    if (isProcessing || success) return;
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setIsProcessing(true);

    try {
      const processedImage = await preprocessFrame(imageSrc);

      const {
        data: { text },
      } = await Tesseract.recognize(processedImage, "eng", {
        tessedit_char_whitelist: "ABCDEFGHJKLMNPRSTUVWXYZ0123456789",
        tessedit_pageseg_mode: "7", // Single text line
      });

      const sanitized = sanitizeVin(text);
      const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;

      if (vinRegex.test(sanitized)) {
        // Add to consensus buffer
        candidatesRef.current.push(sanitized);

        // Keep last 5 reads
        if (candidatesRef.current.length > 5) {
          candidatesRef.current = candidatesRef.current.slice(-5);
        }

        // Need at least 2 matching reads for confirmation
        const counts = {};
        candidatesRef.current.forEach((v) => {
          counts[v] = (counts[v] || 0) + 1;
        });

        const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
        if (best && best[1] >= 2) {
          await submitVin(best[0]);
        } else {
          setOcrText(sanitized);
          setStatus("Verifying... hold steady");
        }
      } else if (sanitized.length > 0) {
        setOcrText(sanitized.substring(0, 17));
        setStatus("Scanning...");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, success, preprocessFrame, submitVin]);

  useEffect(() => {
    const interval = setInterval(() => {
      capture();
    }, 2000); // OCR pulse every 2s
    return () => clearInterval(interval);
  }, [capture]);

  // Auto-show manual input after 15s of no success
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!success) setShowManual(true);
    }, 15000);
    return () => clearTimeout(timeout);
  }, [success]);

  const handleManualSubmit = async () => {
    const cleaned = manualVin.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
    if (/^[A-HJ-NPR-Z0-9]{17}$/.test(cleaned)) {
      await submitVin(cleaned);
    } else {
      setStatus("❌ Invalid VIN — must be exactly 17 characters");
    }
  };

  return (
    <ScanContainer>
      <h2 style={{ margin: 0 }}>VIN SCANNER</h2>
      <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
        Zarqa Free Zone Protocol v1.0
      </p>

      {!success && (
        <CameraFrame>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            style={{ width: "100%" }}
          />
        </CameraFrame>
      )}

      <Status>
        <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: 5 }}>
          STATUS
        </div>
        {status}
        <div style={{ marginTop: 10, color: "#3b82f6" }}>{ocrText}</div>
      </Status>

      {/* Manual fallback */}
      {showManual && !success && (
        <div style={{ marginTop: 20 }}>
          <p
            style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 10 }}
          >
            Can&apos;t read it? Type the VIN manually:
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <ManualInput
              type="text"
              maxLength={17}
              placeholder="Enter 17-char VIN"
              value={manualVin}
              onChange={(e) => setManualVin(e.target.value.toUpperCase())}
            />
            <button
              onClick={handleManualSubmit}
              style={{
                background: "#3b82f6",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              SUBMIT
            </button>
          </div>
        </div>
      )}

      {!showManual && !success && (
        <button
          onClick={() => setShowManual(true)}
          style={{
            background: "transparent",
            border: "1px solid #475569",
            padding: "8px 20px",
            borderRadius: "20px",
            color: "#94a3b8",
            fontSize: "0.75rem",
            marginTop: 15,
            cursor: "pointer",
          }}
        >
          Type VIN manually instead
        </button>
      )}

      {success && (
        <div style={{ marginTop: 30 }}>
          <button
            onClick={() => window.close()}
            style={{
              background: "#16a34a",
              border: "none",
              padding: "15px 40px",
              borderRadius: "30px",
              color: "white",
              fontWeight: 700,
            }}
          >
            DONE
          </button>
        </div>
      )}
    </ScanContainer>
  );
}
