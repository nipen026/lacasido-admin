import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Avatar,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { GET_PRODUCT_BY_ID } from "../../api/get";
import Slider from "react-slick";

const ProductDetails = () => {
    const { id } = useParams();
    //   const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const product = location.state?.product;
    //   const fetchProduct = async () => {
    //     try {
    //       const res = await GET_PRODUCT_BY_ID(id);
    //       setProduct(res.data.product);
    //     } catch (error) {
    //       console.error(error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    //   useEffect(() => {
    //     fetchProduct();
    //   }, [id]);

    if (loading)
        return (
            <Box textAlign="center" mt={10}>
                <CircularProgress />
            </Box>
        );

    if (!product)
        return (
            <Typography mt={10} align="center" color="error">
                Product not found
            </Typography>
        );

    /* ---------------- Price Calculation ---------------- */

    const price = Number(product.price);
    const discountValue = Number(product.discount_value);

    const finalPrice =
        product.discount_type === "percentage"
            ? price - (price * discountValue) / 100
            : price - discountValue;

    /* ---------------- Slider Settings ---------------- */

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <Box maxWidth="lg" mx="auto" p={4}>
            <Grid container spacing={4}>
                {/* Images */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, boxShadow: 'none' }}>
                        {product.media?.length ? (
                            <Slider {...sliderSettings}>
                                {product.media.map((img, idx) => (
                                    <Box key={idx} textAlign="center">
                                        <img
                                            src={img.original_url || img.url}
                                            alt={product.name}
                                            style={{
                                                width: "100%",
                                                maxHeight: 450,
                                                objectFit: "contain",
                                                borderRadius: 8,
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Slider>
                        ) : (
                            <Typography align="center" color="text.secondary">
                                No images available
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Product Info */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" fontWeight="bold">
                        {product.name}
                    </Typography>

                    <Stack direction="row" spacing={1} mt={2} mb={2}>
                        <Chip label={product.category?.name} color="primary" />
                        <Chip label={product.diamond_type?.name} />
                    </Stack>

                    <Typography color="text.secondary" mb={1}>
                        Design: <strong>{product.design}</strong>
                    </Typography>

                    <Typography color="text.secondary" mb={1}>
                        Weight: <strong>{product.weight} gm</strong>
                    </Typography>

                    <Typography color="text.secondary" mb={1}>
                        Size: <strong>{product.size?.name}</strong>
                    </Typography>
                    <Typography color="text.secondary" mb={1}>
                        Material: <strong>{product.material?.name}</strong>
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Pricing */}
                    <Typography variant="h6">Pricing</Typography>
                    <Typography fontSize={18}>
                        <s>₹{price.toFixed(2)}</s>{" "}
                        <strong style={{ color: "green" }}>
                            ₹{finalPrice.toFixed(2)}
                        </strong>
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Discount: {product.discount_value}
                        {product.discount_type === "percentage" ? "%" : "₹"}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Color */}
                    <Typography variant="h6">Color</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                            sx={{
                                bgcolor: "#e0b0a5",
                                width: 28,
                                height: 28,
                                border: "1px solid #ccc",
                            }}
                        />
                        <Typography>{product.color?.name}</Typography>
                    </Stack>

                    {product.indiamart_link && (
                        <Box mt={2}>
                            <a
                                href={product.indiamart_link}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View on Indiamart
                            </a>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductDetails;
