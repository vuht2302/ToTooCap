import React from "react";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f9f9f9">
      <Sidebar />
      <Box flex={1}>{children}</Box>
    </Box>
  );
};

export default Layout;
