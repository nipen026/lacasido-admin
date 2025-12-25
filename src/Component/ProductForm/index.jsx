import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    IconButton,
} from "@mui/material";
import { UploadCloud, X } from "lucide-react";
import { toast } from "react-toastify";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import {
    GET_DROPDOWNS_BY_TYPE,
    GET_CATEGORY,
} from "../../api/get";
import { ADD_PRODUCT } from "../../api/post";
import { UPDATE_PRODUCT } from "../../api/put";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";



const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const ProductForm = () => {
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("id");
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;

    /* -------------------- FORM STATE -------------------- */
    const [form, setForm] = useState({
        name: "",
        category_id: "",
        color_id: "",
        material_id: "",
        diamond_type_id: "",
        size_id: "",
        design: "",
        weight: "",
        price: "",
        discount_type: "percentage",
        discount_value: "",
        indiamart_link: "",
        description: "", // ✅ added
    });


    const [images, setImages] = useState([]);

    /* -------------------- DROPDOWNS -------------------- */
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [diamondTypes, setDiamondTypes] = useState([]);
    const [sizes, setSizes] = useState([]);

    /* -------------------- FETCH DROPDOWNS -------------------- */
    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [
                    categoryRes,
                    colorRes,
                    materialRes,
                    diamondRes,
                    sizeRes,
                ] = await Promise.all([
                    GET_CATEGORY(),
                    GET_DROPDOWNS_BY_TYPE("color"),
                    GET_DROPDOWNS_BY_TYPE("material"),
                    GET_DROPDOWNS_BY_TYPE("diamond"),
                    GET_DROPDOWNS_BY_TYPE("size"),
                ]);

                setCategories(categoryRes.data?.data || []);
                setColors(colorRes.data?.data || []);
                setMaterials(materialRes.data?.data || []);
                setDiamondTypes(diamondRes.data?.data || []);
                setSizes(sizeRes.data?.data || []);
            } catch {
                toast.error("Failed to load dropdowns");
            }
        };

        fetchDropdowns();
    }, []);

    /* -------------------- EDIT MODE -------------------- */
    useEffect(() => {
        if (!editId || !product) return;

        setForm({
            name: product.name || "",
            category_id: product.category_id || "",
            color_id: product.color_id || "",
            material_id: product.material_id || "",
            diamond_type_id: product.diamond_type_id || "",
            size_id: product.size_id || "",
            design: product.design || "",
            weight: product.weight || "",
            price: product.price || "",
            discount_type: product.discount_type || "percentage",
            discount_value: product.discount_value || "",
            indiamart_link: product.indiamart_link || "",
            description: product.description || "", // ✅ added
        });
    }, [editId, product]);


    /* -------------------- HANDLERS -------------------- */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImages = (files) => {
        const valid = Array.from(files).filter((file) =>
            ACCEPTED_IMAGE_TYPES.includes(file.type)
        );
        setImages((prev) => [...prev, ...valid]);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    /* -------------------- SUBMIT -------------------- */
    const handleSubmit = async () => {
        const data = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            data.append(key, value);
        });

        images.forEach((img, i) => {
            data.append(`images[${i}]`, img);
        });

        try {
            editId ? await UPDATE_PRODUCT(editId, data) : await ADD_PRODUCT(data);
            toast.success(editId ? "Product updated" : "Product added");
            navigate("/product");
        } catch {
            toast.error("Something went wrong");
        }
    };

    /* -------------------- UI -------------------- */
    const renderSelect = (label, name, list) => (
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{label}</InputLabel>
            <Select name={name} value={form[name]} onChange={handleChange} label={label}>
                {list.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        {item.name || item.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    return (
        <Box p={3} bgcolor="#fff" borderRadius={2}>
            <Typography variant="h5" fontWeight={600} mb={3}>
                {editId ? "Edit Product" : "Add Product"}
            </Typography>

            <TextField label="Product Name" name="name" fullWidth value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField label="Design" name="design" fullWidth value={form.design} onChange={handleChange} sx={{ mb: 2 }} />

            {renderSelect("Category", "category_id", categories)}
            {renderSelect("Color", "color_id", colors)}
            {renderSelect("Material", "material_id", materials)}
            {renderSelect("Diamond Type", "diamond_type_id", diamondTypes)}
            {renderSelect("Size", "size_id", sizes)}

            <TextField label="Weight (gm)" name="weight" type="number" fullWidth value={form.weight} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField label="Price" name="price" type="number" fullWidth value={form.price} onChange={handleChange} sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Discount Type</InputLabel>
                <Select name="discount_type" value={form.discount_type} onChange={handleChange} label="Discount Type">
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
            </FormControl>

            <TextField label="Discount Value" name="discount_value" type="number" fullWidth value={form.discount_value} onChange={handleChange} sx={{ mb: 2 }} />

            <Box mb={2}>
                <Typography fontWeight={600} mb={1}>
                    Description
                </Typography>

                <SunEditor
                    setContents={form.description}
                    onChange={(content) =>
                        setForm((prev) => ({ ...prev, description: content }))
                    }
                    setOptions={{
                        height: 200,
                        buttonList: [
                            ["undo", "redo"],
                            ["bold", "italic", "underline"],
                            ["fontSize", "formatBlock"],
                            ["align", "list"],
                            ["link", "image"],
                            ["removeFormat"],
                        ],
                    }}
                />
            </Box>


            {/* IMAGES */}
            <Typography fontWeight={600}>Images</Typography>
            <label htmlFor="image-upload">
                <Box border="2px dashed #aaa" p={2} mt={1} textAlign="center" sx={{ cursor: "pointer" }}>
                    <UploadCloud />
                    <Typography variant="body2">Click to upload images</Typography>
                </Box>
            </label>

            <input id="image-upload" type="file" hidden multiple accept="image/*" onChange={(e) => handleImages(e.target.files)} />

            <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                {images.map((img, idx) => (
                    <Box key={idx} position="relative">
                        <img src={URL.createObjectURL(img)} width={80} height={80} style={{ borderRadius: 8 }} />
                        <IconButton size="small" onClick={() => removeImage(idx)} sx={{ position: "absolute", top: 0, right: 0, bgcolor: "#fff" }}>
                            <X size={14} />
                        </IconButton>
                    </Box>
                ))}
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button variant="contained" onClick={handleSubmit}>
                    {editId ? "Update Product" : "Save Product"}
                </Button>
            </Box>
        </Box>
    );
};

export default ProductForm;
