"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Typography,
  Grid,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // ✅ missing import

export default function SaleDialog({
  open,
  onClose,
  car,                 // {_id, title, price, images?}
  buyerPrefill,        // { id, name, email, phone, address? }
  onSaved,
  postUrl = "/api/madesale",
  uploadUrl = "/api/uploadMultipleFiles",
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const [form, setForm] = useState({
    carTitle: "",
    salePrice: "",
    paymentMethod: "Cash", // ✅ default matches schema enum
    downPayment: "",
    interestAPR: "",       // ✅ use schema field name
    adminNotes: "",
    buyer: {
      name: "",
      contactInfo: {
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
        },
      },
    },
  });

  useEffect(() => {
    if (!open) return;
    setForm((prev) => ({
      ...prev,
      carTitle: car?.title || prev.carTitle || "",
      salePrice: car?.price != null ? String(car.price) : prev.salePrice || "",
      paymentMethod: prev.paymentMethod || "Cash",
      buyer: {
        name: buyerPrefill?.name || prev.buyer.name || "",
        contactInfo: {
          email: buyerPrefill?.email || prev.buyer.contactInfo.email || "",
          phone: buyerPrefill?.phone || prev.buyer.contactInfo.phone || "",
          address: {
            street:
              buyerPrefill?.address?.street ||
              prev.buyer.contactInfo.address.street ||
              "",
            city:
              buyerPrefill?.address?.city ||
              prev.buyer.contactInfo.address.city ||
              "",
            state:
              buyerPrefill?.address?.state ||
              prev.buyer.contactInfo.address.state ||
              "",
            postalCode:
              buyerPrefill?.address?.postalCode ||
              prev.buyer.contactInfo.address.postalCode ||
              "",
          },
        },
      },
    }));
    setAttachments([]);
  }, [open, car, buyerPrefill]);

  const financed = form.paymentMethod === "Financed";
  const carImg = useMemo(() => car?.images?.[0], [car]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function updateBuyer(path, value) {
    setForm((f) => {
      const copy = JSON.parse(JSON.stringify(f));
      let cur = copy.buyer;
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
      cur[path[path.length - 1]] = value;
      return copy;
    });
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploading(true);
      const fd = new FormData();
      files.forEach((file) => fd.append("file", file));
      const res = await fetch(uploadUrl, { method: "POST", body: fd });
      const data = await res.json();
      const links = data?.links ?? [];
      setAttachments((prev) => [...prev, ...links]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!car?._id) return;

    if (!form.salePrice || !form.paymentMethod) {
      alert("Sale price and payment method are required.");
      return;
    }
    if (financed && (!form.downPayment || !form.interestAPR)) {
      alert("Down payment and interest APR are required for financed sales.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        carId: car._id,
        sale: {
          carTitle: form.carTitle,
          salePrice: Number(form.salePrice),
          paymentMethod: form.paymentMethod,       // "Cash" | "Financed" | "Lease"
          downPayment: financed ? Number(form.downPayment || 0) : undefined,
          interestAPR: financed ? Number(form.interestAPR || 0) : undefined, // ✅ schema field
          buyer: form.buyer,
          adminNotes: form.adminNotes,
          documents: attachments.map((url) => ({
            docType: "Other",
            fileURL: url,
          })),
        },
        buyerId: buyerPrefill?.id,
      };

      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅ ensure JSON body is parsed
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Sale save failed:", data);
        alert(data?.message || "Failed to save sale");
        return;
      }
      onSaved && onSaved(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Unexpected error while saving the sale.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          ...(fullScreen ? { height: "100vh" } : { maxHeight: "90vh" }),
          display: "flex",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {car?.title ? `Enter Sale — ${car.title}` : "Enter Sale"}
      </DialogTitle>

      <DialogContent dividers sx={{ overflowY: "auto", pt: 2 }}>
        {carImg && (
          <img
            src={carImg}
            alt={car?.title || "car"}
            style={{
              width: "100%",
              height: fullScreen ? 140 : 180,
              objectFit: "cover",
              borderRadius: 8,
              marginBottom: 12,
            }}
          />
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Car Title"
              fullWidth
              value={form.carTitle}
              onChange={(e) => update("carTitle", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Sale Price"
              type="number"
              fullWidth
              value={form.salePrice}
              onChange={(e) => update("salePrice", e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="pmethod">Payment Method</InputLabel>
              <Select
                labelId="pmethod"
                label="Payment Method"
                value={form.paymentMethod}
                onChange={(e) => update("paymentMethod", e.target.value)}
              >
                <MenuItem value="Cash">Cash</MenuItem>          {/* ✅ schema value */}
                <MenuItem value="Financed">Financed</MenuItem>
                <MenuItem value="Lease">Lease</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {financed && (
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Down Payment"
                  type="number"
                  fullWidth
                  value={form.downPayment}
                  onChange={(e) => update("downPayment", e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Interest APR (%)"
                  type="number"
                  fullWidth
                  value={form.interestAPR}
                  onChange={(e) => update("interestAPR", e.target.value)}
                  inputProps={{ min: 0, max: 100, step: "0.01" }}
                />
              </Grid>
            </>
          )}
        </Grid>

        <Accordion defaultExpanded={!fullScreen} sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Buyer Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  value={form.buyer.name}
                  onChange={(e) => updateBuyer(["name"], e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={form.buyer.contactInfo.email}
                  onChange={(e) =>
                    updateBuyer(["contactInfo", "email"], e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Phone"
                  type="tel"
                  fullWidth
                  value={form.buyer.contactInfo.phone}
                  onChange={(e) =>
                    updateBuyer(["contactInfo", "phone"], e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Street"
                  fullWidth
                  value={form.buyer.contactInfo.address.street}
                  onChange={(e) =>
                    updateBuyer(["contactInfo", "address", "street"], e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="City"
                  fullWidth
                  value={form.buyer.contactInfo.address.city}
                  onChange={(e) =>
                    updateBuyer(["contactInfo", "address", "city"], e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6} sm={1.5}>
                <TextField
                  label="State"
                  fullWidth
                  value={form.buyer.contactInfo.address.state}
                  onChange={(e) =>
                    updateBuyer(["contactInfo", "address", "state"], e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6} sm={1.5}>
                <TextField
                  label="Postal"
                  fullWidth
                  value={form.buyer.contactInfo.address.postalCode}
                  onChange={(e) =>
                    updateBuyer(
                      ["contactInfo", "address", "postalCode"],
                      e.target.value
                    )
                  }
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={7}>
            <TextField
              label="Admin Notes"
              fullWidth
              multiline
              minRows={fullScreen ? 2 : 3}
              value={form.adminNotes}
              onChange={(e) => update("adminNotes", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={5}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Attachments
            </Typography>
            <Button
              component="label"
              variant="outlined"
              disabled={uploading}
              fullWidth
            >
              {uploading ? "Uploading…" : "Upload file(s)"}
              <input type="file" hidden onChange={handleUpload} multiple />
            </Button>
            {!!attachments.length && (
              <Box
                sx={{
                  mt: 1,
                  maxHeight: 120,
                  overflowY: "auto",
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1,
                  fontSize: 12,
                }}
              >
                {attachments.map((u, i) => (
                  <div key={u + i} style={{ wordBreak: "break-all" }}>
                    {u}
                  </div>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          position: fullScreen ? "sticky" : "static",
          bottom: 0,
          bgcolor: fullScreen ? "background.paper" : "transparent",
          borderTop: fullScreen ? "1px solid" : "none",
          borderColor: "divider",
        }}
      >
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
