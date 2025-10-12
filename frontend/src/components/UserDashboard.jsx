import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Alert, Grid, Card, CardContent, Box } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

const UserDashboard = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [urls, setUrls] = useState([
    { long: 'https://example.com/page1', short: 'https://lynkr.io/abc123' },
    { long: 'https://example.com/page2', short: 'https://lynkr.io/def456' },
  ]);

  const handleShorten = () => {
    if (!longUrl) {
      setError('Enter a valid URL');
      return;
    }
    setError('');
    const generated = 'https://lynkr.io/' + Math.random().toString(36).substring(2, 8);
    setShortUrl(generated);
    setUrls([{ long: longUrl, short: generated }, ...urls]);
    setLongUrl('');
  };

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>User Dashboard</Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Enter URL"
            fullWidth
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleShorten}>
            Shorten URL
          </Button>
        </Box>
        {shortUrl && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Short URL: <a href={shortUrl}>{shortUrl}</a>
          </Alert>
        )}
      </Paper>

      <Grid container spacing={3}>
        {urls.map((u, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Original: {u.long}</Typography>
                <Typography variant="subtitle1">Short: <a href={u.short}>{u.short}</a></Typography>
                <Box sx={{ mt: 2 }}>
                  <QRCodeSVG value={u.short} size={128} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserDashboard;
