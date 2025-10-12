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
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';

const Login = ({ onLogin }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginClick = () => {
    if (!email || !password) {
      setError('Please fill all fields.');
      return;
    }
    setError('');

    const isAdmin = email === 'admin@example.com'; // example
    const userData = { email, isAdmin };
    if (onLogin) onLogin(userData);
  };

  const handleGoogleLogin = () => alert('Google login clicked (implement OAuth)');

  return (
    <Container sx={{ mt: 8, maxWidth: 400 }}>
      <Paper sx={{ p: 4, bgcolor: theme.palette.background.paper }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Login
        </Typography>

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

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={handleLoginClick}
        >
          Login
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
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{ textDecoration: 'none', color: theme.palette.primary.main, fontWeight: 500 }}
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
