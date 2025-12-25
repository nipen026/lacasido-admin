import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  CircularProgress,
  TextField,
  TableSortLabel,
  Stack,
} from "@mui/material";
import { MoreVertical } from "lucide-react";
import { GET_USERS } from "../../api/get";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await GET_USERS();
        setUsers(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter((user) => {
        const q = search.toLowerCase();
        return (
          user.name?.toLowerCase().includes(q) ||
          user.email?.toLowerCase().includes(q) ||
          user.phone?.includes(q) ||
          user.source?.toLowerCase().includes(q) ||
          user.product?.name?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) =>
        sortOrder === "asc"
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at)
      );
  }, [users, search, sortOrder]);

  const getFormattedDate = (date) =>
    new Date(date).toLocaleDateString("en-IN");

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Search */}
      <Stack direction="row" mb={2}>
        <TextField
          size="small"
          fullWidth
          label="Search by name, email, phone, product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Source</strong></TableCell>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Message</strong></TableCell>
              <TableCell sortDirection={false}>
                <TableSortLabel
                  active
                  direction={sortOrder}
                  onClick={handleSortToggle}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAndSortedUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "-"}</TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ textTransform: "capitalize" }}>
                    {user.source}
                  </Typography>
                </TableCell>
                <TableCell>{user.product?.name || "-"}</TableCell>
                <TableCell>{user.message}</TableCell>
                <TableCell>{getFormattedDate(user.created_at)}</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <MoreVertical size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {filteredAndSortedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={1}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {filteredAndSortedUsers.length} entries
          </Typography>
          <Pagination count={1} page={page} onChange={(e, val) => setPage(val)} />
        </Box>
      </TableContainer>
    </Box>
  );
}
