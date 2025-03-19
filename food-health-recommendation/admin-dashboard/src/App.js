import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import AdminDashboard from "./components/AdminDashboard";
import AdminRegister from "./components/AdminRegister";
import AdminLogin from "./components/AdminLogin";
import UserRegister from "./components/UserRegister";
import UserLogin from "./components/UserLogin";
import UserDashboard from "./components/UserDashboard";

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  return (
    <Router>
      <div>
        {/* ✅ Show Admin Dashboard link only if logged in */}
        {isAdminLoggedIn && <Link to="/admin/dashboard">Go to Admin Dashboard</Link>}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/login" element={<UserLogin />} />  {/* ✅ Added this route */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
