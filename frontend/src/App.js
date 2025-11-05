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

  // ✅ Restore user session on reload
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Handle login (from Login or Register)
  const handleLogin = (userData, user_id ,token) => {
    const fullUserData = {
      email: userData.email,
      isAdmin: userData.isAdmin || false,
      token: token,
    };

    setUser(fullUserData);
    localStorage.setItem('user', JSON.stringify(fullUserData));
    localStorage.setItem('token', token);
     localStorage.setItem('user_id', user_id);


    if (fullUserData.isAdmin) navigate('/admin');
    else navigate('/dashboard');
  };

  // ✅ Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
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
          element={
            user && !user.isAdmin ? (
              <UserDashboard user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            user && user.isAdmin ? (
              <AdminDashboard user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
