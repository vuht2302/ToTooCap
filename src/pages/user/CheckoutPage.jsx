import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const currency = (n) =>
  (Number(n) || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [shippingAddress, setShippingAddress] = useState("");
  const [orderDate, setOrderDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [paymentMethod, setPaymentMethod] = useState("Online"); // UI hiển thị Capitalize
  const [submitting, setSubmitting] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false); // Thêm state này
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [items, setItems] = useState([]);
  const FIELD_W = { xs: "100%", sm: 420, md: 600 };
  useEffect(() => {
    try {
      const raw = localStorage.getItem("checkoutProducts");
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
        0
      ),
    [items]
  );

  const handleSubmit = async () => {
    if (!user?._id) {
      setSnackbar({
        open: true,
        message: "Bạn cần đăng nhập trước khi đặt hàng.",
        severity: "error",
      });
      return;
    }
    if (!items.length) {
      setSnackbar({
        open: true,
        message: "Giỏ hàng trống.",
        severity: "error",
      });
      return;
    }
    if (!shippingAddress.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập địa chỉ giao hàng.",
        severity: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://54.169.159.141:3000/order/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_id: user._id,
          order_date: orderDate,
          shipping_address: shippingAddress,
          payment_method: paymentMethod, // API đang dùng lowercase: "online" | "cod"
        }),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        setSnackbar({
          open: true,
          message: "Tạo đơn hàng thành công!",
          severity: "success",
        });
        // Optional: localStorage.removeItem('checkoutProducts');
        setTimeout(() => navigate("/orders"), 1000);
      } else {
        setSnackbar({
          open: true,
          message: data?.message || "Tạo đơn hàng thất bại.",
          severity: "error",
        });
      }
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, width: "100%", px: { xs: 2, md: 4 }, py: 4 }}>
        <Box sx={{ maxWidth: "1440px", mx: "auto" }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Checkout
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 340px" }, // trái linh hoạt, phải 340px
              gap: 4,
              alignItems: "start",
            }}
          >
            {/* LEFT: Thông tin đơn hàng */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Thông tin đơn hàng
              </Typography>

              {/* Giữ nguyên Grid của form bên trong */}
              <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="User ID"
                    value={user?._id || ""}
                    size="small"
                    sx={{ width: FIELD_W }}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Ngày đặt"
                    type="date"
                    size="small"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: FIELD_W }}
                  />
                </Grid>

                {/* <Grid item xs={12}>
                  <TextField
                    label="First name"
                    placeholder="Nguyễn"
                    size="small"
                    sx={{ width: FIELD_W }}
                  />
                </Grid> */}

                {/* <Grid item xs={12}>
                  <TextField
                    label="Last name"
                    placeholder="Văn A"
                    size="small"
                    sx={{ width: FIELD_W }}
                  />
                </Grid> */}

                <Grid item xs={12}>
                  <TextField
                    label="Địa chỉ giao hàng"
                    placeholder="Số nhà, đường, quận/huyện, thành phố"
                    multiline
                    minRows={3}
                    size="small"
                    sx={{ width: FIELD_W }} // địa chỉ có thể rộng hơn
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl size="small" sx={{ width: FIELD_W }}>
                    <InputLabel>Phương thức thanh toán</InputLabel>
                    <Select
                      label="Phương thức thanh toán"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <MenuItem value="Online">Online</MenuItem>
                      <MenuItem value="COD">COD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    placeholder="+84"
                    size="small"
                    sx={{ width: FIELD_W }}
                  />
                </Grid> */}
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting || items.length === 0}
                >
                  Xác nhận đặt hàng
                </Button>
              </Box>
            </Paper>

            {/* RIGHT: Tóm tắt đơn hàng (sticky) */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                position: { md: "sticky" },
                top: { md: 88 }, // chỉnh theo chiều cao header
                height: "fit-content",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Tóm tắt đơn hàng
              </Typography>

              {items.length === 0 ? (
                <Typography color="text.secondary">
                  Không có sản phẩm được chọn.
                </Typography>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {items.map((it, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <Avatar
                          variant="rounded"
                          src={it.image_url}
                          alt={it.name}
                          sx={{ width: 56, height: 56, bgcolor: "grey.100" }}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            noWrap
                            fontWeight={600}
                            title={it.name}
                          >
                            {it.name || "Sản phẩm"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            SL: {Number(it.quantity) || 1}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {(
                          (Number(it.price) || 0) * (Number(it.quantity) || 1)
                        ).toFixed(2)}
                        $
                      </Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 1.5 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography fontWeight={600}>
                      {items
                        .reduce(
                          (s, it) =>
                            s +
                            (Number(it.price) || 0) *
                              (Number(it.quantity) || 1),
                          0
                        )
                        .toFixed(2)}
                      $
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary">
                      Estimated Tax
                    </Typography>
                    <Typography fontWeight={600}>—</Typography>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography fontWeight={700}>Estimated Total</Typography>
                    <Typography fontWeight={800}>
                      {items
                        .reduce(
                          (s, it) =>
                            s +
                            (Number(it.price) || 0) *
                              (Number(it.quantity) || 1),
                          0
                        )
                        .toFixed(2)}
                      $
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Snackbar giữ nguyên */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
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
    </Box>
  );
};

export default CheckoutPage;
