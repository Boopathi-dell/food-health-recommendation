const express = require("express");
const {
    loginAdmin,
    registerAdmin, // Added Admin Registration Route
    toggleUserStatus,
    deleteUser,
    getAllUsers,
} = require("../controllers/adminController");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// ✅ Admin Registration (Public Route)
router.post("/register", registerAdmin); // No authentication required

// ✅ Admin Login (Public Route)
router.post("/login", loginAdmin);

// ✅ Protect all routes below (Require Admin Authentication)
router.use(verifyToken, verifyAdmin);

// ✅ Get all users (Excluding Passwords)
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude passwords
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Toggle user active/inactive status
router.put("/users/:id/toggle", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isActive = !user.isActive; // Toggle status
        await user.save();

        res.json({ message: "User status updated", isActive: user.isActive });
    } catch (error) {
        console.error("Error toggling user status:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Delete user
router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Get all users (Fixed duplicate route)
router.get("/all-users", verifyAdmin, getAllUsers);

module.exports = router;
