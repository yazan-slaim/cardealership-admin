"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";

/* ---------- styled wrappers ---------- */

const PageWrapper = styled.div`
  padding: 24px;
  max-width: 700px;
  margin: 0 auto;
`;

const FormWrapper = styled(Paper)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* ---------- page ---------- */

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    leadSource: "",
    preferredContactMethod: "phone",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/democlients/createclient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create client");

      router.push("/clients"); // change path if needed
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Create Client
      </Typography>

      <FormWrapper component="form" onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          required
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />

        <TextField
          label="Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <TextField
          label="Phone Number"
          required
          value={form.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
        />

        <TextField
          label="Lead Source"
          value={form.leadSource}
          onChange={(e) => handleChange("leadSource", e.target.value)}
        />

        <TextField
          select
          label="Preferred Contact Method"
          value={form.preferredContactMethod}
          onChange={(e) =>
            handleChange("preferredContactMethod", e.target.value)
          }
        >
          <MenuItem value="phone">Phone</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="whatsapp">WhatsApp</MenuItem>
        </TextField>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Address
        </Typography>

        <TextField
          label="Street"
          value={form.address.street}
          onChange={(e) => handleAddressChange("street", e.target.value)}
        />

        <TextField
          label="City"
          value={form.address.city}
          onChange={(e) => handleAddressChange("city", e.target.value)}
        />

        <TextField
          label="State"
          value={form.address.state}
          onChange={(e) => handleAddressChange("state", e.target.value)}
        />

        <TextField
          label="Postal Code"
          value={form.address.postalCode}
          onChange={(e) => handleAddressChange("postalCode", e.target.value)}
        />

        <TextField
          label="Country"
          value={form.address.country}
          onChange={(e) => handleAddressChange("country", e.target.value)}
        />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={20} /> : "Create Client"}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </FormWrapper>
    </PageWrapper>
  );
}
