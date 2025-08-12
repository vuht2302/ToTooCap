import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import logohome from "../../assets/logohome.png";
import { fetchAllProducts } from "../../api/product.service";

// Component trang chủ của user
const HomePage = () => {
  const navigate = useNavigate(); // Hook để chuyển trang
  const [products, setProducts] = useState([]); // State lưu danh sách sản phẩm
  const [loading, setLoading] = useState(true); // State kiểm soát loading

  // Hàm chuyển sang trang chi tiết sản phẩm khi click vào sản phẩm
  const handleProductDetail = (id) => {
    navigate(`/product-detail/${id}`);
  };

  // Hàm chuyển sang trang chọn sản phẩm để tạo mới
  const handleCreateProduct = () => {
    navigate("/choose-product");
  };

  // useEffect gọi API lấy danh sách sản phẩm khi trang được load
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const products = await fetchAllProducts(); // Gọi API lấy sản phẩm
        setProducts(products); // Lưu vào state
      } catch (err) {
        alert("Không thể lấy danh sách sản phẩm");
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };
    getProducts();
  }, []);

  return (
    // Layout tổng: chia làm Sidebar và phần nội dung chính
    <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
      <Sidebar />

      <Box flex={1} p={4}>
        {/* Hero Section: Giới thiệu và nút tạo sản phẩm */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bgcolor="#202020"
          color="white"
          borderRadius={2}
          p={4}
          mb={4}
        >
          <Box maxWidth="50%">
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Tạo sản phẩm đầu tiên của bạn
            </Typography>
            <Typography variant="body1" mb={3}>
              Chọn một sản phẩm, thêm thiết kế của bạn và xem việc tạo và xuất
              bản dễ dàng như thế nào với ToTooCap
            </Typography>
            <Button
              onClick={handleCreateProduct}
              variant="contained"
              sx={{ bgcolor: "#a4f35f", color: "#000", fontWeight: "bold" }}
            >
              Tạo sản phẩm
            </Button>
          </Box>
          {/* Ảnh minh họa bên phải */}
          <Box>
            <img
              src={logohome}
              alt="Buy Illustration"
              style={{ width: 120, height: 120, objectFit: "contain" }}
            />
          </Box>
        </Box>

        {/* Product List Section: Danh sách sản phẩm hiện có */}
        <Box flex={1} p={4} maxWidth="100%">
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Biến ý tưởng thành hiện thực ngay hôm nay!
          </Typography>

          {/* Hiển thị loading khi đang lấy dữ liệu */}
          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            // Hiển thị danh sách sản phẩm dạng lưới
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={product._id}>
                  <Card
                    onClick={() => handleProductDetail(product._id)}
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      maxWidth: 300,
                      margin: "0 auto",
                      cursor: "pointer",
                    }}
                  >
                    {/* Ảnh sản phẩm */}
                    <CardMedia
                      component="img"
                      height="200"
                      image="https://zerdio.com.vn/wp-content/uploads/2021/03/M22.jpg"
                      alt={product.name}
                    />
                    <CardContent>
                      {/* Tên sản phẩm */}
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        gutterBottom
                      >
                        {product.name}
                      </Typography>
                      {/* Giá sản phẩm */}
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                      </Typography>
                      {/* Số lượng tồn kho */}
                      <Typography variant="body2" color="textSecondary">
                        Kho: {product.stock_quantity}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Nút xem thêm (chưa có chức năng) */}
          <Box textAlign="center" mt={4}>
            <Button variant="text" sx={{ textDecoration: "underline" }}>
              Xem thêm
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
