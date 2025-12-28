"use client"; // Add this at the top for client-side rendering in Next.js

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
// Styled Components
const Container = styled.div`
  padding: 2rem;
  color: white;
`;

const EnquiryCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.primary ? "#0070f3" : "#282828")};
  color: ${(props) => (props.primary ? "white" : "black")};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.primary ? "#005bb5" : "#282828")};
  }
`;

// Main Component
export default function EnquiryPage() {
  const [enquiries, setEnquiries] = useState([]);

  // Fetch all enquiries on mount
  useEffect(() => {
    async function fetchEnquiries() {
      const res = await fetch("/api/enquiry");
      const data = await res.json();
      setEnquiries(data);
    }
    fetchEnquiries();
  }, []);

  // Delete enquiry by id
  const handleDelete = async (id) => {
    await fetch(`/api/enquiry?id=${id}`, {
      method: "DELETE",
    });
    setEnquiries(enquiries.filter((enquiry) => enquiry._id !== id));
  };

  // Mark enquiry as cleared
  const handleClear = async (id) => {
    await fetch(`/api/enquiry`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, cleared: true }),
    });

    setEnquiries(
      enquiries.map((enquiry) =>
        enquiry._id === id ? { ...enquiry, cleared: true } : enquiry
      )
    );
  };

  return (
    <Container>
      <Link href={"/enquiries/post-enquiry"}>Post Enquiry</Link>
      {enquiries.map((enquiry) => (
        <EnquiryCard key={enquiry._id}>
          <Title>{enquiry.title}</Title>
          <ButtonContainer>
            <Link href={`/enquiries/${enquiry._id}`}>
              <Button primary>View</Button>
            </Link>
            <Button onClick={() => handleClear(enquiry._id)}>Clear</Button>
            <Button onClick={() => handleDelete(enquiry._id)}>Delete</Button>
          </ButtonContainer>
        </EnquiryCard>
      ))}
    </Container>
  );
}
