"use client";
import React, { useState } from "react";
import styled from "@emotion/styled";

// Styled Components
const Container = styled.div`
  padding: 2rem;
  background: #f4f4f4;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  font-size: 1.1rem;
  color: #333;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  &:hover {
    background-color: #005bb5;
  }
`;

export default function PostEnquiryPage() {
  const [formData, setFormData] = useState({
    title: "",
    FirstName: "",
    LastName: "",
    EmailAddress: "",
    ContactNumber: "",
    Enquiry: "",
    Message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Enquiry submitted successfully!");
        setFormData({
          title: "",
          FirstName: "",
          LastName: "",
          EmailAddress: "",
          ContactNumber: "",
          Enquiry: "",
          Message: "",
        });
      } else {
        alert("Failed to submit enquiry");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
    }
  };

  return (
    <Container>
      <h1>Submit a New Enquiry</h1>
      <Form onSubmit={handleSubmit}>
        <Label>Title</Label>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <Label>First Name</Label>
        <Input
          type="text"
          name="FirstName"
          value={formData.FirstName}
          onChange={handleChange}
          required
        />

        <Label>Last Name</Label>
        <Input
          type="text"
          name="LastName"
          value={formData.LastName}
          onChange={handleChange}
          required
        />

        <Label>Email Address</Label>
        <Input
          type="email"
          name="EmailAddress"
          value={formData.EmailAddress}
          onChange={handleChange}
          required
        />

        <Label>Contact Number</Label>
        <Input
          type="tel"
          name="ContactNumber"
          value={formData.ContactNumber}
          onChange={handleChange}
          required
        />

        <Label>Enquiry</Label>
        <Input
          type="text"
          name="Enquiry"
          value={formData.Enquiry}
          onChange={handleChange}
          required
        />

        <Label>Message</Label>
        <TextArea
          name="Message"
          rows="4"
          value={formData.Message}
          onChange={handleChange}
          required
        />

        <Button type="submit">Submit Enquiry</Button>
      </Form>
    </Container>
  );
}
