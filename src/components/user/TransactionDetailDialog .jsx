import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";

const TransactionDetailDialog = ({
  open,
  onClose,
  paymentDetail,
  loading = false,
}) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Format datetime
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          borderBottom: "1px solid #f0f0f0",
          pb: 2,
        }}
      >
        <Typography variant="h6" component="div">
          Chi tiết giao dịch
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <Typography>Đang tải...</Typography>
          </Box>
        ) : paymentDetail ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Mã giao dịch */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Mã giao dịch:
              </Typography>
              <Typography
                variant="body1"
                fontWeight="500"
                sx={{
                  backgroundColor: "#f8f9fa",
                  padding: "8px 12px",
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                }}
              >
                {paymentDetail._id}
              </Typography>
            </Box>

            {/* Mã đơn hàng */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Mã đơn hàng:
              </Typography>
              <Typography
                variant="body1"
                fontWeight="500"
                sx={{
                  backgroundColor: "#f8f9fa",
                  padding: "8px 12px",
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                }}
              >
                {paymentDetail.order_id}
              </Typography>
            </Box>

            {/* Số tiền */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Số tiền:
              </Typography>
              <Typography
                variant="h6"
                fontWeight="600"
                color="success.main"
                sx={{
                  backgroundColor: "#e8f5e8",
                  padding: "8px 12px",
                  borderRadius: 1,
                }}
              >
                {formatCurrency(paymentDetail.amount)}
              </Typography>
            </Box>

            {/* Trạng thái */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Trạng thái:
              </Typography>
              <Chip
                label={paymentDetail.payment_status}
                color={
                  paymentDetail.payment_status === "Done"
                    ? "success"
                    : paymentDetail.payment_status === "Failed"
                    ? "error"
                    : "warning"
                }
                size="medium"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              />
            </Box>

            {/* Phương thức thanh toán */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Phương thức thanh toán:
              </Typography>
              <Chip
                label={paymentDetail.payment_method}
                variant="outlined"
                size="medium"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              />
            </Box>

            {/* Ngày tạo */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5, fontWeight: 500 }}
              >
                Ngày tạo:
              </Typography>
              <Typography variant="body1">
                {formatDateTime(paymentDetail.createdAt)}
              </Typography>
            </Box>

            {/* Ngày thanh toán */}
            {paymentDetail.payment_date && (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 0.5, fontWeight: 500 }}
                >
                  Ngày thanh toán:
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="500"
                  color="success.main"
                >
                  {formatDateTime(paymentDetail.payment_date)}
                </Typography>
              </Box>
            )}

            {/* Thời gian cập nhật */}
            {paymentDetail.updatedAt &&
              paymentDetail.updatedAt !== paymentDetail.createdAt && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 0.5, fontWeight: 500 }}
                  >
                    Cập nhật lần cuối:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDateTime(paymentDetail.updatedAt)}
                  </Typography>
                </Box>
              )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <Typography color="text.secondary">
              Không có thông tin giao dịch
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: "1px solid #f0f0f0",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            minWidth: 100,
          }}
        >
          Đóng
        </Button>

        {/* Có thể thêm các action khác như In, Xuất PDF */}
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetailDialog;
