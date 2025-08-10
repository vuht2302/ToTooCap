import React from "react";
import AdminSidebar from "./AdminSidebar";
import { Box } from "@mui/material";

const AdminLayout = ({ children }) => {
  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f8f9fa">
      <AdminSidebar />
      <Box flex={1} sx={{ marginLeft: 0 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;