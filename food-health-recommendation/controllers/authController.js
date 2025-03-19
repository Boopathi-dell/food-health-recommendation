require("dotenv").config(); // Load environment variables

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || "MY_ADMIN_SECRET"; // Secure admin secret code
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Secure JWT key

// ✅ User Registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 🔹 Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 🔹 Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Create new user and save to DB
        user = new User({ name, email, password: hashedPassword, role: "user" });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🔹 Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 🔹 Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 🔹 Generate JWT Token (Ensure role is included)
        const token = jwt.sign(
            { id: user._id, role: user.role },
             process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ 
            message: "Login successful",
            token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Admin Registration (With Secret Code Verification)
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, secretCode } = req.body;

        // 🔹 Verify secret code
        if (secretCode !== ADMIN_SECRET_CODE) {
            return res.status(403).json({ message: "Invalid admin secret code" });
        }

        // 🔹 Check if admin already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // 🔹 Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Create and save admin user
        const newAdmin = new User({ name, email, password: hashedPassword, role: "admin" });
        await newAdmin.save();

        // 🔹 Generate JWT Token (Ensure role is included)
        const token = jwt.sign(
            { id: newAdmin._id, role: "admin" },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(201).json({ 
            message: "Admin registered successfully", 
            token, 
            admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: "admin" }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🔹 Find admin user
        const admin = await User.findOne({ email, role: "admin" });
        if (!admin) {
            return res.status(400).json({ message: "Invalid admin credentials" });
        }

        // 🔹 Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid admin credentials" });
        }

        // 🔹 Generate JWT Token (Ensure role is included)
        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({ 
            message: "Admin login successful",
            token, 
            admin: { id: admin._id, name: admin.name, email: admin.email, role: "admin" } 
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Verify Admin OTP (Placeholder for future implementation)
const verifyAdminOtp = async (req, res) => {
    try {
        res.send("Verify OTP function");
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Export All Functions
module.exports = { 
    registerUser, 
    loginUser, 
    registerAdmin, 
    adminLogin, 
    verifyAdminOtp
};
