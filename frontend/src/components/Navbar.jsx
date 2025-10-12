import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = ({ user }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Lynkr
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {!user && <Button color="inherit" component={Link} to="/login">Login</Button>}
          {!user && <Button color="inherit" component={Link} to="/register">Register</Button>}
          {user && <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>}
          {user && user.isAdmin && <Button color="inherit" component={Link} to="/admin">Admin</Button>}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
