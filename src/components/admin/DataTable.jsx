import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import { MoreVert, TrendingUp, TrendingDown } from "@mui/icons-material";

const sampleData = [
  {
    id: 1,
    product: "Custom T-Shirt",
    customer: "John Doe",
    status: "Completed",
    amount: "$45.00",
    date: "2024-01-15",
    change: "+12%",
    changeType: "increase",
  },
  {
    id: 2,
    product: "Baseball Cap",
    customer: "Jane Smith",
    status: "Processing",
    amount: "$28.50",
    date: "2024-01-14",
    change: "+8%",
    changeType: "increase",
  },
  {
    id: 3,
    product: "Hoodie Design",
    customer: "Mike Johnson",
    status: "Pending",
    amount: "$65.00",
    date: "2024-01-13",
    change: "-3%",
    changeType: "decrease",
  },
  {
    id: 4,
    product: "Mug Print",
    customer: "Sarah Wilson",
    status: "Completed",
    amount: "$15.75",
    date: "2024-01-12",
    change: "+25%",
    changeType: "increase",
  },
  {
    id: 5,
    product: "Phone Case",
    customer: "David Brown",
    status: "Cancelled",
    amount: "$22.00",
    date: "2024-01-11",
    change: "-15%",
    changeType: "decrease",
  },
];

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "processing":
      return "warning";
    case "pending":
      return "info";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const AdminDataTable = ({ title = "Recent Orders" }) => {
  return (
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
          <Typography variant="h6">{title}</Typography>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Change</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{ width: 32, height: 32, bgcolor: "primary.light" }}
                      >
                        {row.product.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {row.product}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.customer}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {row.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {row.changeType === "increase" ? (
                        <TrendingUp
                          sx={{ fontSize: 16, color: "success.main" }}
                        />
                      ) : (
                        <TrendingDown
                          sx={{ fontSize: 16, color: "error.main" }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        color={
                          row.changeType === "increase"
                            ? "success.main"
                            : "error.main"
                        }
                        fontWeight="medium"
                      >
                        {row.change}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default AdminDataTable;
