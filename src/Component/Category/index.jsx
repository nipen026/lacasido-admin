import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, TextField, MenuItem,
  Collapse
} from '@mui/material';
import {
  UploadCloud, Trash2, Eye, Plus, X,
  ChevronDown, ChevronUp
} from 'lucide-react';
import axios from 'axios';
import { GET_CATEGORY } from '../../api/get';
import { ADD_CATEGORY } from '../../api/post';
import { DELETE_CATEGORY } from '../../api/delete';

const Category = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  // form fields
  const [name, setName] = useState('');
  const [status, setStatus] = useState(1);
  const [parentId, setParentId] = useState(null);

  // image states
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const fetchData = async () => {
    const res = await GET_CATEGORY();
    setRows(res.data?.data || []);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setStatus(1);
    setParentId(null);
    setImages([]);
    setPreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('status', status);
    if (parentId) formData.append('parent_id', parentId);

    images.forEach(img => formData.append('images[]', img));

    await ADD_CATEGORY(formData);
    fetchData();
    handleClose();
  };
  const handleDeleteSubcategory = (id) =>{
    // Call API to delete subcategory
    DELETE_CATEGORY(id)
    .then(res => {
      fetchData();
    })
    .catch(err => {
      console.error(err);
    });
  }
  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight="bold">Category Management</Typography>
        <Button variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)}>
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
            {rows.map(row => (
              <React.Fragment key={row.id}>
                {/* PARENT ROW */}
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
                    {row.image_url && (
                      <img src={row.image_url} height={40} alt="" />
                    )}
                  </TableCell>

                  <TableCell>{row.name}</TableCell>

                  <TableCell>
                    {row.status === 1 ? 'Active' : 'Inactive'}
                  </TableCell>

                  <TableCell align="right">
                    <IconButton color="error" onClick={() => handleDeleteSubcategory(row.id)}><Trash2 size={18} /></IconButton>
                  </TableCell>
                </TableRow>

                {/* SUBCATEGORY DROPDOWN */}
                <TableRow>
                  <TableCell colSpan={5} sx={{ p: 0 }}>
                    <Collapse in={expandedRow === row.id} timeout="auto" unmountOnExit>
                      <Box m={2}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                          Sub Categories
                        </Typography>

                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Image</TableCell>
                              <TableCell>Name</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {row.subcategories.map(sub => (
                              <TableRow key={sub.id}>
                                <TableCell>
                                  {sub.image_url && (
                                    <img src={sub.image_url} height={30} alt="" />
                                  )}
                                </TableCell>
                                <TableCell>{sub.name}</TableCell>
                                <TableCell>
                                  {sub.status === 1 ? 'Active' : 'Inactive'}
                                </TableCell>
                              
                              </TableRow>
                            ))}

                            {row.subcategories.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} align="center">
                                  No subcategories
                                </TableCell>
                              </TableRow>
                            )}
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

      {/* ADD CATEGORY DIALOG */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} mt={2} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <TextField
              label="Parent Id"
              value={parentId || ''}
              onChange={e => setParentId(e.target.value)}
              required
            />

            <TextField
              select
              label="Status"
              value={status}
              onChange={e => setStatus(Number(e.target.value))}
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </TextField>

            <Button variant="outlined" component="label" startIcon={<UploadCloud />}>
              Upload Images
              <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
            </Button>

            {/* IMAGE PREVIEW */}
            <Box display="flex" gap={2} flexWrap="wrap">
              {previews.map((src, i) => (
                <Box key={i} position="relative">
                  <img src={src} width={100} height={100} style={{ borderRadius: 8 }} />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(i)}
                    sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#fff' }}
                  >
                    <X size={14} />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Button type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Category;
