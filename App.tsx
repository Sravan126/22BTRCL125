import React from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Link as RouterLink, Route, Routes } from 'react-router-dom';
import { AppBar, Box, Container, Link, Toolbar, Typography } from '@mui/material';
import ShortenerPage from './pages/ShortenerPage';
import StatsPage from './pages/StatsPage';
import RedirectHandler from './pages/RedirectHandler';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              AffordMed URL Shortener
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" underline="none" sx={{ mr: 2 }}>
              Shorten
            </Link>
            <Link component={RouterLink} to="/stats" color="inherit" underline="none">
              Stats
            </Link>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ py: 3 }}>
          <Container maxWidth="md">
            <Routes>
              <Route path="/" element={<ShortenerPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path=":code" element={<RedirectHandler />} />
            </Routes>
          </Container>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
