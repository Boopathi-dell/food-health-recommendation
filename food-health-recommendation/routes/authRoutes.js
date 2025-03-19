const express = require("express");
const { registerUser, adminLogin, loginUser, verifyAdminOtp, registerAdmin } = require("../controllers/authController");

const router = express.Router();

// ✅ User registration route
router.post("/register", registerUser);

// ✅ User login route
router.post("/login", loginUser);

// ✅ Admin registration route (with secret code verification)
router.post("/register-admin", registerAdmin);

// ✅ Admin login route
router.post("/admin-login", adminLogin);

// ✅ Admin OTP verification route
router.post("/verify-otp", verifyAdminOtp);

module.exports = router;
