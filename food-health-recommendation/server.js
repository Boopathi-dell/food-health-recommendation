const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables as early as possible
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Start the server only after MongoDB successfully connects
const startServer = async () => {
    try {
        // Ensure the MongoDB URI is available
        if (!process.env.MONGO_URI) {
            throw new Error("❌ MONGO_URI is not defined in environment variables.");
        }

        // Connect to MongoDB
        await connectDB();
        console.log("✅ MongoDB Connected");

        // Import Routes (import only after DB connection is established)
        const authRoutes = require("./routes/authRoutes");
        const adminRoutes = require("./routes/adminRoutes");
        const userProfileRoutes = require("./routes/userProfileRoutes");
        const recommendationsRoutes = require("./routes/recommendationsRoutes");

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
