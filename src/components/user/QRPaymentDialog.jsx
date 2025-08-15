import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { formatCurrency } from "../../utils/format";
import vnpayQR from "../../../dist/assets/vnpayQR.jpg";

const QRPaymentDialog = ({
  open,
  onClose,
  selectedOrders,
  totalAmount,
  onConfirmPayment,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Thanh toán bằng QR Code
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", py: 3 }}>
        {/* Thông tin đơn hàng */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Tổng thanh toán: {formatCurrency(totalAmount)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedOrders.length} đơn hàng được chọn
          </Typography>
        </Box>

        {/* QR Code Image */}
        <Box sx={{ mb: 3 }}>
          <img
            src={vnpayQR}
            alt="QR Code Thanh toán"
            style={{
              width: "300px",
              height: "300px",
              objectFit: "contain",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
            }}
          />
        </Box>

        {/* Hướng dẫn */}
        <Box
          sx={{
            textAlign: "left",
            backgroundColor: "#f5f5f5",
            p: 2,
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Hướng dẫn thanh toán:
          </Typography>
          <Typography variant="body2" gutterBottom>
            1. Mở ứng dụng ngân hàng trên điện thoại
          </Typography>
          <Typography variant="body2" gutterBottom>
            2. Quét mã QR code bên trên
          </Typography>
          <Typography variant="body2" gutterBottom>
            3. Nhập số tiền: <strong>{formatCurrency(totalAmount)}</strong>
          </Typography>
          <Typography variant="body2" gutterBottom>
            4. Thực hiện thanh toán
          </Typography>
          <Typography variant="body2" color="primary">
            5. Sau khi thanh toán thành công, nhấn "Xác nhận đã thanh toán"
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
          Hủy
        </Button>
        <Button
          onClick={onConfirmPayment}
          variant="contained"
          sx={{
            backgroundColor: "#3b3a28",
            "&:hover": {
              backgroundColor: "#2d2a1f",
            },
          }}
        >
          Xác nhận đã thanh toán
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRPaymentDialog;
