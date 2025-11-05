import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

function App({ darkMode, toggleDarkMode }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Persist login on page reload
  const handleLoginSuccess = (data) => {
  setUser({ email: data.user, token: data.access_token });
  localStorage.setItem("user", JSON.stringify({ email: data.user, token: data.access_token }));
};

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (token && email) {
      setUser({ email, isAdmin });
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('isAdmin', userData.isAdmin);
    if (userData.isAdmin) navigate('/admin');
    else navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <>
      <Navbar
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleLogin} />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user && !user.isAdmin ? <UserDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={user && user.isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
