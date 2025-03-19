const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ✅ Admin Registration
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, secretCode } = req.body;

        console.log("🔍 Admin Registration Attempt:", { name, email });

        // ✅ Validate secret code (for extra security)
        if (secretCode !== process.env.ADMIN_SECRET_CODE) {
            console.log("❌ Invalid Secret Code!");
            return res.status(403).json({ message: "Invalid secret code" });
        }

        // ✅ Check if admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log("❌ Admin already exists:", email);
            return res.status(400).json({ message: "Admin already exists" });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create new Admin user
        const newAdmin = new User({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            isActive: true, // Admin is active by default
        });

        await newAdmin.save();
        console.log(`✅ Admin Registered: ${newAdmin.email}`);

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        console.error("🔥 Error Registering Admin:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("🔍 Admin Login Attempt:", email);

        // ✅ Find admin user by email
        const admin = await User.findOne({ email });

        if (!admin) {
            console.log("❌ Admin Not Found:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // ✅ Check if the account is disabled
        if (admin.isActive === false) {
            return res.status(403).json({ message: "Your account is disabled. Contact support." });
        }

        // ✅ Check if user has admin role
        if (admin.role !== "admin") {
            console.log("❌ Unauthorized Access Attempt by:", email);
            return res.status(403).json({ message: "Access Denied. Admins only." });
        }

        // ✅ Compare passwords
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            console.log("❌ Incorrect Password for:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log(`✅ Admin Logged In: ${email}`);
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("🔥 Login Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Get All Users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        console.log("🔍 Fetching all users...");
        const users = await User.find({}, "-password"); // Exclude password field from user data
        console.log(`✅ Found ${users.length} users`);
        res.json(users);
    } catch (error) {
        console.error("🔥 Error fetching users:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Enable/Disable User (Admin only)
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔄 Toggling status for user ID: ${id}`);

        const user = await User.findById(id);
        if (!user) {
            console.log("❌ User not found!");
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Toggle the user's active status
        user.isActive = !user.isActive;
        await user.save();

        console.log(`✅ User ${user.email} is now ${user.isActive ? "enabled" : "disabled"}`);
        res.json({ message: `User ${user.isActive ? "enabled" : "disabled"} successfully`, isActive: user.isActive });
    } catch (error) {
        console.error("🔥 Error toggling user status:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Delete User (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Deleting user ID: ${id}`);

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            console.log("❌ User not found!");
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`✅ User ${user.email} deleted successfully`);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("🔥 Error deleting user:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Export all functions
module.exports = { registerAdmin, loginAdmin, getAllUsers, toggleUserStatus, deleteUser };
