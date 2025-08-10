import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Sidebar from '../../components/Sidebar';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { UserContext } from '../../context/UserContext';
const countries = [
  'Vietnam',
  'United States',
  'Germany',
  'France',
  'Japan'
];

const UserPage = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    fullName: '',
    email: 'huyvu230203@gmail.com',
    phone: '',
    country: '',
    state: '',
    address1: '',
    address2: '',
    city: '',
    zipCode: ''
  });
  const navigate = useNavigate(); // Initialize navigate
  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };
  const { user } = useContext(UserContext);
  useEffect(() => {
  const userData = user || JSON.parse(localStorage.getItem('user'));

  if (userData) {
    setFormData((prev) => ({
      ...prev,
      fullName: userData.username || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address1: userData.address || '',
    }));
  }
}, [user]);
const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data from localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My account
        </Typography>

        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 1 }}>
          {/* Business Name */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Business name
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              This information will appear on your invoices
            </Typography>
            <TextField
              sx={{ width: 700 }}
              label="Name of business *"
              variant="outlined"
              value={formData.businessName}
              onChange={handleInputChange('businessName')}
            />
          </Box>

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
        onChange={handleInputChange('fullName')}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        sx={{ width: 700 }}
        label="Email *"
        variant="outlined"
        value={formData.email}
        onChange={handleInputChange('email')}
        type="email"
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
         sx={{ width: 700 }}
        label="Phone *"
        variant="outlined"
        value={formData.phone}
        onChange={handleInputChange('phone')}
      />
    </Grid>
  </Grid>

  <Box mt={1}>
    <Button
      variant="text"
      startIcon={<Add />}
      sx={{ color: '#666', textTransform: 'none', fontSize: '14px', pl: 0 }}
    >
      Add an additional phone number
    </Button>
  </Box>
</Box>

          {/* Address */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Address
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              This information will appear on your invoices
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                   sx={{ width: 500 }}
                  label="Country *"
                  variant="outlined"
                  value={formData.country}
                  onChange={handleInputChange('country')}
                >
                  <MenuItem value="">Choose Country</MenuItem>
                  {countries.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                   sx={{ width: 500 }}
                  label="State / Province"
                  variant="outlined"
                  value={formData.state}
                  onChange={handleInputChange('state')}
                />
              </Grid>
              <Grid item xs={12 } md={6}>
                <TextField
                  sx={{ width: 800 }}
                  label="Address 1 *"
                  variant="outlined"
                  value={formData.address1}
                  onChange={handleInputChange('address1')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                   sx={{ width: 800 }}
                  label="Address 2 (optional)"
                  variant="outlined"
                  value={formData.address2}
                  onChange={handleInputChange('address2')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: 800 }}
                  label="City *"
                  variant="outlined"
                  value={formData.city}
                  onChange={handleInputChange('city')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                   sx={{ width: 300 }}
                  label="ZIP code *"
                  variant="outlined"
                  value={formData.zipCode}
                  onChange={handleInputChange('zipCode')}
                />
              </Grid>
            </Grid>
            <Box mt={2}>
              <Button
                variant="text"
                startIcon={<Add />}
                sx={{ color: '#666', textTransform: 'none', fontSize: '14px' }}
              >
                Use a different address for receiving product samples
              </Button>
            </Box>
          </Box>
          <Box mt={4}>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{ textTransform: 'none' }}
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
