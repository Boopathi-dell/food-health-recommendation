const mongoose = require("mongoose");

const FoodRecommendationSchema = new mongoose.Schema({
  disease: { type: String, required: true, unique: true },
  recommendedFoods: { type: [String], required: true },
});

module.exports = mongoose.model("FoodRecommendation", FoodRecommendationSchema);
