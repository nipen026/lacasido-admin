import React, { useEffect, useMemo, useState } from "react";
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
  MenuItem,
} from "@mui/material";
import {
  Plus,
  Eye,
  Pencil,
  Trash,
  Import,
  Search,
  LayoutList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_PRODUCT } from "../../api/get";
import { DELETE_PRODUCT } from "../../api/delete";

const royalGreen = "#014421";

const getFirstImage = (media = []) =>
  media.find((m) => m.type === "image")?.url || "/placeholder.png";

const getStatusChipByStatus = (status) =>
  status === 1 ? (
    <Chip label="Active" sx={{ bgcolor: "#d1fae5", color: royalGreen }} />
  ) : (
    <Chip label="Inactive" sx={{ bgcolor: "#fee2e2", color: "#991b1b" }} />
  );

const PAGE_SIZE_OPTIONS = [25, 50, 100];

const ProductTable = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const fetchProducts = async () => {
    try {
      const res = await GET_PRODUCT();
      setProducts(res.data.data || []);
    } catch {
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
    try {
      await DELETE_PRODUCT(id);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  /* ---------- Search ---------- */
  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q) ||
        p.material?.name?.toLowerCase().includes(q)
    );
  }, [products, search]);

  /* ---------- Pagination ---------- */
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, page, rowsPerPage]);

  const from = (page - 1) * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage, filteredProducts.length);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={2} display="flex" justifyContent="space-between">
        <Typography variant="h6" fontWeight={600}>
          Products Management
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            onClick={() => navigate("/product-form")}
            startIcon={<Plus size={18} />}
            sx={{ bgcolor: royalGreen }}
          >
            Add Product
          </Button>
        </Stack>
      </Box>

      {/* Search + Page Size */}
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          size="small"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />

        <TextField
          size="small"
          select
          label="Rows"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
          sx={{ width: 120 }}
        >
          {PAGE_SIZE_OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
          <MenuItem value={9999}>All</MenuItem>
        </TextField>

        <TextField
          size="small"
          type="number"
          label="Custom"
          placeholder="Any number"
          onBlur={(e) => {
            const val = Number(e.target.value);
            if (val > 0) {
              setRowsPerPage(val);
              setPage(1);
            }
          }}
          sx={{ width: 140 }}
        />
      </Stack>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8f8f8" }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedProducts.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{from + index}</TableCell>
                <TableCell>
                  <img src={getFirstImage(product.media)} width={50} height={50} />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <Typography>{product.design}</Typography>
                  <Typography variant="caption">{product.material?.name}</Typography>
                </TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>{getStatusChipByStatus(product.status)}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => navigate(`/productDetails/${product.id}`, { state: { product } })}>
                      <Eye size={16} />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/product-form?id=${product.id}`, { state: { product } })}>
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteProduct(product.id)}>
                      <Trash size={16} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {paginatedProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Footer */}
      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography fontSize={14}>
          Showing {from}-{to} of {filteredProducts.length} entries
        </Typography>

        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, val) => setPage(val)}
          shape="rounded"
        />
      </Box>
    </Box>
  );
};

export default ProductTable;
