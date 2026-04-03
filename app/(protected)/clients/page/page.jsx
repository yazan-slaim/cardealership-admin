"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
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
} from "@mui/material";

/* ---------- styled wrappers ---------- */

const PageWrapper = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SearchWrapper = styled.div`
  margin-bottom: 16px;
`;

const TableWrapper = styled(Paper)`
  width: 100%;
  position: relative;
`;

/* ---------- page ---------- */

export default function Page() {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/client/getclients`,
        );
        const data = await res.json();
        console.log("Fetched clients:", res);
        setClients(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [searchQuery, orderBy, order]);

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

  return (
    <PageWrapper>
      <Header>
        <Typography variant="h5">Clients</Typography>
        <Button variant="contained">Add Client</Button>
      </Header>

      <SearchWrapper>
        <TextField
          fullWidth
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search by name, phone, or email"
          variant="outlined"
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
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === "fullName" ? order : false}>
                <TableSortLabel
                  active={orderBy === "fullName"}
                  direction={orderBy === "fullName" ? order : "asc"}
                  onClick={() => handleSort("fullName")}
                >
                  Name
                </TableSortLabel>
              </TableCell>

              <TableCell
                sortDirection={orderBy === "phoneNumber" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "phoneNumber"}
                  direction={orderBy === "phoneNumber" ? order : "asc"}
                  onClick={() => handleSort("phoneNumber")}
                >
                  Phone
                </TableSortLabel>
              </TableCell>

              <TableCell>Email</TableCell>
              <TableCell>Lead Source</TableCell>

              <TableCell
                sortDirection={orderBy === "createdAt" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderBy === "createdAt" ? order : "asc"}
                  onClick={() => handleSort("createdAt")}
                >
                  Created
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {clients.map((client) => (
              <TableRow hover key={client._id}>
                <TableCell>{client.fullName}</TableCell>
                <TableCell>{client.phoneNumber}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.leadSource}</TableCell>
                <TableCell>
                  {new Date(client.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageWrapper>
  );
}
