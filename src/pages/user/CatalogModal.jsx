import React from "react";
import {
  Box,
  Modal,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 240, // Đúng chiều rộng sidebar
  width: 500,
  height: "100vh",
  bgcolor: "#fff",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
  zIndex: 1300,
};

const CatalogModal = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      disableAutoFocus
    //   hideBackdrop // ẩn overlay xám mờ
    //   sx={{ pointerEvents: "none" }} // để modal không block click toàn màn hình
    >
      <Box sx={{ ...modalStyle, pointerEvents: "auto" }}>
        <Grid container spacing={2}>
          {/* Tabs Section */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Paper sx={{ p: 1.5, bgcolor: "#e5e3d8", fontWeight: "bold" }}>
                  Category 1
                </Paper>
              </Grid>
              <Grid item>
                <Paper sx={{ p: 1.5, bgcolor: "#e5e3d8", fontWeight: "bold" }}>
                  Products Hots
                </Paper>
              </Grid>
              <Grid item>
                <Paper sx={{ p: 1.5, bgcolor: "#e5e3d8", fontWeight: "bold" }}>
                  New products
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Catalog Columns */}
          <Grid item xs={3}>
            <Typography fontWeight="bold" mb={1}>Catalog Home</Typography>
            <List dense>
              <ListItem disablePadding><ListItemText primary="Bestsellers" /></ListItem>
              <ListItem disablePadding><ListItemText primary="Personalization Picks" /></ListItem>
            </List>
          </Grid>

          <Grid item xs={3}>
            <Typography fontWeight="bold" mb={1}>Men’s Hat</Typography>
            <List dense>
              <ListItem disablePadding><ListItemText primary="Cap" /></ListItem>
              <ListItem disablePadding><ListItemText primary="Snapback" /></ListItem>
              <ListItem disablePadding><ListItemText primary="Bucket" /></ListItem>
              <ListItem disablePadding><ListItemText primary="Baseball" /></ListItem>
              <ListItem disablePadding><ListItemText primary="Beret" /></ListItem>
              <ListItem disablePadding><ListItemText primary="Fedora" /></ListItem>
            </List>
          </Grid>

          <Grid item xs={3}>
            <Typography fontWeight="bold" mb={1}>Women’s Hat</Typography>
            <List dense>
              <ListItem disablePadding><ListItemText primary="Wide-brim" /></ListItem>
              <ListItem disablePadding><ListItemText primary="Beanie" /></ListItem>
            </List>
          </Grid>

          <Grid item xs={3}>
            <Typography fontWeight="bold" mb={1}>Kid’s Hat</Typography>
            <List dense>
              <ListItem disablePadding><ListItemText primary="Cartoon" /></ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CatalogModal;
