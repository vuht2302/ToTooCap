import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BalanceIcon from "@mui/icons-material/Balance";
import CircleIcon from "@mui/icons-material/Circle";
import Rating from "@mui/material/Rating";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Call API to add to cart instead of localStorage
  const handleAddToCart = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.warn("Vui lòng đăng nhập trước.");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(
        "http://54.169.159.141:3000/cart/CartItem/product/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ quantity: 1, product_id: id || id }),
        }
      );
      const data = await res.json();
      if (res.ok && (data.success === undefined || data.success === true)) {
        // Lưu cart_id trả về
        const cartId = data?.data?.cart_id || data?.cart_id;
        if (cartId) localStorage.setItem("cart_id", cartId);
        toast.success("Product added to cart successfully!");
      } else {
        toast.error(data.message || "Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://54.169.159.141:3000/product/get/${id}`);
        const result = await res.json();

        if (res.ok && result.success) {
          setProduct(result.data);
        } else {
          alert("Failed to fetch product details.");
        }
      } catch (error) {
        console.error("Fetch product detail error:", error);
        alert("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box
          sx={{
            flexGrow: 1,
            p: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
        <ToastContainer position="top-right" autoClose={3000} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h6">Product not found</Typography>
        </Box>
        <ToastContainer position="top-right" autoClose={3000} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Card sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Product Image */}
            <Grid item xs={12} md={5}>
              <CardMedia
                component="img"
                image="https://zerdio.com.vn/wp-content/uploads/2021/03/M22.jpg"
                alt={product.name}
                sx={{ width: "100%", maxHeight: 350, objectFit: "contain" }}
              />
            </Grid>

            {/* Product Info */}
            <Grid item xs={12} md={7}>
              <Chip
                label="Free shipping"
                color="primary"
                size="small"
                sx={{ mb: 2, fontWeight: "bold", backgroundColor: "#1e1e54" }}
              />

              <Typography variant="h5" fontWeight="bold" mb={1}>
                {product.name}
              </Typography>

              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography
                  variant="body1"
                  sx={{ textDecoration: "line-through", color: "gray" }}
                >
                  {(product.price * 1.2).toLocaleString()} VND
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {product.price.toLocaleString()} VND
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={3}>
                The offer is valid until April 3 or as long as stock lasts!
              </Typography>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleAddToCart}
                sx={{
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  fontWeight: "bold",
                  py: 1.5,
                  borderRadius: "8px",
                  boxShadow: "0 4px 0 #1d4ed8",
                  mb: 2,
                }}
              >
                Add to cart
              </Button>

              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <CircleIcon fontSize="small" sx={{ color: "green" }} />
                <Typography variant="body2" fontWeight="medium">
                  {product.stock_quantity}+ pcs. in stock.
                </Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<BalanceIcon />}
                  sx={{
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    borderRadius: "10px",
                    fontWeight: "500",
                  }}
                >
                  Add to cart
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FavoriteBorderIcon />}
                  sx={{
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    borderRadius: "10px",
                    fontWeight: "500",
                  }}
                >
                  Add to wishlist
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Card>

        {/* Description & Reviews */}
        <Box mt={4}>
          {/* Product Description */}
          <Box mb={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Product Description
            </Typography>
            <Typography variant="body1">{product.description}</Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Customer Reviews (static for now) */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Customer Reviews
            </Typography>

            {[1, 2].map((i) => (
              <Box key={i} display="flex" gap={2} mb={3}>
                <Avatar alt={`Customer ${i}`} />
                <Box>
                  <Typography fontWeight="bold">Customer {i}</Typography>
                  <Rating value={4} readOnly size="small" />
                  <Typography variant="body2" mt={0.5}>
                    Really liked the quality and delivery was fast. Would
                    recommend!
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    April 2025
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}
