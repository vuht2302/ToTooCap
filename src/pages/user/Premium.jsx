import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Sidebar from '../../components/Sidebar';
export default function Premium() {
  const [plan, setPlan] = React.useState('monthly');

  const handleChange = (_, newPlan) => {
    if (newPlan) setPlan(newPlan);
  };

  const products = [
    {
      name: 'Mũ Teddy - Phong cách trẻ trung',
      price: '250.000 VND',
      discount: '225.000 VND',
      save: '25.000 VND',
      image: 'https://nonson.vn/vnt_upload/product/NON_KET/MC001/DN1/thumbs/600_crop_nonson_06.png',
    },
    {
      name: 'Mũ Teddy - Phong cách trẻ trung',
      price: '200.000 VND',
      discount: '180.000 VND',
      save: '20.000 VND',
      image: 'https://nonson.vn/vnt_upload/product/NON_KET/MC001/DN1/thumbs/600_crop_nonson_06.png',
    },
    {
      name: 'Mũ Teddy - Phong cách trẻ trung',
      price: '250.000 VND',
      discount: '225.000 VND',
      save: '25.000 VND',
      image: 'https://nonson.vn/vnt_upload/product/NON_KET/MC001/DN1/thumbs/600_crop_nonson_06.png',
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
       <Box
  sx={{
    backgroundColor: '#3b3a28',
    color: '#fff',
    px: 10,
    py: 6,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>
  {/* Left - Text */}
  <Box sx={{ flex: 1 }}>
    <Typography
      variant="h3"
      fontWeight="bold"
      align="left"
      sx={{ color: '#fff', mb: 1}}
    >
      SUBSCRIBE TO PREMIUM
    </Typography>
    <Typography variant="h6" sx={{ color: '#fff' }}>
      Get up 10% discount on all products
    </Typography>
  </Box>

  {/* Right - Box Plan */}
  <Box
    sx={{
      backgroundColor: '#fff',
      color: '#000',
      p: 3,
      borderRadius: 2,
      width: 500,
      boxShadow: 3,
    }}
  >
    <ToggleButtonGroup
      value={plan}
      exclusive
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
    >
      <ToggleButton value="monthly" sx={{ textTransform: 'none', fontSize: '1rem' }}>
        Monthly
      </ToggleButton>
      <ToggleButton value="yearly" sx={{ textTransform: 'none', fontSize: '1rem' }}>
        Year
      </ToggleButton>
    </ToggleButtonGroup>

    <Typography fontWeight="bold" fontSize="1.2rem" mb={2}>
      VND 99,000 / per month
    </Typography>

    <List dense>
      <ListItem disablePadding>
        <ListItemIcon>
          <CheckIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Unlimited product designs" />
      </ListItem>
      <ListItem disablePadding>
        <ListItemIcon>
          <CheckIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Up to 10% discount on all products" />
      </ListItem>
    </List>

    <Button
      variant="contained"
  
      sx={{
        mt: 2,
        backgroundColor: '#60e577',
        color: '#000',
        fontWeight: 'bold',
        px: 4,
        mx: 'auto',
        display: 'block',
      }}
    >
      GET STARTED
    </Button>
  </Box>
</Box>

        {/* Discount Section */}
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>Discount Example</Typography>
          <Grid container spacing={3}>
            {products.map((item, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card>
                  <CardMedia component="img" height="180" image={item.image} alt={item.name} sx={{ objectFit: 'cover' }} />
                  <CardContent>
                    <Typography variant="body1" fontWeight="medium">{item.name}</Typography>
                    <Typography variant="body2">
                      <b>Price:</b> {item.price}
                    </Typography>
                    <Typography variant="body2">
                      <b>Discount:</b> {item.discount}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      <b>Saving:</b> {item.save}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
