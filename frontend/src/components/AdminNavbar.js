import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Import your AuthContext

const AdminNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Get logout function from context

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await logout(); // Call the logout function from context
    alert("Logged out successfully!");
    navigate("/"); // Redirect to login page
  };

  const handleNavigation = (path) => {
    navigate(path); // Use navigate() to programmatically navigate
    setMobileOpen(false); // Close the mobile drawer after clicking a link
  };

  const navItems = [
    { title: "Admin Appointment", path: "/adapp" },
    { title: "Add Slot", path: "/add" },
  ];

  return (
    <Box>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ background: "linear-gradient(90deg, #4b6cb7, #182848)" }}>
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Admin Dashboard
          </Typography>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {navItems.map((item, index) => (
              <Button
                key={index}
                onClick={() => handleNavigation(item.path)} // Use onClick to trigger navigation
                color="inherit"
                sx={{ mx: 1.5, fontSize: "1rem" }}
              >
                {item.title}
              </Button>
            ))}
            {/* Logout Button */}
            <Button onClick={handleLogout} color="light-blue" variant="contained" sx={{ ml: 2 }}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        <List sx={{ width: 250 }}>
          {navItems.map((item, index) => (
            <ListItem button key={index} onClick={() => handleNavigation(item.path)}>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
          {/* Logout Button for Mobile */}
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" sx={{ color: "red", fontWeight: "bold" }} />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default AdminNavbar;