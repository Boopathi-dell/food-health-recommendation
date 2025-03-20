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

// Start the server only after MongoDB connects
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log("✅ MongoDB Connected Successfully");

        // Import Routes (only after DB is connected)
        let authRoutes, adminRoutes, userProfileRoutes, recommendationsRoutes;
        try {
            authRoutes = require("./routes/authRoutes");
            adminRoutes = require("./routes/adminRoutes");
            userProfileRoutes = require("./routes/userProfileRoutes");
            recommendationsRoutes = require("./routes/recommendationsRoutes");
        } catch (error) {
            console.error("❌ Error loading routes:", error.message);
            process.exit(1); // Stop if routes fail to load
        }

        // Use Routes
        app.use("/api/auth", authRoutes);
        app.use("/api/admin", adminRoutes);
        app.use("/api/users", userProfileRoutes);
        app.use("/api/recommendations", recommendationsRoutes);

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
