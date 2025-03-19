const express = require("express");
const FoodRecommendation = require("../models/FoodRecommendation"); // MongoDB Model
const router = express.Router();
const FoodInfo = require("../models/FoodInfo");
// ✅ Route: Get food recommendations based on disease (MongoDB)
router.get("/recommend", async (req, res) => {
    try {
        const { disease } = req.query;
        if (!disease) {
            return res.status(400).json({ success: false, message: "Disease is required" });
        }

        // 🔍 Search in MongoDB
        const recommendation = await FoodRecommendation.findOne({ disease: disease.toLowerCase() });

        if (!recommendation) {
            return res.status(404).json({ success: false, message: "No recommendations found" });
        }

        res.json({ success: true, disease, recommendations: recommendation.recommendedFoods });
    } catch (error) {
        console.error("❌ Error fetching recommendations:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// ✅ Route: Get food information based on food type (MongoDB)
router.get("/food-info", async (req, res) => {
    try {
        const { food } = req.query;
        if (!food) {
            return res.status(400).json({ success: false, message: "Food is required" });
        }

        // 🔍 Search in MongoDB
        const foodData = await FoodInfo.findOne({ food: food.toLowerCase() });

        if (!foodData) {
            return res.status(404).json({ success: false, message: "No food information found" });
        }

        res.json({ success: true, food, details: foodData });
    } catch (error) {
        console.error("❌ Error fetching food info:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// ✅ Export the router
module.exports = router;
