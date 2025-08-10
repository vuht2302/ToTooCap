import React from "react";
import Layout from "../../components/Layout";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const products = [
    {
      id: 1,
      name: "Baseball Cap A",
      price: "200,000 VND",
      image: "/images/hat-product.png",
    },
    {
      id: 2,
      name: "Baseball Cap B",
      price: "180,000 VND",
      image: "/images/cap2.png",
    },
  ];

  return (
    <Layout>
      <Box p={4}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} md={4} key={product.id}>
              <Card sx={{ cursor: "pointer" }} elevation={3}>
                <CardContent>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    {product.name}
                  </Typography>
                  <Typography variant="body1">{product.price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default DashboardPage;
