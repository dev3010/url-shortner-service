import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Alert, Box, Divider, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async () => {
    if (!email || !password) {
      setError('Please fill all fields.');
      return;
    }

    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      const isAdmin = email === 'admin@example.com';
      const userData = { email, isAdmin };
      if (onLogin) onLogin(userData);
    }, 1000);
  };

  return (
    <Container sx={{ mt: 8, maxWidth: 400 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2} textAlign="center">Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField label="Email" fullWidth sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }} onClick={handleLoginClick} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth sx={{ mb: 2 }} onClick={() => alert('Google login')}>
          Sign in with Google
        </Button>

        <Box textAlign="center">
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
