import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import UserTable from "./UserTable";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to get token from local storage
  const getToken = () => localStorage.getItem("adminToken");

  // ✅ Wrap fetchUsers in useCallback to prevent re-creation on every render
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Redirect to login.");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ No dependencies (only runs once)

  // ✅ Include fetchUsers in useEffect dependency array
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Toggle user status
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = getToken();
      const newStatus = !currentStatus;

      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/toggle`,
        { isActive: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI immediately
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isActive: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error.response?.data || error.message);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = getToken();
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers(); // Refresh list
      } catch (error) {
        console.error("Error deleting user:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <button className="btn btn-primary mb-3" onClick={fetchUsers} disabled={loading}>
        {loading ? "Loading..." : "🔄 Refresh Users"}
      </button>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <UserTable users={users} toggleUserStatus={toggleUserStatus} deleteUser={deleteUser} />
      )}
    </div>
  );
};

export default AdminDashboard;
