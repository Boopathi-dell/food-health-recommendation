import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    secretCode: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/register`, formData);
      alert("Admin registered successfully! Please login.");
      navigate("/admin/login"); // Redirect to login page
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Registration</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" className="form-control my-2" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="form-control my-2" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="form-control my-2" onChange={handleChange} required />
        <input type="text" name="secretCode" placeholder="Admin Secret Code" className="form-control my-2" onChange={handleChange} required />
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default AdminRegister;
