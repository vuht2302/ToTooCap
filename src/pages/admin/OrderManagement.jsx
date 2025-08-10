import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";

// Import components
import OrderTable from "../../components/admin/OrderTable";
import MetricCard from "../../components/admin/MetricCard";
import OrderService from "../../services/orderService";

const OrderManagement = () => {
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderStats();
  }, []);

  const loadOrderStats = async () => {
    try {
      setLoading(true);
      const stats = await OrderService.getOrderStats();
      setOrderStats(stats);
    } catch (err) {
      console.error("Error loading order stats:", err);
      // Fallback to default values if API fails
      setOrderStats({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        width: "100%",
        maxWidth: "100%",
        height: "100vh",
        overflow: "auto",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          fontWeight="600"
          gutterBottom
          sx={{ color: "#333" }}
        >
          Quản lý đơn hàng
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý tất cả đơn hàng trong hệ thống
        </Typography>
      </Box>

      {/* Order Statistics */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tổng đơn hàng"
            value={
              loading ? "..." : orderStats.totalOrders?.toLocaleString() || "0"
            }
            change="12.5"
            changeType="increase"
            subtitle="vs tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Đơn hàng chờ xử lý"
            value={
              loading
                ? "..."
                : orderStats.pendingOrders?.toLocaleString() || "0"
            }
            change="8.2"
            changeType="increase"
            subtitle="cần xử lý"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Đơn hàng hoàn thành"
            value={
              loading
                ? "..."
                : orderStats.completedOrders?.toLocaleString() || "0"
            }
            change="15.3"
            changeType="increase"
            subtitle="tháng này"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tổng doanh thu"
            value={
              loading
                ? "..."
                : new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    notation: "compact",
                  }).format(orderStats.totalRevenue || 0)
            }
            change="18.7"
            changeType="increase"
            subtitle="vs tháng trước"
          />
        </Grid>
      </Grid>

      {/* Order Table - Full width */}
      <Box sx={{ width: "100%", flex: 1 }}>
        <OrderTable />
      </Box>
    </Box>
  );
};

export default OrderManagement;
