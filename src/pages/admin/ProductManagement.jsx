import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid
} from '@mui/material';

// Import components
import ProductTable from '../../components/admin/ProductTable';
import MetricCard from '../../components/admin/MetricCard';
import ProductService from '../../services/productService';

const ProductManagement = () => {
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    inStockProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductStats();
  }, []);

  const loadProductStats = async () => {
    try {
      setLoading(true);
      
      // Nếu API stats không có, tính toán từ danh sách sản phẩm
      const response = await ProductService.getAllProducts(1, 1000); // Lấy tất cả để tính stats
      
      if (response.success && response.data) {
        const products = response.data;
        const stats = {
          totalProducts: products.length,
          inStockProducts: products.filter(p => p.stock_quantity > 0).length,
          lowStockProducts: products.filter(p => p.stock_quantity > 0 && p.stock_quantity < 10).length,
          outOfStockProducts: products.filter(p => p.stock_quantity === 0).length,
          totalValue: products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)
        };
        setProductStats(stats);
      }
    } catch (err) {
      console.error('Error loading product stats:', err);
      // Fallback to default values if API fails
      setProductStats({
        totalProducts: 0,
        inStockProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        totalValue: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(amount || 0);
  };

  return (
    <Box sx={{ 
      p: 4, 
      width: '100%', 
      maxWidth: '100%',
      height: '100vh',
      overflow: 'auto'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="600" gutterBottom sx={{ color: '#333' }}>
          Quản lý sản phẩm
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý tất cả sản phẩm trong hệ thống
        </Typography>
      </Box>

      {/* Product Statistics */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tổng sản phẩm"
            value={loading ? "..." : productStats.totalProducts?.toLocaleString() || "0"}
            change="8.5"
            changeType="increase"
            subtitle="vs tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Sản phẩm còn hàng"
            value={loading ? "..." : productStats.inStockProducts?.toLocaleString() || "0"}
            change="12.3"
            changeType="increase"
            subtitle="có sẵn"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Sản phẩm sắp hết"
            value={loading ? "..." : productStats.lowStockProducts?.toLocaleString() || "0"}
            change="5.2"
            changeType="decrease"
            subtitle="cần nhập thêm"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Giá trị tồn kho"
            value={loading ? "..." : formatCurrency(productStats.totalValue)}
            change="15.7"
            changeType="increase"
            subtitle="vs tháng trước"
          />
        </Grid>
      </Grid>

      {/* Product Table - Full width */}
      <Box sx={{ width: '100%', flex: 1 }}>
        <ProductTable />
      </Box>
    </Box>
  );
};

export default ProductManagement;