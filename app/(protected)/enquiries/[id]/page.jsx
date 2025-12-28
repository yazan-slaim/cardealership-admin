"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styled from "@emotion/styled";

// Styled Components
const Container = styled.div`
  padding: 2rem;
  background: #f4f4f4;
  min-height: 100vh;
`;

const EnquiryDetails = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin-bottom: 1rem;
`;

const Detail = styled.p`
  margin: 0.5rem 0;
`;

// Main Component
export default function EnquiryDetailPage() {
  const [enquiry, setEnquiry] = useState(null);
  const params = useParams();
  const id = params.id;
  console.log(params);

  useEffect(() => {
    if (id) {
      async function fetchEnquiry() {
        const res = await fetch(`/api/enquiry?id=${id}`);
        const data = await res.json();
        setEnquiry(data);
      }
      fetchEnquiry();
    }
  }, [id]);

  if (!enquiry) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <EnquiryDetails>
        <Title>{enquiry.title}</Title>
        <Detail>First Name: {enquiry.FirstName}</Detail>
        <Detail>Last Name: {enquiry.LastName}</Detail>
        <Detail>Email: {enquiry.EmailAddress}</Detail>
        <Detail>Contact Number: {enquiry.ContactNumber}</Detail>
        <Detail>Enquiry: {enquiry.Enquiry}</Detail>
        <Detail>Message: {enquiry.Message}</Detail>
        <Detail>Cleared: {enquiry.cleared ? "Yes" : "No"}</Detail>
      </EnquiryDetails>
    </Container>
  );
}
