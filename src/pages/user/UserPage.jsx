import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../../components/Sidebar";
import { Box, Typography, TextField, Button, Paper, Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import { UserContext } from "../../context/UserContext";

const UserPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "huyvu230203@gmail.com",
    phone: "",
    address1: "",
  });
  const navigate = useNavigate(); // Initialize navigate
  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };
  const { user } = useContext(UserContext);
  useEffect(() => {
    const userData = user || JSON.parse(localStorage.getItem("user"));

    if (userData) {
      setFormData((prev) => ({
        ...prev,
        fullName: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address1: userData.address || "",
      }));
    }
  }, [user]);
  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data from localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My account
        </Typography>

        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 1 }}>
          {/* Contact Details */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact details
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              This information will appear on your invoices
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 700 }}
                  label="Full name *"
                  variant="outlined"
                  value={formData.fullName}
                  onChange={handleInputChange("fullName")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 700 }}
                  label="Email *"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  type="email"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 700 }}
                  label="Phone *"
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleInputChange("phone")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 700 }}
                  label="Address *"
                  variant="outlined"
                  value={formData.address1}
                  onChange={handleInputChange("address1")}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={4}>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{ textTransform: "none" }}
            >
              Log Out
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default UserPage;
