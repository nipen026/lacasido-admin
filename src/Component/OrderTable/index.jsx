import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  TextField,
  TableSortLabel,
  Paper,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { GET_CONTACT_US } from "../../api/get";

const ContactTable = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    GET_CONTACT_US()
      .then((res) => {
        setContacts(res.data.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  /* ---------------- SORT ---------------- */
  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  /* ---------------- SEARCH + SORT ---------------- */
  const filteredData = useMemo(() => {
    return [...contacts]
      .filter((item) =>
        [item.name, item.email, item.phone, item.message]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "asc"
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at)
      );
  }, [contacts, search, sortOrder]);

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Contact Messages
        </Typography>
      </Box>

      {/* Search */}
      <Box mb={2}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search by name, email, phone or message"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>
              <TableSortLabel
                active
                direction={sortOrder}
                onClick={handleSortToggle}
              >
                Date
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredData.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.phone || "-"}</TableCell>
              <TableCell sx={{ maxWidth: 300 }}>
                <Typography variant="body2" noWrap>
                  {row.message}
                </Typography>
              </TableCell>
              <TableCell>
                {new Date(row.created_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}

          {!filteredData.length && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Footer */}
      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredData.length} entries
        </Typography>
      </Box>
    </Paper>
  );
};

export default ContactTable;

