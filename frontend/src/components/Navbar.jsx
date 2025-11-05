import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Navbar = ({ user, onLogout, darkMode, toggleDarkMode }) => {
  return (
    <AppBar position="static" color="primary" elevation={4}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Brand / Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: "inherit",
              textDecoration: "none",
              fontWeight: 700,
              "&:hover": { color: "secondary.main" },
            }}
          >
            Lynkr
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Home link always visible */}
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>

            {/* If no user logged in */}
            {!user && (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}

            {/* Logged-in user (regular or admin) */}
            {user && (
              <>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>

                {/* Display logged-in user's email */}
                <Tooltip title={`Logged in as ${user.email}`}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: "secondary.main" }}>
                      {user.email[0].toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" sx={{ color: "inherit" }}>
                      Hi, {user.email.split("@")[0]}
                    </Typography>
                  </Box>
                </Tooltip>

                <Button color="inherit" onClick={onLogout}>
                  Logout
                </Button>
              </>
            )}

            {/* Dark Mode Toggle */}
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
