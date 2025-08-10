import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
} from "@mui/material";
import Sidebar from "../../../components/Sidebar";
import ProductService from "../../../services/productService"; // Sử dụng service có sẵn

const ChooseProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getAllProducts(1, 20); // Lấy 20 sản phẩm đầu tiên

        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setError("Không thể tải danh sách sản phẩm");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Có lỗi xảy ra khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle click để chuyển sang trang thiết kế
  const handleProductDetail = (product) => {
    navigate(`/product-design/${product._id}`, {
      state: { product },
    });
  };

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
          <Typography sx={{ ml: 2 }}>Đang tải sản phẩm...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Chọn một sản phẩm
        </Typography>

        {/* Filter chips */}
        <Box display="flex" gap={1} mb={4} flexWrap="wrap">
          <Chip label="Mũ lưỡi trai cổ điển" variant="outlined" />
          <Chip label="Mũ bố" variant="outlined" />
          <Chip label="Mũ lưỡi trai lưới" variant="outlined" />
          <Chip label="Mũ ôm đầu" variant="outlined" />
        </Box>

        {/* Product Layout */}
        <Grid container spacing={3} justifyContent="center">
          {products.length > 0 && (
            <>
              {/* Left large image - Sản phẩm đầu tiên */}
              <Grid item xs={12} md={6} sx={{ mt: 3 }}>
                <Card
                  sx={{
                    p: 2,
                    transform: "scale(1.15)",
                    transition: "transform 0.2s",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.2)",
                    },
                  }}
                  onClick={() => handleProductDetail(products[0])}
                >
                  <CardMedia
                    component="img"
                    image={
                      products[0].image_url || "https://via.placeholder.com/300"
                    }
                    alt={products[0].name}
                    sx={{
                      width: "100%",
                      objectFit: "contain",
                      p: 2,
                      height: 300,
                    }}
                  />
                  <CardContent sx={{ backgroundColor: "#f5f5f5" }}>
                    <Typography>{products[0].name}</Typography>
                    <Typography fontWeight="bold">
                      Giá: {products[0].price?.toLocaleString()} VND
                    </Typography>
                    <Typography>Thiết kế ngay!</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right smaller images - Các sản phẩm còn lại */}
              <Grid item xs={12} md={6} sx={{ mt: 10 }}>
                <Grid container spacing={3}>
                  {products.slice(1, 5).map((product) => (
                    <Grid item xs={12} sm={6} key={product._id}>
                      <Card
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.05)",
                            transition: "transform 0.2s",
                          },
                        }}
                        onClick={() => handleProductDetail(product)}
                      >
                        <CardMedia
                          component="img"
                          image={
                            product.image_url ||
                            "https://via.placeholder.com/160"
                          }
                          alt={product.name}
                          sx={{
                            width: "100%",
                            objectFit: "contain",
                            p: 2,
                            height: 160,
                          }}
                        />
                        <CardContent sx={{ backgroundColor: "#f5f5f5" }}>
                          <Typography>{product.name}</Typography>
                          <Typography fontWeight="bold">
                            Giá: {product.price?.toLocaleString()} VND
                          </Typography>
                          <Typography>Thiết kế ngay!</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </>
          )}
        </Grid>

        {/* Hiển thị tất cả sản phẩm dạng grid */}
        {products.length > 5 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Tất cả sản phẩm
            </Typography>
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.05)",
                        transition: "transform 0.2s",
                      },
                    }}
                    onClick={() => handleProductDetail(product)}
                  >
                    <CardMedia
                      component="img"
                      image={
                        product.image_url || "https://via.placeholder.com/200"
                      }
                      alt={product.name}
                      sx={{
                        width: "100%",
                        objectFit: "contain",
                        p: 2,
                        height: 200,
                      }}
                    />
                    <CardContent sx={{ backgroundColor: "#f5f5f5" }}>
                      <Typography noWrap>{product.name}</Typography>
                      <Typography fontWeight="bold" color="primary">
                        {product.price?.toLocaleString()} VND
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tồn kho: {product.stock_quantity}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChooseProductPage;
