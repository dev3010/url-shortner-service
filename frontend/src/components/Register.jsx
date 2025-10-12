import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

  const handleRegisterClick = async () => {
    if (!email || !password || !confirm) {
      setError('All fields are required.');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 6 characters, contain one uppercase letter and one number.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/signup/', { email, password });
      if (response.data && response.data.success) {
        onRegister({ email, isAdmin: response.data.isAdmin || false });
      } else {
        setError(response.data.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8000/google-login/');
      // Redirect to Google OAuth
      window.location.href = response.data.url;
    } catch (err) {
      setError('Google login failed.');
    }
  };

  return (
    <Container sx={{ mt: 8, maxWidth: 400 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2} textAlign="center">Register</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Email"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={handleRegisterClick}
          disabled={loading}
          startIcon={loading && <CircularProgress color="inherit" size={20} />}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          fullWidth
          sx={{ mb: 2 }}
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>

        <Box textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}
            >
              Click here to login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
