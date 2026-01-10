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
import { DELETE_PRODUCT_MEDIA, DELETE_PRODUCT_MEDIA_VIDEO } from "../../api/delete";



const ACCEPTED_MEDIA_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/ogg",
];


const ProductForm = () => {
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("id");
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;
    console.log(product, "product");

    /* -------------------- FORM STATE -------------------- */
    const [form, setForm] = useState({
        name: "",
        category_id: "",       // ✅ FINAL (subcategory ID)
        parent_category_id: "",// ✅ UI only
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
        description: "",
        trending:0,
    });



    const [images, setImages] = useState([]);

    /* -------------------- DROPDOWNS -------------------- */
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [diamondTypes, setDiamondTypes] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [existingMedia, setExistingMedia] = useState([]);
    const [removedMediaIds, setRemovedMediaIds] = useState([]);
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
            color_id: product.color_id || "",
            parent_category_id: product.category?.parent_id || "", // ✅ UI only
            category_id: product.category?.id || "", // ✅ UI only
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
            trending: product.trending || "", // ✅ added
        });
        setExistingMedia(product.media || []);
    }, [editId, product]);


    /* -------------------- HANDLERS -------------------- */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleParentCategoryChange = (e) => {
        const parentId = e.target.value;

        setForm((prev) => ({
            ...prev,
            parent_category_id: parentId,
            category_id: "", // reset subcategory
        }));
    };

    const handleSubCategoryChange = (e) => {
        setForm((prev) => ({
            ...prev,
            category_id: e.target.value, // ✅ ONLY subcategory ID
        }));
    };

    const handleMedia = (files) => {
        const valid = Array.from(files).filter((file) =>
            ACCEPTED_MEDIA_TYPES.includes(file.type)
        );

        setImages((prev) => [...prev, ...valid]);
    };


    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };
    const removeExistingMedia = async (media) => {
        try {
            console.log(media, "media");
            if (media.type === "video") {
                // Handle video deletion
                  await DELETE_PRODUCT_MEDIA_VIDEO(media.id);
                setExistingMedia((prev) => prev.filter((m) => m.id !== media.id));
            } else {
                await DELETE_PRODUCT_MEDIA(media.id);
                setExistingMedia((prev) => prev.filter((m) => m.id !== media.id));
            }

            toast.success("Media deleted");
        } catch (err) {
            toast.error("Failed to delete media");
        }
    };

    /* -------------------- SUBMIT -------------------- */
    const handleSubmit = async () => {
        const data = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            data.append(key, value);
        });

        // ✅ Append new images
        // images.forEach((img, i) => {
        //     data.append(`images[${i}]`, img);
        // });
        images.forEach((file, i) => {
            if (file.type.startsWith("image/")) {
                data.append(`images[${i}]`, file);  // 👈 IMAGE KEY
            } else if (file.type.startsWith("video/")) {
                data.append(`video`, file);   // 👈 VIDEO KEY
            }
        });

        // ✅ Send removed media IDs
        existingMedia.forEach((media, i) => {
            if (media.type.startsWith("image/")) {
                data.append(`images[${i}]`, media);  // 👈 IMAGE KEY
            } else if (media.type.startsWith("video/")) {
                data.append(`video[${i}]`, media);   // 👈 VIDEO KEY
            }
        });

        try {
            editId
                ? await UPDATE_PRODUCT(editId, data)
                : await ADD_PRODUCT(data);

            toast.success(editId ? "Product updated" : "Product added");
            navigate("/product");
        } catch {
            toast.error("Something went wrong");
        }
    };

    const selectedParentCategory = categories.find(
        (cat) => cat.id === form.parent_category_id
    );
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

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                    value={form.parent_category_id}
                    onChange={handleParentCategoryChange}
                    label="Category"
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedParentCategory?.subcategories?.length > 0 && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Sub Category</InputLabel>
                    <Select
                        value={form.category_id}
                        onChange={handleSubCategoryChange}
                        label="Sub Category"
                    >
                        {selectedParentCategory.subcategories.map((sub) => (
                            <MenuItem key={sub.id} value={sub.id}>
                                {sub.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {renderSelect("Color", "color_id", colors)}
            {renderSelect("Material", "material_id", materials)}
            {renderSelect("Diamond Type", "diamond_type_id", diamondTypes)}
            {renderSelect("Size", "size_id", sizes)}
            <TextField label="Indiamart Link" name="indiamart_link" fullWidth value={form.indiamart_link} onChange={handleChange} sx={{ mb: 2 }} />

            <TextField label="Weight (gm)" name="weight" type="number" fullWidth value={form.weight} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField label="Price" name="price" type="number" fullWidth value={form.price} onChange={handleChange} sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Discount Type</InputLabel>
                <Select name="discount_type" value={form.discount_type} onChange={handleChange} label="Discount Type">
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Trending</InputLabel>
                <Select name="trending" value={form.trending} onChange={handleChange} label="Trending">
                    <MenuItem value={1}>True</MenuItem>
                    <MenuItem value={0}>False</MenuItem>
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

            {/* Upload */}
            <label htmlFor="image-upload">
                <Box
                    border="2px dashed #aaa"
                    p={2}
                    mt={1}
                    textAlign="center"
                    sx={{ cursor: "pointer" }}
                >
                    <UploadCloud />
                    <Typography variant="body2">Click to upload images</Typography>
                </Box>
            </label>

            <input
                id="image-upload"
                type="file"
                hidden
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleMedia(e.target.files)}
            />

            {/* EXISTING IMAGES */}
            <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                {existingMedia.map((media) => (
                    <Box key={media.id} position="relative">
                        {media.type === "video" ? (
                            <video
                                src={media.url}
                                width={80}
                                height={80}
                                style={{ borderRadius: 8, objectFit: "cover" }}
                                controls
                            />
                        ) : (
                            <img
                                src={media.url}
                                width={80}
                                height={80}
                                style={{ borderRadius: 8, objectFit: "cover" }}
                            />
                        )}

                        <IconButton
                            size="small"
                            onClick={() => removeExistingMedia(media)}
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bgcolor: "#fff",
                            }}
                        >
                            <X size={14} />
                        </IconButton>
                    </Box>
                ))}
            </Box>
            {images.map((file, idx) => (
                <Box key={idx} position="relative">
                    {file.type.startsWith("video") ? (
                        <video
                            src={URL.createObjectURL(file)}
                            width={80}
                            height={80}
                            controls
                            style={{ borderRadius: 8 }}
                        />
                    ) : (
                        <img
                            src={URL.createObjectURL(file)}
                            width={80}
                            height={80}
                            style={{ borderRadius: 8, objectFit: "cover" }}
                        />
                    )}

                    <IconButton
                        size="small"
                        onClick={() => removeImage(idx)}
                        sx={{ position: "absolute", top: 0, right: 0, bgcolor: "#fff" }}
                    >
                        <X size={14} />
                    </IconButton>
                </Box>
            ))}



            <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button variant="contained" onClick={handleSubmit}>
                    {editId ? "Update Product" : "Save Product"}
                </Button>
            </Box>
        </Box>
    );
};

export default ProductForm;
