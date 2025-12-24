
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Stack,
  Pagination,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Plus,
  Filter,
  Eye,
  Pencil,
  Trash,
  Import,
  Search,
  LayoutList,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GET_PRODUCT } from '../../api/get';
import { DELETE_PRODUCT } from '../../api/delete';

const royalGreen = '#014421';
const white = '#ffffff';

const getFirstImage = (media = []) => {
  const img = media.find(m => m.type === 'image');
  return img?.url || '/placeholder.png';
};

const getStatusChipByStatus = (status) => {
  return status === 1
    ? <Chip label="Active" sx={{ bgcolor: '#d1fae5', color: royalGreen }} />
    : <Chip label="Inactive" sx={{ bgcolor: '#fee2e2', color: '#991b1b' }} />;
};


const ProductTable = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await GET_PRODUCT();
      setProducts(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    DELETE_PRODUCT(id).then((res) => {
      toast.success("Product deleted successfully");
      fetchProducts();
    }).catch((err) => {
      toast.error("Failed to delete product");
    });
  }
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>
          Products Management
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={() => navigate('/product-form')} startIcon={<Plus size={18} />} sx={{ bgcolor: royalGreen }}>
            Add New Product
          </Button>
          <Button variant="outlined" sx={{ color: royalGreen, borderColor: royalGreen }}>
            Export
          </Button>
          <Button variant="outlined" startIcon={<Import size={18} />} sx={{ color: royalGreen, borderColor: royalGreen }}>
            Import
          </Button>
          <IconButton><LayoutList size={20} /></IconButton>
        </Stack>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          placeholder="Search products..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300, bgcolor: white }}
        />
        <Button startIcon={<Filter size={18} />} variant="outlined" sx={{ color: royalGreen, borderColor: royalGreen }}>
          Filters
        </Button>
      </Box>

      {/* Product Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8f8f8' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Product Image</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Product Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>

                {/* Product Image */}
                <TableCell>
                  <img
                    src={getFirstImage(product.media)}
                    alt={product.name}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 4,
                      objectFit: 'cover',
                    }}
                  />
                </TableCell>

                {/* Product Name */}
                <TableCell>{product.name}</TableCell>

                {/* Product Type */}
                <TableCell>
                  <Typography>{product.design}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {product.material?.name}
                  </Typography>
                </TableCell>

                {/* Category */}
                <TableCell>
                  {product.category?.name}
                </TableCell>

                {/* Price */}
                <TableCell>₹{product.price}</TableCell>

                {/* Stock (Not Available) */}
                <TableCell>-</TableCell>

                {/* Status */}
                <TableCell>
                  {getStatusChipByStatus(product.status)}
                </TableCell>

                {/* Actions */}
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton onClick={() => navigate(`/productDetails/${product.id}`,{state: { product }})}>
                      <Eye size={16} />
                    </IconButton>

                    <IconButton onClick={() => navigate(`/product-form?id=${product.id}`,{state: { product }})}>
                      <Pencil size={16} />
                    </IconButton>

                    <IconButton onClick={() => handleDeleteProduct(product.id)}>
                      <Trash size={16} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>


        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
        <Typography>Showing {products.length} entries</Typography>
        <Pagination count={1} page={1} shape="rounded" color="primary" />
      </Box>
    </Box>
  );
};

export default ProductTable;
