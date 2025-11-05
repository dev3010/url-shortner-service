import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { shortenURL, getUserAnalytics } from "../api";

const UserDashboard = ({ user }) => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // 🔹 Fetch user analytics when component mounts
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.token) return;
      setLoadingAnalytics(true);
      try {
        const response = await getUserAnalytics(user.token);
        setUrls(response?.data || []);
      } catch (err) {
        setError("Failed to load analytics. Please try again.");
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, [user]);

  // 🔹 Handle new URL shortening
  const handleShorten = async () => {
    if (!longUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setError("");
    setShortUrl("");
    setLoading(true);

    try {
      const response = await shortenURL(longUrl);

      if (response.error) {
        setError(response.error);
      } else if (response.short_url) {
        setShortUrl(response.short_url);
        setUrls([{ 
          long_url: longUrl, 
          short_url: response.short_url, 
          click_count: 0, 
          created_at: new Date().toISOString() 
        }, ...urls]);
        setLongUrl("");
      } else {
        setError("Unexpected error. Please try again.");
      }
    } catch (err) {
      setError("Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 8, mb: 8 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        {user?.email ? `${user.email.split("@")[0]}'s Dashboard` : "User Dashboard"}
      </Typography>

      {/* URL Shortener */}
      <Paper sx={{ p: 4, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Enter URL"
            fullWidth
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleShorten}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Shorten URL"}
          </Button>
        </Box>

        {shortUrl && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Short URL:{" "}
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </Alert>
        )}
      </Paper>

      {/* User’s shortened URLs with analytics */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Your Links
      </Typography>

      {loadingAnalytics ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : urls.length === 0 ? (
        <Typography color="text.secondary">
          No shortened URLs yet. Start by creating one above!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {urls.map((u, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Card
                sx={{
                  "&:hover": { boxShadow: 6 },
                  transition: "0.3s",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" sx={{ wordBreak: "break-all" }}>
                    <strong>Original:</strong> {u.long_url}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Short:</strong>{" "}
                    <a href={u.short_url} target="_blank" rel="noopener noreferrer">
                      {u.short_url}
                    </a>
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    <strong>Clicks:</strong> {u.click_count ?? 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Created:</strong>{" "}
                    {new Date(u.created_at).toLocaleString()}
                  </Typography>

                  <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <QRCodeSVG value={u.short_url} size={100} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default UserDashboard;
