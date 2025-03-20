import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  // State for user input
  const [disease, setDisease] = useState("");
  const [foodType, setFoodType] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [foodDetails, setFoodDetails] = useState(null);
  const [error, setError] = useState("");

  // State for user profile
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    healthConditions: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile on load
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
    }
  };

  // ✅ Fetch Food Recommendations Based on Disease
  const getFoodRecommendations = async (e) => {
    e.preventDefault();
    try {
      setError(""); // Clear previous errors
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/recommendations/recommend?disease=${disease}`);
      setRecommendations(response.data.recommendations);
    } catch (err) {
      setError("No recommendations found for this disease.");
      setRecommendations([]);
    }
  };

  // ✅ Fetch Food Details Based on Food Type
  const getFoodDetails = async (e) => {
    e.preventDefault();
    setError("");
    setFoodDetails(null);

    if (!foodType) {
      setError("Please enter a food type.");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/recommendations/food-info?food=${foodType}`);
      setFoodDetails(response.data.details);
    } catch (err) {
      setError("No information found for this food type.");
      setFoodDetails(null);
    }
  };

  // ✅ Handle Profile Update
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const healthConditionsArray = profile.healthConditions.split(",").map(item => item.trim());

      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/users/profile`,
        { ...profile, healthConditions: healthConditionsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>User Dashboard</h2>

      {/* 🔹 Editable Profile Section */}
      <h3>Profile</h3>
      {isEditing ? (
        <form onSubmit={handleProfileSubmit}>
          <input
            type="text"
            name="name"
            className="form-control my-2"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Name"
            required
          />
          <input
            type="number"
            name="age"
            className="form-control my-2"
            value={profile.age}
            onChange={handleProfileChange}
            placeholder="Age"
          />
          <select
            name="gender"
            className="form-control my-2"
            value={profile.gender}
            onChange={handleProfileChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="healthConditions"
            className="form-control my-2"
            value={profile.healthConditions}
            onChange={handleProfileChange}
            placeholder="Health Conditions (comma-separated)"
          />
          <button type="submit" className="btn btn-primary">Save</button>
        </form>
      ) : (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <p><strong>Health Conditions:</strong> {profile.healthConditions}</p>
          <button onClick={() => setIsEditing(true)} className="btn btn-secondary">Edit Profile</button>
        </div>
      )}

      {/* 🔹 Food Recommendation Section */}
      <h3 className="mt-4">Get Food Recommendations</h3>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={getFoodRecommendations}>
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter disease (e.g., diabetes)"
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-success">Get Recommendations</button>
      </form>

      {/* 🔹 Display Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-4">
          <h3>Recommended Foods:</h3>
          <ul>
            {recommendations.map((food, index) => (
              <li key={index}>{food}</li>
            ))}
          </ul>
        </div>
      )}

      <hr />

      {/* 🔹 Food Type Information Section */}
      <h3 className="mt-4">Food Type Information</h3>
      <form onSubmit={getFoodDetails}>
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter food name (e.g., apple)"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-info">Get Food Info</button>
      </form>

      {/* 🔹 Display Food Type Information */}
      {foodDetails && (
        <div className="mt-4">
          <h3>Food Type Details</h3>
          <p><strong>Food Type:</strong> {foodDetails.foodType}</p>
          <p><strong>Symptoms:</strong> {foodDetails.symptoms.join(", ")}</p>
          <p><strong>Infection:</strong> {foodDetails.infection.join(", ")}</p>
          <p><strong>Prevention:</strong> {foodDetails.prevention.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
