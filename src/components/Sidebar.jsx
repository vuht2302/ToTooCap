import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
} from "@mui/material";

import {
  Home,
  Notifications,
  Inventory,
  LocalOffer,
  LocalShipping,
  Favorite,
  EmojiEvents,
  HelpOutline,
  AccountCircle,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

import NotificationModal from "../pages/user/NotificationModal";
import CatalogModal from "../pages/user/CatalogModal";
import { UserContext } from "../context/UserContext";

const drawerWidth = 240;

const Sidebar = () => {
  const [openNotification, setOpenNotification] = useState(false);
  const [openCatalogModal, setOpenCatalogModal] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleDashboardClick = () => navigate("/");
const handleAccountClick = () => {
  if (user) {
    navigate("/user"); 
  } else {
    navigate("/login");
  }
};  const handleMyProductsClick = () => navigate("/my-products");
  const handleBrandingClick = () => navigate("/branding-gift");
  const handleOrdersClick = () => navigate("/orders");
  const handlePremiumClick = () => navigate("/premium");
  const handleNotificationsClick = () => setOpenNotification(true);
  const handleCatalogClick = () => setOpenCatalogModal(true);

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#d9d6c9",
            paddingTop: 2,
          },
        }}
      >
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontFamily: "serif", fontSize: "35px" }}
          >
            ToTooCap
          </Typography>
          <Typography variant="body2">My new store ▾</Typography>
        </Box>

        <List>
          <ListItem button onClick={handleDashboardClick}>
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button onClick={handleNotificationsClick}>
            <ListItemIcon><Notifications /></ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItem>

          <ListItem button onClick={handleCatalogClick}>
            <ListItemIcon><Inventory /></ListItemIcon>
            <ListItemText primary="Catalog" />
          </ListItem>

          <ListItem button onClick={handleMyProductsClick}>
            <ListItemIcon><LocalOffer /></ListItemIcon>
            <ListItemText primary="My products" />
          </ListItem>

          <ListItem button onClick={handleOrdersClick}>
            <ListItemIcon><LocalShipping /></ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>

          <ListItem button onClick={handleBrandingClick}>
            <ListItemIcon><Favorite /></ListItemIcon>
            <ListItemText primary="Branding" />
          </ListItem>

          <ListItem button onClick={handlePremiumClick}>
            <ListItemIcon><EmojiEvents /></ListItemIcon>
            <ListItemText primary="Printify Premium" />
          </ListItem>

          <ListItem button onClick={() => setOpenHelp(!openHelp)}>
            <ListItemIcon><HelpOutline /></ListItemIcon>
            <ListItemText primary="Need help?" />
            {openHelp ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openHelp} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Add help subitems if needed */}
            </List>
          </Collapse>
        </List>

        <Box sx={{ mt: "auto", p: 2 }}>
          <ListItem button onClick={handleAccountClick}>
            <ListItemIcon><AccountCircle /></ListItemIcon>
            <ListItemText
              primary="Account"
              secondary={user?.username || "Login/Register"}
            />
          </ListItem>
        </Box>
      </Drawer>

      <NotificationModal
        open={openNotification}
        onClose={() => setOpenNotification(false)}
      />
      <CatalogModal
        open={openCatalogModal}
        onClose={() => setOpenCatalogModal(false)}
      />
    </>
  );
};

export default Sidebar;
