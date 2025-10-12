import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

function App({ darkMode, toggleDarkMode }) {
  const [user, setUser] = useState(null); // null = not logged in
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.isAdmin) navigate('/admin');
    else navigate('/dashboard');
  };

  return (
    <>
      <Navbar user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
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
