import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Plus, Trash } from "lucide-react";
import { GET_DROPDOWNS } from "../../api/get";
import { ADD_DROPDOWN } from "../../api/post";
import { DELETE_DROPDOWN } from "../../api/delete";

const Dropdowns = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    type: "",
    label: "",
  });

  /* ================= FETCH ================= */
  const fetchDropdowns = async () => {
    const res = await GET_DROPDOWNS();
    setRows(res.data?.data || []);
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await ADD_DROPDOWN(form);
    fetchDropdowns();
    setForm({ type: "", label: "" });
    setOpen(false);
  };
  const handleDeleteDropdown = async (id) => {
    await DELETE_DROPDOWN(id);
    fetchDropdowns();
  };
  return (
    <Box p={3}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Dropdown Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setOpen(true)}
        >
          Add Dropdown
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>
                    <IconButton type="error" onClick={() => handleDeleteDropdown(row.id)}>
                      <Trash  size={16} />
                    </IconButton>

                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ADD DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Dropdown</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            mt={2}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              select
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <MenuItem value="color">Color</MenuItem>
              <MenuItem value="size">Size</MenuItem>
              <MenuItem value="material">Material</MenuItem>
            </TextField>

            <TextField
              label="Label"
              name="label"
              value={form.label}
              onChange={handleChange}
              required
            />

            <Box textAlign="right">
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dropdowns;
