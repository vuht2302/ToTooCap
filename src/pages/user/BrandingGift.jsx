import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import Sidebar from '../../components/Sidebar';
const cardData = [
  {
    title: 'Packing inserts',
    description:
      'Add a 4” x 6” (10.2cm x 15.2cm) insert card to show off your brand identity and leave a message to your customer.',
    cost: '2,000 VND Per insert',
    button: 'Set up package inserts',
    image: 'https://subiz.com.vn/blog/wp-content/uploads/2023/07/subiz-top-4-thuong-vu-co-branding-thanh-cong-noi-tieng-tren-the-gioi.jpg', // Bạn thay bằng hình thật hoặc link tương ứng
  },
  {
    title: 'Gift messages',
    description:
      'Create a gift message template using a logo and customized fonts to match the look and feel of your store.',
    cost: '2,000 VND Per insert',
    button: 'Set up gift messages',
    image: 'https://subiz.com.vn/blog/wp-content/uploads/2023/07/subiz-top-4-thuong-vu-co-branding-thanh-cong-noi-tieng-tren-the-gioi.jpg', // Thay bằng ảnh tương ứng
  },
];

export default function BrandingGift() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={4}>
          Branding & gift messages
        </Typography>
        <Grid container spacing={4}>
          {cardData.map((card, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {card.image && (
                  <CardMedia
                    component="img"
                    image={card.image}
                    alt={card.title}
                     sx={{
    height: 400,
    objectFit: 'contain',
    backgroundColor: '#f5f5f5', // để lấp khoảng trống nếu có
  }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    {card.description}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" mb={1}>
                    Cost
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    {card.cost}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    Availability
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button variant="contained" color="primary"  sx={{ backgroundColor: '#3b3a28' }}>
                    {card.button}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
