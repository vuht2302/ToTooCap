import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Alert,
  Container,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        // Lấy các parameters từ URL
        const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
        const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
        const vnp_OrderInfo = searchParams.get("vnp_OrderInfo"); // Đây là payment ID
        const vnp_Amount = searchParams.get("vnp_Amount");
        const vnp_TxnRef = searchParams.get("vnp_TxnRef");
        const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");

        console.log("VNPAY Return Parameters:", {
          vnp_ResponseCode,
          vnp_TransactionStatus,
          vnp_OrderInfo,
          vnp_Amount,
          vnp_TxnRef,
          vnp_TransactionNo,
        });

        // Kiểm tra kết quả thanh toán
        if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00") {
          // Thanh toán thành công - cập nhật trạng thái payment
          await updatePaymentStatus(vnp_OrderInfo, "Done", "Online");

          setPaymentResult({
            success: true,
            message: "Thanh toán thành công!",
            paymentId: vnp_OrderInfo,
            amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : 0,
            transactionNo: vnp_TransactionNo,
            txnRef: vnp_TxnRef,
          });
        } else {
          // Thanh toán thất bại - cập nhật trạng thái payment
          await updatePaymentStatus(vnp_OrderInfo, "Failed", "Online");

          setPaymentResult({
            success: false,
            message: getErrorMessage(vnp_ResponseCode),
            paymentId: vnp_OrderInfo,
            amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : 0,
            responseCode: vnp_ResponseCode,
          });
        }
      } catch (error) {
        console.error("Error processing payment result:", error);
        setPaymentResult({
          success: false,
          message: "Có lỗi xảy ra khi xử lý kết quả thanh toán",
        });
      } finally {
        setLoading(false);
      }
    };

    processPaymentResult();
  }, [searchParams]);

  // Function để cập nhật trạng thái thanh toán
  const updatePaymentStatus = async (paymentId, status, method) => {
    try {
      const token = localStorage.getItem("accessToken");

      console.log("Updating payment status:", { paymentId, status, method }); // Debug log

      const response = await fetch(
        `http://54.169.159.141:3000/payment/update/${paymentId}`,
        {
          method: "PUT", // hoặc PATCH tùy theo API của bạn
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            payment_status: status,
            payment_method: method,
          }),
        }
      );

      const data = await response.json();
      console.log("Payment status update response:", data); // Debug log

      if (response.ok && data.success) {
        console.log("Payment status updated successfully");
        return data;
      } else {
        console.error("Failed to update payment status:", data.message);
        throw new Error(
          data.message || "Không thể cập nhật trạng thái thanh toán"
        );
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      // Không throw error để không làm crash UI
    }
  };

  // Function để lấy thông báo lỗi dựa trên response code
  const getErrorMessage = (responseCode) => {
    const errorMessages = {
      "01": "Giao dịch chưa hoàn tất",
      "02": "Giao dịch bị lỗi",
      "04": "Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)",
      "05": "VNPAY đang xử lý giao dịch này (GD hoàn tiền)",
      "06": "VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)",
      "07": "Giao dịch bị nghi ngờ gian lận",
      "09": "GD Hoàn trả bị từ chối",
      10: "Đã giao hàng",
      20: "Đã thu tiền của khách",
      21: "Giao dịch chưa được thanh toán",
      22: "Giao dịch bị hủy",
      30: "Giao dịch chưa được xác nhận",
      40: "Giao dịch bị từ chối thanh toán",
      51: "Tài khoản không đủ số dư",
      65: "Tài khoản bị hạn chế",
      75: "Ngân hàng bảo trì",
      79: "KH nhập sai mật khẩu quá số lần quy định",
      99: "Lỗi không xác định",
    };

    return errorMessages[responseCode] || "Giao dịch không thành công";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6">Đang xử lý kết quả thanh toán...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          {paymentResult?.success ? (
            <>
              <CheckCircleIcon
                sx={{
                  fontSize: 80,
                  color: "success.main",
                  mb: 2,
                }}
              />
              <Typography variant="h4" color="success.main" gutterBottom>
                Thanh toán thành công!
              </Typography>
              <Alert severity="success" sx={{ mb: 3 }}>
                {paymentResult.message}
              </Alert>
            </>
          ) : (
            <>
              <ErrorIcon
                sx={{
                  fontSize: 80,
                  color: "error.main",
                  mb: 2,
                }}
              />
              <Typography variant="h4" color="error.main" gutterBottom>
                Thanh toán thất bại!
              </Typography>
              <Alert severity="error" sx={{ mb: 3 }}>
                {paymentResult?.message}
              </Alert>
            </>
          )}

          {/* Chi tiết giao dịch */}
          <Box sx={{ mt: 3, textAlign: "left" }}>
            <Typography variant="h6" gutterBottom>
              Chi tiết giao dịch:
            </Typography>
            {paymentResult?.paymentId && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Mã thanh toán:</strong> {paymentResult.paymentId}
              </Typography>
            )}
            {paymentResult?.amount && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Số tiền:</strong> {formatCurrency(paymentResult.amount)}
              </Typography>
            )}
            {paymentResult?.transactionNo && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Mã giao dịch:</strong> {paymentResult.transactionNo}
              </Typography>
            )}
            {paymentResult?.txnRef && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Mã tham chiếu:</strong> {paymentResult.txnRef}
              </Typography>
            )}
          </Box>

          {/* Buttons */}
          <Box
            sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/orders")}
              size="large"
            >
              Xem đơn hàng
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              size="large"
              sx={{
                backgroundColor: "#3b3a28",
                "&:hover": {
                  backgroundColor: "#2d2a1f",
                },
              }}
            >
              Về trang chủ
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PaymentReturn;
