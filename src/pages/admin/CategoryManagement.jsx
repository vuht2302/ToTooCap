import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import CategoryTable from '../../components/admin/CategoryTable';
import MetricCard from '../../components/admin/MetricCard';
import CategoryService from '../../services/categoryService';

const CategoryManagement = () => {
  const [categoryStats, setCategoryStats] = useState({
    totalCategories: 0,
    newCategories: 0,
    updatedCategories: 0,
    deletedCategories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryStats();
  }, []);

  // Giả lập thống kê, có thể thay bằng API nếu backend có
  const loadCategoryStats = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.getAllCategories(1, 1000);
      if (response.success && response.data) {
        const categories = response.data;
        setCategoryStats({
          totalCategories: categories.length,
          newCategories: categories.filter(c => {
            const created = new Date(c.createdAt);
            const now = new Date();
            return (now - created) < 1000 * 60 * 60 * 24 * 30; // mới trong 30 ngày
          }).length,
          updatedCategories: categories.filter(c => c.updatedAt !== c.createdAt).length,
          deletedCategories: 0 // Nếu có API thì lấy số đã xóa
        });
      }
    } catch (err) {
      setCategoryStats({
        totalCategories: 0,
        newCategories: 0,
        updatedCategories: 0,
        deletedCategories: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, width: '100%', maxWidth: '100%', height: '100vh', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>  
        <Typography variant="h5" fontWeight="600" gutterBottom sx={{ color: '#333' }}>
          Quản lý danh mục
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý tất cả danh mục sản phẩm trong hệ thống
        </Typography>
      </Box>
      {/* Category Statistics */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tổng danh mục"
            value={loading ? "..." : categoryStats.totalCategories?.toLocaleString() || "0"}
            change="8.5"
            changeType="increase"
            subtitle="vs tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Danh mục mới"
            value={loading ? "..." : categoryStats.newCategories?.toLocaleString() || "0"}
            change="12.3"
            changeType="increase"
            subtitle="trong 30 ngày"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Danh mục cập nhật"
            value={loading ? "..." : categoryStats.updatedCategories?.toLocaleString() || "0"}
            change="5.2"
            changeType="decrease"
            subtitle="có chỉnh sửa"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Danh mục đã xóa"
            value={loading ? "..." : categoryStats.deletedCategories?.toLocaleString() || "0"}
            change="15.7"
            changeType="increase"
            subtitle="vs tháng trước"
          />
        </Grid>
      </Grid>
      {/* Category Table - Full width */}
      <Box sx={{ width: '100%', flex: 1 }}>
        <CategoryTable />
      </Box>
    </Box>
  );
};

export default CategoryManagement;
