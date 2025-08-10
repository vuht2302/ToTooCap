import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function VNPayCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const callbackUrl = window.location.href;

        const response = await fetch(
          "http://54.169.159.141:3000/payment/vnpay/return",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");
          setMessage("Thanh toán thành công!");
          // Xóa checkout products
          localStorage.removeItem("checkoutProducts");
        } else {
          setStatus("error");
          setMessage(data.message || "Thanh toán thất bại");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Có lỗi xảy ra khi xử lý thanh toán");
      }
    };

    handleCallback();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 4,
      }}
    >
      {status === "processing" && (
        <>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6">{message}</Typography>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircleIcon
            sx={{ fontSize: 80, color: "success.main", mb: 2 }}
          />
          <Typography variant="h5" fontWeight="bold" mb={1}>
            {message}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/orders")}
            sx={{ mr: 2 }}
          >
            Xem đơn hàng
          </Button>
          <Button variant="outlined" onClick={() => navigate("/products")}>
            Tiếp tục mua sắm
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" mb={1}>
            {message}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Vui lòng thử lại hoặc liên hệ hỗ trợ.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/checkout")}
            sx={{ mr: 2 }}
          >
            Thử lại
          </Button>
          <Button variant="outlined" onClick={() => navigate("/products")}>
            Về trang chủ
          </Button>
        </>
      )}
    </Box>
  );
}
