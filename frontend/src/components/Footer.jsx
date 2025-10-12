import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3, mt: 8 }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="body1">
          &copy; {new Date().getFullYear()} Lynkr URL Shortener. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Built with <Link href="https://mui.com/" color="inherit" underline="hover">Material UI</Link> & React
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
