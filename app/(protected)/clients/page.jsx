"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableSortLabel,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";

const PageWrapper = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SearchWrapper = styled.div`
  margin-bottom: 20px;
`;

const TableWrapper = styled(Paper)`
  width: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const ClickableRow = styled(TableRow)`
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f8fafc !important;
  }
`;

export default function Page() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/api/clients/getclients`,
        );
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [searchQuery]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(searchInput);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Client-side filtering
  const filteredClients = clients.filter(client => {
    const term = searchQuery.toLowerCase();
    return (
      client.fullName?.toLowerCase().includes(term) ||
      client.phoneNumber?.includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.leadSource?.toLowerCase().includes(term)
    );
  });

  // Client-side sorting
  const sortedClients = [...filteredClients].sort((a, b) => {
    let valA = a[orderBy];
    let valB = b[orderBy];

    if (orderBy === "createdAt") {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  const getTempColor = (temp) => {
    switch (temp?.toLowerCase()) {
      case "hot": return "error";
      case "warm": return "warning";
      case "cold": return "info";
      default: return "default";
    }
  };

  return (
    <PageWrapper>
      <Header>
        <Typography variant="h5" fontWeight="bold">Clients CRM</Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push("/clients/post")}
          sx={{ borderRadius: "8px", textTransform: "none" }}
        >
          Add Client
        </Button>
      </Header>

      <SearchWrapper>
        <TextField
          fullWidth
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search by name, phone, or email... (Press Enter)"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            }
          }}
        />
      </SearchWrapper>

      <TableContainer component={TableWrapper}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.6)",
              zIndex: 2,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Table>
          <TableHead sx={{ bgcolor: "#f1f5f9" }}>
            <TableRow>
              <TableCell sortDirection={orderBy === "fullName" ? order : false}>
                <TableSortLabel
                  active={orderBy === "fullName"}
                  direction={orderBy === "fullName" ? order : "asc"}
                  onClick={() => handleSort("fullName")}
                  style={{ fontWeight: "bold" }}
                >
                  Name
                </TableSortLabel>
              </TableCell>

              <TableCell sortDirection={orderBy === "phoneNumber" ? order : false}>
                <TableSortLabel
                  active={orderBy === "phoneNumber"}
                  direction={orderBy === "phoneNumber" ? order : "asc"}
                  onClick={() => handleSort("phoneNumber")}
                  style={{ fontWeight: "bold" }}
                >
                  Phone
                </TableSortLabel>
              </TableCell>

              <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Lead Source</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Temperature</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Tags</TableCell>

              <TableCell sortDirection={orderBy === "createdAt" ? order : false}>
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderBy === "createdAt" ? order : "asc"}
                  onClick={() => handleSort("createdAt")}
                  style={{ fontWeight: "bold" }}
                >
                  Created
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" style={{ color: "#64748b", fontStyle: "italic" }}>
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              sortedClients.map((client) => (
                <ClickableRow 
                  key={client._id}
                  onClick={() => router.push(`/clients/${client._id}`)}
                >
                  <TableCell style={{ fontWeight: 600 }}>{client.fullName}</TableCell>
                  <TableCell>{client.phoneNumber}</TableCell>
                  <TableCell>{client.email || "—"}</TableCell>
                  <TableCell>
                    <Chip label={client.leadSource || "Direct"} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={(client.temperature || "cold").toUpperCase()} 
                      color={getTempColor(client.temperature)}
                      size="small" 
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {(client.tags || []).map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" variant="filled" color="primary" />
                      ))}
                      {(!client.tags || client.tags.length === 0) && "—"}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(client.createdAt).toLocaleDateString()}
                  </TableCell>
                </ClickableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PageWrapper>
  );
}
