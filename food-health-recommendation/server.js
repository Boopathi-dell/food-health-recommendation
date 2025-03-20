const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables early
dotenv.config();

// Check if MONGO_URI is available
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in environment variables.");
    process.exit(1); // Stop the process
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes Safely
const loadRoutes = () => {
    try {
        return {
            authRoutes: require("./routes/authRoutes"),
            adminRoutes: require("./routes/adminRoutes"),
            userProfileRoutes: require("./routes/userProfileRoutes"),
            recommendationsRoutes: require("./routes/recommendationsRoutes"),
        };
    } catch (error) {
        console.error("❌ Error loading routes:", error.message);
        process.exit(1); // Stop the app if routes fail to load
    }
};

const { authRoutes, adminRoutes, userProfileRoutes, recommendationsRoutes } = loadRoutes();

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userProfileRoutes);
app.use("/api/recommendations", recommendationsRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start the server only after MongoDB connects
const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ MongoDB Connected Successfully");

        // Start Server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error("❌ Server startup failed:", error.message);
        process.exit(1); // Stop the app if DB connection fails
    }
};

// Start the server
startServer();
