// src/theme.js
import { createTheme } from '@mui/material/styles';
import { red, deepPurple, amber } from '@mui/material/colors';

// Light Theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: deepPurple[500] },
    secondary: { main: amber[500] },
    error: { main: red.A400 },
    background: { default: '#f4f6f8', paper: '#fff' },
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    body1: { fontSize: 16 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 12, textTransform: 'none' } } },
  },
});

// Dark Theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: deepPurple[300] },
    secondary: { main: amber[300] },
    error: { main: red.A400 },
    background: { default: '#121212', paper: '#1e1e1e' },
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    body1: { fontSize: 16 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 12, textTransform: 'none' } } },
  },
});
