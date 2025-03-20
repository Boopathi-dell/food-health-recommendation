import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Show loading state

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, formData); // ✅ Fixed endpoint
      alert(response.data.message || "User registered successfully! Please login.");
      navigate("/login"); // Redirect to user login page
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="container mt-5">
      <h2>User Registration</h2>
      {error && <p className="text-danger">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          placeholder="Name" 
          className="form-control my-2" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
        
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          className="form-control my-2" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          className="form-control my-2" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default UserRegister;
