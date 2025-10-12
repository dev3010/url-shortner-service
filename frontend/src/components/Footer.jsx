import React from 'react';
import { Box, Typography, Container, Link, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme(); // get current theme colors

  return (
    <Box
      sx={{
        bgcolor: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.primary.main),
        py: 3,
        mt: 8,
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="body1">
          &copy; {new Date().getFullYear()} Lynkr URL Shortener. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Built with{' '}
          <Link
            href="https://mui.com/"
            color="inherit"
            underline="hover"
          >
            Material UI
          </Link>{' '}
          & React
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
