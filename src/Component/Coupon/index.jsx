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
  Stack,
} from "@mui/material";
import { Plus, Trash, Pencil } from "lucide-react";

import { GET_DROPDOWNS, GET_DROPDOWNS_BY_TYPE } from "../../api/get";
import { ADD_DROPDOWN } from "../../api/post";
import { DELETE_DROPDOWN } from "../../api/delete";
import { UPDATE_DROPDOWN } from "../../api/put";

const Dropdowns = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  /* edit */
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  /* filters */
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");

  /* form */
  const [form, setForm] = useState({
    type: "",
    label: "",
  });

  /* ================= FETCH ================= */
  const fetchDropdowns = async (selectedType = type) => {
    const res = selectedType !== 'all' ? await GET_DROPDOWNS_BY_TYPE(selectedType) : await GET_DROPDOWNS(selectedType);
    setRows(res.data?.data || []);
  };

  useEffect(() => {
    fetchDropdowns(type);
  }, [type]);

  /* ================= SEARCH ================= */
  const filteredRows = rows.filter((row) =>
    row.label.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddDialog = () => {
    setIsEdit(false);
    setEditId(null);
    setForm({ type: type, label: "" });
    setOpen(true);
  };

  const openEditDialog = (row) => {
    setIsEdit(true);
    setEditId(row.id);
    setForm({
      type: row.type,
      label: row.label,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setEditId(null);
    setForm({ type: "", label: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
    };
    if (!isEdit) {
      await ADD_DROPDOWN(payload);
    }
    else{
      await UPDATE_DROPDOWN(editId,payload);
    }
    fetchDropdowns(type);
    handleClose();
  };

  const handleDeleteDropdown = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await DELETE_DROPDOWN(id);
    fetchDropdowns(type);
  };

  return (
    <Box p={3}>
      {/* HEADER */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Dropdown Management
      </Typography>

      {/* FILTER BAR */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            select
            label="Filter by Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            sx={{ width: 220 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="color">Color</MenuItem>
            <MenuItem value="size">Size</MenuItem>
            <MenuItem value="material">Material</MenuItem>
            <MenuItem value="diamond">Diamond</MenuItem>
          </TextField>

          <TextField
            label="Search by Label"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            sx={{padding:'0px 30px'}}
            startIcon={<Plus size={18} />}
            onClick={openAddDialog}
          >
            Dropdown
          </Button>
        </Stack>
      </Paper>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Label</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.length ? (
              filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.label}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton onClick={() => openEditDialog(row)}>
                        <Pencil size={16} />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteDropdown(row.id)}
                      >
                        <Trash size={16} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ADD / EDIT DIALOG */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEdit ? "Edit Dropdown" : "Add Dropdown"}
        </DialogTitle>
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
              <MenuItem value="diamond">Diamond</MenuItem>
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
                {isEdit ? "Update" : "Save"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dropdowns;
