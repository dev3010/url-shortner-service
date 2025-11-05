import React, { useState, useEffect, useCallback } from "react";
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
  Stack,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import {
  shortenURL,
  getUserAnalytics,
  deleteURL,
  toggleActiveURL,
} from "../api";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

const UserDashboard = ({ user }) => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const token = localStorage.getItem("token");

  // ✅ Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    if (!token) return;
    setLoadingAnalytics(true);
    try {
      const response = await getUserAnalytics(token);
      const data = Array.isArray(response)
        ? response
        : response.data || [];
      setUrls(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics. Please try again.");
    } finally {
      setLoadingAnalytics(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

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
        await fetchAnalytics();
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

  // 🗑️ Delete URL
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      await deleteURL(id, token);
      setUrls(urls.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete URL.");
    }
  };

  // 🔄 Toggle active/inactive
  const handleToggleActive = async (id, currentStatus) => {
    try {
      await toggleActiveURL(id, token);
      setUrls((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_active: !currentStatus } : u
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update link status.");
    }
  };

  return (
    <Container sx={{ mt: 8, mb: 8 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          {user?.email
            ? `${user.email.split("@")[0]}'s Dashboard`
            : "Guest Dashboard"}
        </Typography>

        {/* Refresh */}
        {token && (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAnalytics}
            disabled={loadingAnalytics}
          >
            {loadingAnalytics ? "Refreshing..." : "Refresh"}
          </Button>
        )}
      </Stack>

      {/* URL Shortener */}
      <Paper sx={{ p: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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

      {/* User’s shortened URLs */}
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
                  opacity: u.is_active === false ? 0.6 : 1,
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ wordBreak: "break-all", mb: 1 }}
                  >
                    <strong>Original URL:</strong> {u.original_url}
                  </Typography>

                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    <strong>Short URL:</strong>{" "}
                    <a
                      href={u.short_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {u.short_url}
                    </a>
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    <strong>Clicks:</strong> {u.click_count ?? 0}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    <strong>Created:</strong>{" "}
                    {u.created_at
                      ? new Date(u.created_at).toLocaleString()
                      : "N/A"}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    {/* ✅ Activation Switch */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={u.is_active}
                          onChange={() =>
                            handleToggleActive(u.id, u.is_active)
                          }
                          color="success"
                        />
                      }
                      label={u.is_active ? "Active" : "Inactive"}
                    />

                    {/* 🗑️ Delete */}
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDelete(u.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  {/* QR Code */}
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
