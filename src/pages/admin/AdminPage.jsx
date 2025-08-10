import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ShoppingCart,
  AttachMoney,
  People,
  Settings,
  MoreVert,
  Category,
  Inventory,
} from "@mui/icons-material";

// Import custom components
import MetricCard from "../../components/admin/MetricCard";
import AdminLineChart from "../../components/admin/LineChart";
import AdminBarChart from "../../components/admin/BarChart";
import AdminDataTable from "../../components/admin/DataTable";

// Import services
import ProductService from "../../services/productService";
import OrderService from "../../services/orderService";
import CategoryService from "../../services/categoryService";
import UserService from "../../services/userService";

// Import admin styles
import "../../assets/admin.css";

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    products: null,
    orders: null,
    categories: null,
    users: null,
  });

  // Helper function để tính thống kê từ dữ liệu đơn hàng
  // Sửa hàm calculateOrderStats để tính doanh thu từ payments
  const calculateOrderStats = (orders, payments = []) => {
    if (!orders || !Array.isArray(orders)) {
      return {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        todayOrders: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
      };
    }

    console.log("Processing orders:", orders.length);
    console.log("Processing payments:", payments.length);

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let pendingOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;
    let todayOrders = 0;

    // Tạo map để tra cứu payments theo order_id
    const paymentMap = new Map();
    payments.forEach((payment) => {
      const orderId = payment.order_id;
      if (!paymentMap.has(orderId)) {
        paymentMap.set(orderId, []);
      }
      paymentMap.get(orderId).push(payment);
    });

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt || order.order_date);
      const orderId = order._id;

      // Lấy payments cho đơn hàng này
      const orderPayments = paymentMap.get(orderId) || [];

      // Tính tổng số tiền đã thanh toán thành công cho đơn hàng này
      const paidAmount = orderPayments
        .filter((payment) => payment.payment_status === "Done")
        .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);

      console.log(`Order ${orderId}:`, {
        status: order.status,
        orderAmount: order.total_amount,
        paidAmount: paidAmount,
        paymentsCount: orderPayments.length,
      });

      // Đếm theo trạng thái đơn hàng
      const status = order.status?.toLowerCase();
      if (status === "pending" || status === "processing") {
        pendingOrders++;
      } else if (
        status === "done" ||
        status === "delivered" ||
        status === "completed"
      ) {
        completedOrders++;
      } else if (status === "cancelled") {
        cancelledOrders++;
      }

      // Tính doanh thu từ payments đã "Done" thay vì dựa vào trạng thái đơn hàng
      if (paidAmount > 0) {
        totalRevenue += paidAmount;

        // Kiểm tra xem payment có trong tháng này không
        const hasMonthlyPayment = orderPayments.some((payment) => {
          if (payment.payment_status !== "Done") return false;
          const paymentDate = new Date(
            payment.payment_date || payment.updatedAt
          );
          return paymentDate >= startOfMonth;
        });

        if (hasMonthlyPayment) {
          const monthlyPaidAmount = orderPayments
            .filter((payment) => {
              if (payment.payment_status !== "Done") return false;
              const paymentDate = new Date(
                payment.payment_date || payment.updatedAt
              );
              return paymentDate >= startOfMonth;
            })
            .reduce(
              (sum, payment) => sum + (parseFloat(payment.amount) || 0),
              0
            );

          monthlyRevenue += monthlyPaidAmount;
        }
      }

      // Đếm đơn hàng hôm nay
      if (orderDate >= startOfToday) {
        todayOrders++;
      }
    });

    const result = {
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      todayOrders,
      totalRevenue,
      monthlyRevenue,
    };

    console.log("Calculated stats:", result);
    return result;
  };

  // Sửa useEffect để fetch cả payments
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);

        // Fetch dữ liệu từ các API có sẵn, bao gồm cả payments
        const [productStats, allOrders, allPayments, categoryStats, userStats] =
          await Promise.allSettled([
            ProductService.getAllProducts(1, 1000).catch(() =>
              ProductService.getProductStats()
            ),
            OrderService.getAllOrders({ limit: 1000 }),
            OrderService.getAllPayments(), // Thêm fetch payments
            CategoryService.getAllCategories(1, 1000).catch(() =>
              CategoryService.getCategoryStats()
            ),
            UserService.getAllUsers(),
          ]);

        // Xử lý kết quả products
        let processedProductStats = null;
        if (
          productStats.status === "fulfilled" &&
          productStats.value?.success
        ) {
          const productData = productStats.value.data;
          if (Array.isArray(productData)) {
            processedProductStats = {
              success: true,
              data: { totalProducts: productData.length },
            };
          } else if (productData?.totalProducts !== undefined) {
            processedProductStats = productStats.value;
          }
        }

        // Xử lý kết quả orders và payments
        let calculatedOrderStats = null;
        if (allOrders.status === "fulfilled" && allOrders.value?.success) {
          const orderData = allOrders.value.data || [];
          const paymentData =
            allPayments.status === "fulfilled" && allPayments.value?.success
              ? allPayments.value.data || []
              : [];

          console.log("Orders data:", orderData.length);
          console.log("Payments data:", paymentData.length);

          calculatedOrderStats = {
            success: true,
            data: calculateOrderStats(orderData, paymentData),
          };
        }

        // Xử lý kết quả categories
        let processedCategoryStats = null;
        if (
          categoryStats.status === "fulfilled" &&
          categoryStats.value?.success
        ) {
          const categoryData = categoryStats.value.data;
          if (Array.isArray(categoryData)) {
            processedCategoryStats = {
              success: true,
              data: { totalCategories: categoryData.length },
            };
          } else if (categoryData?.totalCategories !== undefined) {
            processedCategoryStats = categoryStats.value;
          }
        }

        setStats({
          products: processedProductStats,
          orders: calculatedOrderStats,
          categories: processedCategoryStats,
          users: userStats.status === "fulfilled" ? userStats.value : null,
        });

        console.log("Admin stats loaded:", {
          products: processedProductStats ? "success" : "failed",
          orders: calculatedOrderStats ? "success" : "failed",
          categories: processedCategoryStats ? "success" : "failed",
          users: userStats.status === "fulfilled" ? "success" : "failed",
        });
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("Không thể tải một số dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);
  // Sample data for recent activities
  const recentActivities = [
    {
      id: 1,
      title: "Đơn hàng mới",
      subtitle: `${stats.orders?.data?.todayOrders || 0} đơn hàng hôm nay`,
      time: "Cập nhật mới nhất",
      icon: <ShoppingCart />,
      color: "primary",
    },
    {
      id: 2,
      title: "Doanh thu",
      subtitle: `${(stats.orders?.data?.totalRevenue || 0).toLocaleString(
        "vi-VN"
      )} VND`,
      time: "Tổng doanh thu",
      icon: <AttachMoney />,
      color: "success",
    },
    {
      id: 3,
      title: "Người dùng mới",
      subtitle: `${stats.users?.data?.length || 0} tài khoản đã đăng ký`,
      time: "Tổng người dùng",
      icon: <People />,
      color: "info",
    },
    {
      id: 4,
      title: "Sản phẩm",
      subtitle: `${stats.products?.data?.totalProducts || 0} sản phẩm có sẵn`,
      time: "Tổng sản phẩm",
      icon: <Inventory />,
      color: "warning",
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Đang tải dữ liệu thống kê...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Một số thống kê có thể không khả dụng do API chưa được triển khai.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, width: "100%", maxWidth: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          fontWeight="600"
          gutterBottom
          sx={{ color: "#333" }}
        >
          Admin Dashboard - Bảng điều khiển
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tổng quan về hệ thống và hoạt động kinh doanh
        </Typography>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Tổng đơn hàng"
            value={(stats.orders?.data?.totalOrders || 0).toLocaleString()}
            change={stats.orders?.data ? "12.5" : "N/A"}
            changeType="increase"
            subtitle="vs tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Tổng người dùng"
            value={(stats.users?.data?.length || 0).toLocaleString()}
            change={stats.users?.data ? "8.3" : "N/A"}
            changeType="increase"
            subtitle="tài khoản đã đăng ký"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Tổng sản phẩm"
            value={(stats.products?.data?.totalProducts || 0).toLocaleString()}
            change={stats.products?.data ? "5.2" : "N/A"}
            changeType="increase"
            subtitle="sản phẩm có sẵn"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Doanh thu"
            value={`${(stats.orders?.data?.totalRevenue || 0).toLocaleString(
              "vi-VN"
            )} VND`}
            change={stats.orders?.data ? "15.7" : "N/A"}
            changeType="increase"
            subtitle="tổng doanh thu"
          />
        </Grid>
      </Grid>

      {/* Thống kê chi tiết đơn hàng */}
      {/* Thống kê chi tiết đơn hàng */}
      {stats.orders?.data && (
        <Grid
          container
          spacing={0}
          sx={{
            mb: 6,
            justifyContent: "space-between",
            gap: 0,
          }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: "4px solid #ff9800" }}>
              <CardContent>
                <Typography variant="h6" color="#ff9800" fontWeight="bold">
                  Chờ xử lý
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.orders.data.pendingOrders || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  đơn hàng chờ xử lý
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: "4px solid #4caf50" }}>
              <CardContent>
                <Typography variant="h6" color="#4caf50" fontWeight="bold">
                  Hoàn thành
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.orders.data.completedOrders || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  đơn hàng hoàn thành
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: "4px solid #f44336" }}>
              <CardContent>
                <Typography variant="h6" color="#f44336" fontWeight="bold">
                  Đã hủy
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.orders.data.cancelledOrders || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  đơn hàng bị hủy
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: "4px solid #2196f3" }}>
              <CardContent>
                <Typography variant="h6" color="#2196f3" fontWeight="bold">
                  Hôm nay
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.orders.data.todayOrders || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  đơn hàng trong ngày
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Doanh thu tháng này */}
      {stats.orders?.data && (
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} lg={12}>
            <Card sx={{ borderLeft: "4px solid #9c27b0" }}>
              <CardContent>
                <Typography variant="h6" color="#9c27b0" fontWeight="bold">
                  Doanh thu tháng này
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {(stats.orders.data.monthlyRevenue || 0).toLocaleString(
                    "vi-VN"
                  )}{" "}
                  VND
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  từ các đơn hàng hoàn thành
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts Section */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} lg={6}>
          <AdminLineChart title="Xu hướng doanh thu & đơn hàng" />
        </Grid>
        <Grid item xs={12} lg={6}>
          <AdminBarChart title="Hiệu suất theo tháng" />
        </Grid>
      </Grid>

      {/* Data Table */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <AdminDataTable title="Đơn hàng gần đây" />
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Thống kê tổng quan</Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>

              <List sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: `${activity.color}.light`,
                            color: `${activity.color}.main`,
                            width: 40,
                            height: 40,
                          }}
                        >
                          {activity.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            {activity.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.subtitle}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {activity.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Thống kê danh mục */}
        {stats.categories?.data && (
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Thống kê danh mục
                </Typography>
                <Box sx={{ textAlign: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: "secondary.light",
                      color: "secondary.main",
                      width: 60,
                      height: 60,
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Category sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.categories.data.totalCategories || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng số danh mục sản phẩm
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* API Status */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Trạng thái API
              </Typography>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Orders API</Typography>
                  <Typography
                    variant="body2"
                    color={stats.orders ? "success.main" : "error.main"}
                  >
                    {stats.orders ? "Available" : "Limited"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Products API</Typography>
                  <Typography
                    variant="body2"
                    color={stats.products ? "success.main" : "error.main"}
                  >
                    {stats.products ? "Available" : "Limited"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Users API</Typography>
                  <Typography
                    variant="body2"
                    color={stats.users ? "success.main" : "error.main"}
                  >
                    {stats.users ? "Available" : "Limited"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Last Update</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date().toLocaleTimeString("vi-VN")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage;
