import React, { useState, useRef } from "react";
import styled from "@emotion/styled";

const UploadContainer = styled.div`
  border: 2px dashed #4caf50;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background-color: rgba(76, 175, 80, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  margin-bottom: 20px;

  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
    border-color: #45a049;
  }
`;

const UploadText = styled.p`
  color: #fff;
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`;

const UploadSubtext = styled.span`
  color: #aaa;
  font-size: 12px;
  display: block;
  margin-top: 5px;
`;

const FileInput = styled.input`
  display: none;
`;

const Spinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #4caf50;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.p`
  color: #f44336;
  font-size: 14px;
  margin-top: 10px;
`;

export default function CarSeerUpload({ onParsedData }) {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleContainerClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF document.");
      return;
    }

    setError(null);
    setIsParsing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
      const response = await fetch(`${apiUrl}/api/parse-carseer`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to parse PDF.");
      }

      if (result.success && result.data) {
        onParsedData(result.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsParsing(false);
      // Clear input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <UploadContainer onClick={!isParsing ? handleContainerClick : undefined}>
      {isParsing ? (
        <>
          <Spinner />
          <UploadText>Decoding CarSeer Report...</UploadText>
        </>
      ) : (
        <>
          <svg
            style={{
              width: "32px",
              height: "32px",
              marginBottom: "10px",
              fill: "#4CAF50",
            }}
            viewBox="0 0 24 24"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13.5,16V19H10.5V16H8L12,12L16,16H13.5M13,9V3.5L18.5,9H13Z" />
          </svg>
          <UploadText>Upload CarSeer PDF</UploadText>
          <UploadSubtext>Drag & Drop or Click to Select</UploadSubtext>
        </>
      )}
      <FileInput
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </UploadContainer>
  );
}
