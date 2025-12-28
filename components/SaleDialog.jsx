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
  Modal,
} from "@mui/material";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";

export default function SaleDialog({
  open,
  onClose,
  car,                 // {_id, title, price, images?}
  client,              // { id/_id, name/fullName, email, phone/phoneNumber }
  agentid,             // Employee _id for SoldCar.agent
  onSaved,
  postUrl = "/api/madesale",
  uploadUrl = "/api/files/client/upload", // 👈 uses your Azure route
  deleteUrl = "/api/files/delete-file",   // optional delete
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Black primary just for this dialog
  const saleTheme = React.useMemo(
    () =>
      createTheme({
        palette: { primary: { main: "#000000" } },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#00000026" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00000026" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00000026" },
                "& .MuiSvgIcon-root": { color: "#00000026" },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: { color: "#0000006c" },
              shrink: { color: "#000" },
            },
          },
          MuiSelect: { styleOverrides: { icon: { color: "#000" } } },
          MuiButton: {
            styleOverrides: {
              containedPrimary: { backgroundColor: "#000", "&:hover": { backgroundColor: "#111" } },
              outlinedPrimary: {
                color: "#000",
                borderColor: "#000",
                "&:hover": { borderColor: "#000", backgroundColor: "rgba(0,0,0,0.04)" },
              },
              textPrimary: { color: "#000" },
            },
          },
        },
      }),
    []
  );

  const [saving, setSaving] = useState(false);

  // Sale docs (File docs returned from Azure route)
  const [saleDocs, setSaleDocs] = useState([]); // array of { _id, name, url, fileType, ... }
  const [uploading, setUploading] = useState(false);

  // Upload modal state (same pattern as your client files form)
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [fileForm, setFileForm] = useState({
    name: "",
    fileType: "agreement",
    description: "",
    file: null,
  });
  const fileTypes = ["agreement", "finance", "receipt", "id", "income", "other"];

  const [form, setForm] = useState({
    carTitle: "",
    salePrice: "",
    paymentMethod: "Cash", // "Cash" | "Financed" | "Lease"
    downPayment: "",
    interestAPR: "",
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
    setForm(prev => ({
      ...prev,
      carTitle: car?.title || prev.carTitle || "",
      salePrice: car?.price != null ? String(car.price) : prev.salePrice || "",
      buyer: {
        ...prev.buyer,
        name: client?.name || client?.fullName || prev.buyer.name || "",
        contactInfo: {
          ...prev.buyer.contactInfo,
          email: client?.email || prev.buyer.contactInfo.email || "",
          phone: client?.phone || client?.phoneNumber || prev.buyer.contactInfo.phone || "",
          // address stays editable here
        },
      },
    }));
    setSaleDocs([]);
    setFileForm({ name: "", fileType: "agreement", description: "", file: null });
  }, [open, car, client]);

  const financed = form.paymentMethod === "Financed";
  const carImg = useMemo(() => car?.images?.[0], [car]);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }
  function updateBuyer(path, value) {
    setForm(f => {
      const copy = JSON.parse(JSON.stringify(f));
      let cur = copy.buyer;
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
      cur[path[path.length - 1]] = value;
      return copy;
    });
  }

  async function handleSaveFile() {
    try {
      if (!fileForm.file || !fileForm.name) return;
      if (!client?.id && !client?._id) {
        alert("Missing client id for upload.");
        return;
      }
      setUploading(true);

      const fd = new FormData();
      fd.append("file", fileForm.file);
      fd.append("name", fileForm.name);
      fd.append("fileType", fileForm.fileType);
      fd.append("clientId", client.id || client._id);
      if (agentid) fd.append("uploadedBy", agentid);
      if (fileForm.description) fd.append("description", fileForm.description);

      const res = await fetch(uploadUrl, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Upload failed");

      // Add the File doc to sale docs list
      setSaleDocs(prev => [...prev, data.file]);
      setFileForm({ name: "", fileType: "agreement", description: "", file: null });
      setFileModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveFile(index) {
    try {
      const f = saleDocs[index];
      if (!f?._id) {
        setSaleDocs(prev => prev.filter((_, i) => i !== index));
        return;
      }
      // Optional: delete from storage & DB
      const res = await fetch(deleteUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: f._id, clientId: client.id || client._id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Delete failed");

      setSaleDocs(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Delete file failed:", err);
      // fallback: still remove locally if you prefer
      // setSaleDocs(prev => prev.filter((_, i) => i !== index));
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
    if (!client?.id && !client?._id) {
      alert("Buyer (client) id missing.");
      return;
    }
    if (!agentid) {
      alert("Agent id missing.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        carId: car._id,
        buyerId: client.id || client._id,
        agentId: agentid,
        sale: {
          carTitle: form.carTitle,
          salePrice: Number(form.salePrice),
          paymentMethod: form.paymentMethod,
          downPayment: financed ? Number(form.downPayment || 0) : undefined,
          interestAPR: financed ? Number(form.interestAPR || 0) : undefined,
          adminNotes: form.adminNotes,
        },
        documents: saleDocs.map(d => d._id), // 👈 send File ObjectIds
      };

      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <ThemeProvider theme={saleTheme}>
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
                  <MenuItem value="Cash">Cash</MenuItem>
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
            <AccordionSummary expandIcon={<Box sx={{ fontSize: 18, lineHeight: 1 }}>▼</Box>}>
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
                    onChange={(e) => updateBuyer(["contactInfo", "email"], e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Phone"
                    type="tel"
                    fullWidth
                    value={form.buyer.contactInfo.phone}
                    onChange={(e) => updateBuyer(["contactInfo", "phone"], e.target.value)}
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
                      updateBuyer(["contactInfo", "address", "postalCode"], e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* SALE DOCUMENTS (form like client uploader) */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
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
                Sale Documents
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                color="primary"
                onClick={() => setFileModalOpen(true)}
              >
                Add Document
              </Button>

              {!!saleDocs.length && (
                <Box
                  sx={{
                    mt: 1,
                    maxHeight: 160,
                    overflowY: "auto",
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 1,
                    fontSize: 12,
                  }}
                >
                  {saleDocs.map((d, i) => (
                    <Box
                      key={d._id || d.url || i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        mb: 0.5,
                        wordBreak: "break-all",
                      }}
                    >
                      <span>
                        <strong>{d.name}</strong> <em>({d.fileType})</em>
                      </span>
                      <span style={{ display: "flex", gap: 8 }}>
                        {d.url && (
                          <a href={d.url} target="_blank" rel="noreferrer">
                            <Button size="small" color="primary">Open</Button>
                          </a>
                        )}
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => handleRemoveFile(i)}
                        >
                          Remove
                        </Button>
                      </span>
                    </Box>
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
          <Button onClick={onClose} color="primary" disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* FILE UPLOAD MODAL (same UX as client files) */}
      <Modal open={fileModalOpen} onClose={() => setFileModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            color: "black",
            border: "2px solid #000",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Add Sale Document
          </Typography>

          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            This uploads to the client’s file list, then links the file to this sale.
          </Typography>

          <Box sx={{ mt: 2, display: "grid", gap: 1.5 }}>
            <TextField
              label="File Name"
              size="small"
              value={fileForm.name}
              onChange={(e) => setFileForm(f => ({ ...f, name: e.target.value }))}
              InputProps={{ style: { color: "black" } }}
            />

            <FormControl size="small">
              <InputLabel id="ftype">File Type</InputLabel>
              <Select
                labelId="ftype"
                label="File Type"
                value={fileForm.fileType}
                onChange={(e) => setFileForm(f => ({ ...f, fileType: e.target.value }))}
              >
                {fileTypes.map(t => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description (optional)"
              size="small"
              value={fileForm.description}
              onChange={(e) => setFileForm(f => ({ ...f, description: e.target.value }))}
              InputProps={{ style: { color: "black" } }}
            />

            <input
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFileForm(prev => ({
                  ...prev,
                  file: f || null,
                  name: prev.name || (f?.name ?? ""),
                }));
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
              <Button onClick={() => setFileModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveFile} disabled={uploading} variant="contained">
                {uploading ? "Uploading…" : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}
