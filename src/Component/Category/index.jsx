import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Collapse,
  Stack,
} from "@mui/material";
import {
  UploadCloud,
  Trash2,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Pencil,
} from "lucide-react";
import { GET_CATEGORY } from "../../api/get";
import { ADD_CATEGORY } from "../../api/post";
import { DELETE_CATEGORY } from "../../api/delete";
import { UPDATE_CATEGORY } from "../../api/put";

const Category = () => {
  const [rows, setRows] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  /* dialog */
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [subCategory,setSubCategory] = useState(false)

  /* form */
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const [parentId, setParentId] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await GET_CATEGORY();
    setRows(res.data?.data || []);
  };

  /* ---------- Dialog helpers ---------- */
  const resetForm = () => {
    setName("");
    setStatus(1);
    setParentId(null);
    setImages([]);
    setPreviews([]);
    setIsEdit(false);
    setEditId(null);
  };

  const openAddCategory = (parent = null) => {
    resetForm();
    setParentId(parent);
    setOpen(true);
  };
  const openAddSubCategory = (parent = null) => {
    resetForm();
    setParentId(parent);
    setSubCategory(true);
    setOpen(true);
  };

  const openEditCategory = (row) => {
    setIsEdit(true);
    setEditId(row.id);
    setName(row.name);
    setStatus(row.status);
    setParentId(row.parent_id || null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
    setSubCategory(false);
  };

  /* ---------- Image ---------- */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("status", status);
    if (parentId) formData.append("parent_id", parentId);

    images.forEach((img) => formData.append("image", img));
    if (!isEdit) {
      await ADD_CATEGORY(formData);
    }else{
      await UPDATE_CATEGORY(editId,formData);
    }
    fetchData();
    handleClose();
  };

  /* ---------- Delete ---------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await DELETE_CATEGORY(id);
    fetchData();
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Category Management
        </Typography>
        <Button variant="contained" startIcon={<Plus />} onClick={() => openAddCategory()}>
          Add Category
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <React.Fragment key={row.id}>
                {/* PARENT */}
                <TableRow>
                  <TableCell>
                    {row.subcategories?.length > 0 && (
                      <IconButton
                        size="small"
                        onClick={() =>
                          setExpandedRow(expandedRow === row.id ? null : row.id)
                        }
                      >
                        {expandedRow === row.id ? <ChevronUp /> : <ChevronDown />}
                      </IconButton>
                    )}
                  </TableCell>

                  <TableCell>
                    {row.image_url && <img src={row.image_url} height={40} />}
                  </TableCell>

                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.status ? "Active" : "Inactive"}</TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton onClick={() => openAddSubCategory(row.id)}>
                        <Plus size={16} />
                      </IconButton>
                      <IconButton onClick={() => openEditCategory(row)}>
                        <Pencil size={16} />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(row.id)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>

                {/* SUBCATEGORIES */}
                <TableRow>
                  <TableCell colSpan={5} sx={{ p: 0 }}>
                    <Collapse in={expandedRow === row.id} unmountOnExit>
                      <Box m={2}>
                        <Typography fontWeight="bold" mb={1}>
                          Sub Categories
                        </Typography>

                        <Table size="small">
                          <TableBody>
                            {row.subcategories.map((sub) => (
                              <TableRow key={sub.id}>
                                <TableCell>
                                  {sub.image_url && <img src={sub.image_url} height={30} />}
                                </TableCell>
                                <TableCell>{sub.name}</TableCell>
                                <TableCell>{sub.status ? "Active" : "Inactive"}</TableCell>
                                <TableCell align="right">
                                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <IconButton onClick={() => openEditCategory(sub)}>
                                      <Pencil size={14} />
                                    </IconButton>
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDelete(sub.id)}
                                    >
                                      <Trash2 size={14} />
                                    </IconButton>
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ADD / EDIT DIALOG */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? "Edit Category" : subCategory ? "Add Sub Category" : "Add Category"}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} mt={2} display="flex" flexDirection="column" gap={2}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />

            <TextField select label="Status" value={status} onChange={(e) => setStatus(+e.target.value)}>
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </TextField>

            <Button variant="outlined" component="label" startIcon={<UploadCloud />}>
              Upload Images
              <input hidden type="file" multiple accept="image/*" onChange={handleImageChange} />
            </Button>

            <Box display="flex" gap={2} flexWrap="wrap">
              {previews.map((src, i) => (
                <Box key={i} position="relative">
                  <img src={src} width={90} height={90} style={{ borderRadius: 8 }} />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(i)}
                    sx={{ position: "absolute", top: -8, right: -8, bgcolor: "#fff" }}
                  >
                    <X size={14} />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Button type="submit" variant="contained">
              {isEdit ? "Update" : "Save"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Category;
