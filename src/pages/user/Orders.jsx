import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Chip,
  Checkbox,
  Stack,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import SearchIcon from "@mui/icons-material/Search";
import PaymentIcon from "@mui/icons-material/Payment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaymentService from "../../services/paymentService";
import OrderService from "../../services/orderService";
import TransactionDetailDialog from "../../components/user/TransactionDetailDialog ";
import { formatCurrency, formatDate } from "../../utils/format";
const statusFilters = ["All", "Processing", "Done", "Cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State cho dialog xem chi tiết
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    paymentDetail: null,
    loading: false,
  });

  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)._id : "";

  useEffect(() => {
    fetchOrders();
    fetchPayments();
  }, [selectedStatus, userId]);

  // Fetch payments using service
  const fetchPayments = async () => {
    try {
      const data = await OrderService.getAllPayments();
      if (data.success) {
        setPayments(data.data || []);
      }
    } catch (error) {
      console.error("Fetch payments failed:", error);
    }
  };

  // Fetch orders using service
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        currentPage: 1,
        limit: 100,
        sortBy: "createdAt",
        sortOrder: "desc",
        ...(userId && userId.trim() && { userId }),
      };

      console.log("userId:", userId);

      const data = await OrderService.getAllOrders(params);
      console.log("Fetched orders:", data);

      if (data.success) {
        setOrders(data.data || []);
      } else {
        setError("Không thể tải danh sách đơn hàng");
      }
    } catch (error) {
      console.error("Fetch orders failed:", error);
      setError("Có lỗi xảy ra khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Sử dụng helper functions từ service
  const getPaymentStatusForOrder = (orderId) => {
    return OrderService.getPaymentStatusForOrder(payments, orderId);
  };

  const getPaymentDetailForOrder = (orderId) => {
    return OrderService.getPaymentDetailForOrder(payments, orderId);
  };

  const getDisplayStatus = (orderId) => {
    return OrderService.getDisplayStatus(payments, orderId);
  };

  // Handle xem chi tiết giao dịch
  const handleViewTransactionDetail = async (orderId) => {
    const paymentDetail = getPaymentDetailForOrder(orderId);

    if (paymentDetail) {
      setDetailDialog({
        open: true,
        paymentDetail: paymentDetail,
        loading: false,
      });
    } else {
      setSnackbar({
        open: true,
        message: "Không tìm thấy thông tin giao dịch",
        severity: "warning",
      });
    }
  };

  // Handle đóng dialog chi tiết
  const handleCloseDetailDialog = () => {
    setDetailDialog({
      open: false,
      paymentDetail: null,
      loading: false,
    });
  };

  // Handle select all checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const payableOrders = filteredOrders
        .filter((order) => getDisplayStatus(order._id) === "Processing")
        .map((order) => order._id);
      setSelectedOrders(new Set(payableOrders));
    } else {
      setSelectedOrders(new Set());
    }
  };

  // Handle individual checkbox
  const handleSelectOrder = (orderId) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  // Get payment URL using service
  const getPaymentUrl = async (paymentId) => {
    try {
      return await OrderService.getVNPayPaymentUrl(paymentId);
    } catch (error) {
      console.error("Get payment URL error:", error);
      throw error;
    }
  };

  // Handle payment for selected orders
  const handlePayment = async () => {
    if (selectedOrders.size === 0) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn ít nhất một đơn hàng để thanh toán",
        severity: "warning",
      });
      return;
    }

    setPaymentLoading(true);
    const successfulPayments = [];
    const failedPayments = [];
    const createdPaymentIds = [];

    try {
      for (const orderId of selectedOrders) {
        console.log("Creating payment for order:", orderId);

        if (!orderId) {
          console.error("Invalid orderId:", orderId);
          continue;
        }

        try {
          const paymentData = await PaymentService.createPayment(orderId);

          if (paymentData.success && paymentData.data?._id) {
            successfulPayments.push(orderId);
            createdPaymentIds.push(paymentData.data._id);
            console.log("Created payment ID:", paymentData.data._id);
          } else {
            failedPayments.push({
              orderId,
              message: paymentData.message || "Thanh toán thất bại",
            });
          }
        } catch (error) {
          console.error(
            "Payment creation error for order",
            orderId,
            ":",
            error
          );
          failedPayments.push({ orderId, message: "Lỗi kết nối" });
        }
      }

      if (successfulPayments.length > 0) {
        setSnackbar({
          open: true,
          message: `Tạo thanh toán thành công cho ${successfulPayments.length} đơn hàng`,
          severity: "success",
        });

        setSelectedOrders(new Set());
        await fetchOrders();
        await fetchPayments();

        if (createdPaymentIds.length > 0) {
          const firstPaymentId = createdPaymentIds[0];
          console.log("Using payment ID for URL:", firstPaymentId);

          try {
            const paymentUrl = await getPaymentUrl(firstPaymentId);
            console.log("Payment URL received:", paymentUrl);

            if (paymentUrl && paymentUrl !== "undefined") {
              window.location.href = paymentUrl;
            } else {
              throw new Error("URL thanh toán không hợp lệ");
            }
          } catch (error) {
            console.error("Get payment URL error:", error);
            setSnackbar({
              open: true,
              message:
                "Tạo payment thành công nhưng không thể chuyển đến trang thanh toán",
              severity: "warning",
            });
          }
        } else {
          console.error("No payment IDs created");
          setSnackbar({
            open: true,
            message: "Không thể lấy ID thanh toán",
            severity: "error",
          });
        }
      }

      if (failedPayments.length > 0) {
        setSnackbar({
          open: true,
          message: `${failedPayments.length} đơn hàng thanh toán thất bại`,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi tạo thanh toán",
        severity: "error",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  // Filter orders với logic mới
  const filteredOrders = orders.filter((order) => {
    const displayStatus = getDisplayStatus(order._id);
    const matchesStatus =
      selectedStatus === "All" || displayStatus === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_address
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.total_amount.toString().includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  // Check if all payable orders are selected
  const payableOrders = filteredOrders.filter(
    (order) => getDisplayStatus(order._id) === "Processing"
  );
  const isAllSelected =
    payableOrders.length > 0 &&
    payableOrders.every((order) => selectedOrders.has(order._id));
  const isIndeterminate =
    payableOrders.some((order) => selectedOrders.has(order._id)) &&
    !isAllSelected;

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
          <Typography sx={{ ml: 2 }}>Đang tải đơn hàng...</Typography>
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
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Đơn hàng của tôi ({filteredOrders.length})
        </Typography>

        {/* Search */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <SearchIcon />
          <TextField
            placeholder="Tìm kiếm theo mã đơn hàng, địa chỉ giao hàng hoặc tổng tiền"
            variant="standard"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        {/* Status filters and Payment button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Stack direction="row" spacing={1}>
            {statusFilters.map((status) => (
              <Chip
                key={status}
                label={status}
                clickable
                variant={selectedStatus === status ? "filled" : "outlined"}
                color="default"
                onClick={() => setSelectedStatus(status)}
                sx={{
                  backgroundColor:
                    selectedStatus === status ? "#3b3a28" : undefined,
                  color: selectedStatus === status ? "white" : "black",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  padding: "8px 16px",
                  height: "40px",
                }}
              />
            ))}
          </Stack>

          {/* Payment Button */}
          {selectedOrders.size > 0 && (
            <Button
              variant="contained"
              startIcon={<PaymentIcon />}
              onClick={handlePayment}
              disabled={paymentLoading}
              sx={{
                backgroundColor: "#3b3a28",
                "&:hover": {
                  backgroundColor: "#2d2a1f",
                },
              }}
            >
              {paymentLoading
                ? "Đang xử lý..."
                : `Thanh toán (${selectedOrders.size})`}
            </Button>
          )}
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={payableOrders.length === 0}
                  />
                </TableCell>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Địa chỉ giao hàng</TableCell>
                <TableCell>Phương thức thanh toán</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">
                      Không có đơn hàng nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => {
                  const displayStatus = getDisplayStatus(order._id);
                  const isOrderSelected = selectedOrders.has(order._id);
                  const canPay = displayStatus === "Processing";
                  const isDone = displayStatus === "Done";

                  return (
                    <TableRow
                      key={order._id}
                      sx={{
                        backgroundColor: index % 2 === 1 ? "#f5f5f5" : "white",
                        opacity: canPay || isDone ? 1 : 0.6,
                      }}
                    >
                      {/* Checkbox hoặc Button xem chi tiết */}
                      <TableCell padding="checkbox">
                        {isDone ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              handleViewTransactionDetail(order._id)
                            }
                            sx={{
                              minWidth: "42px",
                              width: "42px",
                              height: "42px",
                              borderColor: "#3b3a28",
                              color: "#3b3a28",
                              borderRadius: 1,
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              "&:hover": {
                                borderColor: "#2d2a1f",
                                backgroundColor: "#f8f8f8",
                              },
                            }}
                          >
                            <VisibilityIcon sx={{ fontSize: "18px" }} />
                          </Button>
                        ) : (
                          <Checkbox
                            checked={isOrderSelected}
                            onChange={() => handleSelectOrder(order._id)}
                            disabled={!canPay}
                            sx={{
                              padding: "9px",
                            }}
                          />
                        )}
                      </TableCell>

                      {/* Order ID */}
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {order._id.slice(-8)}
                        </Typography>
                      </TableCell>

                      {/* Order Date */}
                      <TableCell>{formatDate(order.order_date)}</TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={displayStatus}
                          color={
                            displayStatus === "Processing"
                              ? "warning"
                              : displayStatus === "Done"
                              ? "success"
                              : displayStatus === "Cancelled"
                              ? "error"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>

                      {/* Total Amount */}
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {formatCurrency(order.total_amount)}
                        </Typography>
                      </TableCell>

                      {/* Shipping Address */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ maxWidth: 200 }}
                        >
                          {order.shipping_address}
                        </Typography>
                      </TableCell>

                      {/* Payment Method */}
                      <TableCell>
                        <Chip
                          label={order.payment_method}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Sử dụng TransactionDetailDialog component */}
        <TransactionDetailDialog
          open={detailDialog.open}
          onClose={handleCloseDetailDialog}
          paymentDetail={detailDialog.paymentDetail}
          loading={detailDialog.loading}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
