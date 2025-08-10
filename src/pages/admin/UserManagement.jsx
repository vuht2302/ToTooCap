import React from 'react';
import {
  Box,
  Typography,
  Grid
} from '@mui/material';

// Import components
import UserTable from '../../components/admin/UserTable';
import MetricCard from '../../components/admin/MetricCard';

const UserManagement = () => {
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
          Quản lý người dùng
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý tất cả người dùng trong hệ thống
        </Typography>
      </Box>

      {/* User Statistics */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tổng người dùng"
            value="1,234"
            change="12.5"
            changeType="increase"
            subtitle="vs tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Người dùng hoạt động"
            value="1,156"
            change="8.2"
            changeType="increase"
            subtitle="vs tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Người dùng mới"
            value="78"
            change="15.3"
            changeType="increase"
            subtitle="tháng này"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Người dùng bị chặn"
            value="12"
            change="2.1"
            changeType="decrease"
            subtitle="vs tháng trước"
          />
        </Grid>
      </Grid>

      {/* User Table - Full width */}
      <Box sx={{ width: '100%', flex: 1 }}>
        <UserTable />
      </Box>
    </Box>
  );
};

export default UserManagement;