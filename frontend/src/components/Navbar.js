import React, { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    // Clear any stored user data (localStorage or sessionStorage)
    localStorage.removeItem("userToken"); 
    alert("Logged out successfully!");
    navigate("/"); // Redirect to login page
  };

  const navItems = [
    { title: "Book Appointment", path: "/book" },
    { title: "Booked Appointments", path: "/appointments" },
  ];

  return (
    <Box>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ background: "linear-gradient(90deg, #4b6cb7, #182848)" }}>
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Booking
          </Typography>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {navItems.map((item, index) => (
              <Button key={index} component={Link} to={item.path} color="inherit" sx={{ mx: 1.5, fontSize: "1rem" }}>
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
            <ListItem button key={index} component={Link} to={item.path} onClick={handleDrawerToggle}>
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

export default Navbar;
