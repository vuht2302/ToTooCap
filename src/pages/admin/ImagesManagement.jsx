import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import MetricCard from '../../components/admin/MetricCard';
import ImagesTable from '../../components/admin/ImagesTable';
import ImageService from '../../services/imageService';

const ImagesManagement = () => {
  const [stats, setStats] = useState({ total: 0, new30d: 0, updated: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await ImageService.getAllImages();
        if (res?.success) {
          const items = res.data || [];
          const now = new Date();
          const new30d = items.filter(i => (now - new Date(i.createdAt)) < 1000*60*60*24*30).length;
          const updated = items.filter(i => i.updatedAt && i.updatedAt !== i.createdAt).length;
          setStats({ total: items.length, new30d, updated });
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Box sx={{ p: 4, width: '100%', maxWidth: '100%', height: '100vh', overflow: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Quản lý ảnh sản phẩm
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý tất cả ảnh sản phẩm trong hệ thống
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Tổng ảnh" value={loading ? '...' : stats.total.toLocaleString()} change="8.5" changeType="increase" subtitle="vs tháng trước" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Ảnh mới" value={loading ? '...' : stats.new30d.toLocaleString()} change="12.3" changeType="increase" subtitle="trong 30 ngày" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Ảnh cập nhật" value={loading ? '...' : stats.updated.toLocaleString()} change="5.2" changeType="decrease" subtitle="có chỉnh sửa" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Ảnh đã xóa" value={loading ? '...' : '0'} change="15.7" changeType="increase" subtitle="vs tháng trước" />
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', flex: 1 }}>
        <ImagesTable />
      </Box>
    </Box>
  );
};

export default ImagesManagement;
