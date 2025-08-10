import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar,
  Collapse,
  ListItemButton
} from "@mui/material";
import {
  Dashboard,
  People,
  ShoppingCart,
  Inventory,
  Assessment,
  Settings,
  HelpOutline,
  AccountCircle,
  ExitToApp,
  ExpandLess,
  ExpandMore,
  Store,
  Category,
  LocalShipping,
  Payment,
  Notifications,
  Security,
  Image,
} from "@mui/icons-material";

const drawerWidth = 280;

const AdminSidebar = () => {
  const [openUtilities, setOpenUtilities] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      title: "Navigation",
      items: [
        {
          text: "Dashboard",
          icon: <Dashboard />,
          path: "/admin"
        }
      ]
    },
    {
      title: "Management",
      items: [
        {
          text: "Quản lý người dùng",
          icon: <People />,
          path: "/admin/users"
        },
        {
          text: "Quản lý đơn hàng",
          icon: <ShoppingCart />,
          path: "/admin/orders"
        },
        {
          text: "Quản lý sản phẩm",
          icon: <Inventory />,
          path: "/admin/products"
        },
        {
          text: "Quản lý danh mục",
          icon: <Category />,
          path: "/admin/categories"
        },
        {
          text: "Quản lý ảnh sản phẩm",
          icon: <Image />,
          path: "/admin/images"
        }
      ]
    },
    {
      title: "Analytics",
      items: [
        {
          text: "Báo cáo doanh thu",
          icon: <Assessment />,
          path: "/admin/reports"
        },
        {
          text: "Thống kê",
          icon: <Assessment />,
          path: "/admin/analytics"
        }
      ]
    },
    {
      title: "Utilities",
      items: [
        {
          text: "Cài đặt hệ thống",
          icon: <Settings />,
          hasSubmenu: true,
          submenu: [
            { text: "General Settings", path: "/admin/settings/general" },
            { text: "Payment Settings", path: "/admin/settings/payment" },
            { text: "Email Settings", path: "/admin/settings/email" }
          ]
        },
        {
          text: "Thông báo",
          icon: <Notifications />,
          path: "/admin/notifications"
        },
        {
          text: "Bảo mật",
          icon: <Security />,
          path: "/admin/security"
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          text: "Hỗ trợ",
          icon: <HelpOutline />,
          hasSubmenu: true,
          submenu: [
            { text: "FAQ", path: "/admin/support/faq" },
            { text: "Contact Support", path: "/admin/support/contact" },
            { text: "Documentation", path: "/admin/support/docs" }
          ]
        }
      ]
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleUtilitiesClick = () => {
    setOpenUtilities(!openUtilities);
  };

  const handleSupportClick = () => {
    setOpenSupport(!openSupport);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#fff",
          borderRight: "1px solid #e0e0e0",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)"
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: "#1976d2", 
              width: 32, 
              height: 32,
              fontSize: "1rem"
            }}
          >
            <Store />
          </Avatar>
          <Typography
            variant="h6"
            sx={{ 
              fontWeight: "bold", 
              color: "#333",
              fontSize: "1.25rem"
            }}
          >
            ToTooCap Admin
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {navigationItems.map((section, sectionIndex) => (
          <Box key={sectionIndex}>
            <Typography
              variant="caption"
              sx={{
                px: 3,
                py: 2,
                display: "block",
                color: "#999",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "0.75rem"
              }}
            >
              {section.title}
            </Typography>
            
            <List sx={{ px: 2, py: 0 }}>
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={itemIndex}>
                  <ListItemButton
                    onClick={() => {
                      if (item.hasSubmenu) {
                        if (section.title === "Utilities") {
                          handleUtilitiesClick();
                        } else if (section.title === "Support") {
                          handleSupportClick();
                        }
                      } else {
                        handleNavigation(item.path);
                      }
                    }}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      backgroundColor: isActive(item.path) ? "#e3f2fd" : "transparent",
                      color: isActive(item.path) ? "#1976d2" : "#666",
                      "&:hover": {
                        backgroundColor: "#f5f5f5"
                      }
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: isActive(item.path) ? "#1976d2" : "#666",
                        minWidth: 40
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: isActive(item.path) ? 600 : 400
                      }}
                    />
                    {item.hasSubmenu && (
                      (section.title === "Utilities" && openUtilities) ||
                      (section.title === "Support" && openSupport) ? 
                      <ExpandLess /> : <ExpandMore />
                    )}
                  </ListItemButton>

                  {/* Submenu for Utilities */}
                  {item.hasSubmenu && section.title === "Utilities" && (
                    <Collapse in={openUtilities} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ pl: 2 }}>
                        {item.submenu?.map((subItem, subIndex) => (
                          <ListItemButton
                            key={subIndex}
                            onClick={() => handleNavigation(subItem.path)}
                            sx={{
                              borderRadius: 2,
                              mb: 0.5,
                              backgroundColor: isActive(subItem.path) ? "#e3f2fd" : "transparent",
                              "&:hover": {
                                backgroundColor: "#f5f5f5"
                              }
                            }}
                          >
                            <ListItemText 
                              primary={subItem.text}
                              primaryTypographyProps={{
                                fontSize: "0.8rem",
                                color: isActive(subItem.path) ? "#1976d2" : "#666",
                                fontWeight: isActive(subItem.path) ? 600 : 400
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}

                  {/* Submenu for Support */}
                  {item.hasSubmenu && section.title === "Support" && (
                    <Collapse in={openSupport} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ pl: 2 }}>
                        {item.submenu?.map((subItem, subIndex) => (
                          <ListItemButton
                            key={subIndex}
                            onClick={() => handleNavigation(subItem.path)}
                            sx={{
                              borderRadius: 2,
                              mb: 0.5,
                              backgroundColor: isActive(subItem.path) ? "#e3f2fd" : "transparent",
                              "&:hover": {
                                backgroundColor: "#f5f5f5"
                              }
                            }}
                          >
                            <ListItemText 
                              primary={subItem.text}
                              primaryTypographyProps={{
                                fontSize: "0.8rem",
                                color: isActive(subItem.path) ? "#1976d2" : "#666",
                                fontWeight: isActive(subItem.path) ? 600 : 400
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              ))}
            </List>
            
            {sectionIndex < navigationItems.length - 1 && (
              <Divider sx={{ mx: 2, my: 1 }} />
            )}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
        <ListItemButton
          onClick={() => navigate("/login")}
          sx={{
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#f5f5f5"
            }
          }}
        >
          <ListItemIcon sx={{ color: "#666", minWidth: 40 }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText 
            primary="Đăng xuất"
            primaryTypographyProps={{
              fontSize: "0.875rem",
              color: "#666"
            }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;