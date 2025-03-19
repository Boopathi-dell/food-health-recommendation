const express = require("express");
const UserProfile = require("../models/UserProfile");
const { verifyToken } = require("../middleware/authMiddleware"); // ✅ Correct Import

const router = express.Router();

// 📌 GET User Profile
router.get("/profile", verifyToken, async (req, res) => { // ✅ Fixed route
  try {
    const userId = req.user?.id; // Extract user ID from token
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
    }

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }
    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("❌ Error fetching profile:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// 📌 UPDATE or CREATE User Profile
router.put("/profile", verifyToken, async (req, res) => { // ✅ Use PUT instead of POST
  try {
    const userId = req.user?.id; // Extract user ID
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
    }

    const { name, age, gender, healthConditions } = req.body;

    let profile = await UserProfile.findOne({ userId });

    if (profile) {
      // Update existing profile
      profile.name = name;
      profile.age = age;
      profile.gender = gender;
      profile.healthConditions = healthConditions;
    } else {
      // Create new profile
      profile = new UserProfile({
        userId,
        name,
        age,
        gender,
        healthConditions,
      });
    }

    await profile.save();
    res.status(200).json({ success: true, message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
