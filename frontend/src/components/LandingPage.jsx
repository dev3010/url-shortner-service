import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Link } from 'react-router-dom';

const LandingPage = ({ user }) => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleShorten = () => {
    if (!longUrl) {
      setError('Please enter a valid URL');
      return;
    }
    setError('');
    const generated = 'https://lynkr.io/' + Math.random().toString(36).substring(2, 8);
    setShortUrl(generated);
  };

  return (
    <>
      {/* Hero Banner */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 10,
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Shorten URLs Instantly with Lynkr
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          {user
            ? 'Manage all your links and generate QR codes effortlessly.'
            : 'Sign up to track clicks, manage your links, and generate QR codes effortlessly.'}
        </Typography>
        {!user && (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/register"
          >
            Get Started
          </Button>
        )}
      </Box>

      {/* Public URL Shortening */}
      <Container sx={{ mt: 6, mb: 6 }}>
        <Paper sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Enter URL"
              fullWidth
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleShorten}>
              Shorten
            </Button>
          </Box>
          {shortUrl && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Short URL: <a href={shortUrl}>{shortUrl}</a>
            </Alert>
          )}
        </Paper>

        {/* Features for registered users */}
        {!user && (
          <>
            <Typography variant="h4" sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
              Why Register?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Track Analytics</Typography>
                    <Typography>See detailed click data for each URL.</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Generate QR Codes</Typography>
                    <Typography>Create QR codes for any shortened link.</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Manage URLs</Typography>
                    <Typography>Organize and edit your shortened URLs easily.</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default LandingPage;
