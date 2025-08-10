import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import Sidebar from "../../components/Sidebar"; // Adjust the import path as necessary
const PaymentPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={4}>
          Payments
        </Typography>

        {/* Balance Section */}
        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          Balance
        </Typography>

        <Paper
          elevation={2}
          sx={{
            width: 300,
            height: 120,
            bgcolor: "#373406", // màu tối giống ảnh
            color: "#fff",
            borderRadius: 1,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="body2" fontWeight="bold">
              Current Balance
            </Typography>
            <Typography variant="h6">0.00 VND</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" fontWeight="bold">
              Pay With
            </Typography>
            <img
              src="/images/momo-logo.png"
              alt="momo"
              style={{ height: 20 }}
            />
            <img
              src="/images/love-payment.png"
              alt="lovepay"
              style={{ height: 20 }}
            />
          </Box>
        </Paper>

        {/* Payment Card Section */}
        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          Payment card
        </Typography>
        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 0,
            px: 3,
            py: 1,
            fontWeight: "bold",
            borderColor: "#000",
          }}
        >
          + Add Card
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentPage;
