import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Navbar = ({ user, onLogout, darkMode, toggleDarkMode }) => {
  return (
    <AppBar position="static" color="primary" elevation={4}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo / Brand */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
              fontWeight: 700,
              "&:hover": { color: "secondary.main" },
            }}
          >
            Lynkr
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Home link always visible */}
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>

            {/* Public links */}
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

            {/* Logged-in regular user */}
            {user && !user.isAdmin && (
              <>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" onClick={onLogout}>
                  Logout
                </Button>
              </>
            )}

            {/* Admin user */}
            {user && user.isAdmin && (
              <>
                <Button color="inherit" component={Link} to="/admin">
                  Admin
                </Button>
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
