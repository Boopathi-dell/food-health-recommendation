const express = require("express");
const router = express.Router();

// Sample data for food recommendations based on disease
const diseaseFoodRecommendations = {
    diabetes: ["oats", "quinoa", "vegetables", "lean protein"],
    hypertension: ["fruits", "vegetables", "low-fat dairy", "whole grains"],
    heart_disease: ["salmon", "nuts", "berries", "leafy greens"],
};

// Sample data for food types with symptoms, infection, and prevention
const foodTypeInfo = {
    dairy: {
        symptoms: ["Lactose intolerance", "Bloating", "Diarrhea"],
        infection: ["Listeria", "Salmonella"],
        prevention: ["Pasteurization", "Refrigeration", "Proper hygiene"],
    },
    meat: {
        symptoms: ["Food poisoning", "Stomach cramps", "Fever"],
        infection: ["E. coli", "Salmonella"],
        prevention: ["Cook thoroughly", "Proper storage", "Avoid cross-contamination"],
    },
    seafood: {
        symptoms: ["Allergic reactions", "Nausea", "Vomiting"],
        infection: ["Vibrio", "Anisakis"],
        prevention: ["Cook properly", "Buy from reputable sources"],
    },
};

// ✅ Route 1: Get food recommendations based on disease
router.get("/recommend", (req, res) => {
    const { disease } = req.query;

    if (!disease) {
        return res.status(400).json({ success: false, message: "Disease is required" });
    }

    const recommendations = diseaseFoodRecommendations[disease.toLowerCase()];

    if (!recommendations) {
        return res.status(404).json({ success: false, message: "No recommendations found for this disease" });
    }

    res.json({ success: true, disease, recommendations });
});

// ✅ Route 2: Get food type information
router.get("/info", (req, res) => {
    const { type } = req.query;

    if (!type) {
        return res.status(400).json({ success: false, message: "Food type is required" });
    }

    const info = foodTypeInfo[type.toLowerCase()];

    if (!info) {
        return res.status(404).json({ success: false, message: "No information found for this food type" });
    }

    res.json({ success: true, type, info });
});

module.exports = router;
