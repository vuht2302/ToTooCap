import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import ProductService from "../../../services/productService";

export default function ProductDesignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getProductById(id);
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError("Không tìm thấy sản phẩm.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDesignClick = () => {
    navigate(`/hat-design/${id}`, { state: { product } });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải sản phẩm...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ mb: 3, minWidth: 36 }}
          >
            ← Quay lại
          </Button>
          {/* Cột trái - ảnh */}
          <Box
            sx={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
              display: "flex",
              justifyContent: "center",
              maxWidth: { md: "45%" },
            }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                width: "100%",
                maxHeight: 350,
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Cột phải - nội dung */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">
           {product.name}
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mt: 1, mb: 2, color: "#222" }}
            >
              Chất lượng tốt nhất, phong cách trẻ trung
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            <Typography variant="h6" color="error" fontWeight="bold" mb={2}>
              Giá chỉ từ {product.price?.toLocaleString()} VND
            </Typography>

            <Typography variant="body2" sx={{ mb: 2 }}>
              Tồn kho: {product.stock_quantity}
            </Typography>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#444",
                fontWeight: "bold",
                px: 3,
                py: 1,
              }}
              onClick={handleDesignClick}
            >
              Bắt đầu thiết kế ngay!
            </Button>
          </Box>
        </Box>
      </Box>{" "}
    </Box>
  );
}
