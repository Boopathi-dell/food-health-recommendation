const jwt = require("jsonwebtoken");

// 📌 Middleware to verify token
const verifyToken = (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
        }

        if (!process.env.JWT_SECRET) {
            console.error("❌ JWT_SECRET is missing in environment variables.");
            return res.status(500).json({ success: false, message: "Internal Server Error. Missing JWT configuration." });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
                }
                if (err.name === "JsonWebTokenError") {
                    return res.status(401).json({ success: false, message: "Invalid token. Authentication failed." });
                }
                return res.status(401).json({ success: false, message: "Authentication error." });
            }

            req.user = decoded; // Attach user info to request
            next();
        });
    } catch (error) {
        console.error("❌ Token verification error:", error.message);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

// 📌 Middleware to verify if the user is an admin
const verifyAdmin = (req, res, next) => {
    // First, verify token
    verifyToken(req, res, (err) => {
        if (err) return; // Stop execution if token verification fails

        // Check if user role is 'admin'
        if (req.user?.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access Denied. Admins only." });
        }

        next();
    });
};

// ✅ Export both middleware functions
module.exports = { verifyToken, verifyAdmin };
