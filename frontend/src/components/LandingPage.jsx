import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert } from '@mui/material';

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleShorten = () => {
    if (!longUrl) {
      setError('Please enter a valid URL');
      return;
    }
    setError('');
    // Placeholder logic
    const generated = 'https://lynkr.io/' + Math.random().toString(36).substring(2, 8);
    setShortUrl(generated);
  };

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Shorten your URLs instantly
      </Typography>
      <Paper sx={{ p: 4, mt: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', gap: 2 }}>
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
    </Container>
  );
};

export default LandingPage;
