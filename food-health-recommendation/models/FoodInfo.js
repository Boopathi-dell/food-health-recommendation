const mongoose = require("mongoose");

const FoodInfoSchema = new mongoose.Schema({
  food: { type: String, required: true, unique: true },
  foodType: { type: String, required: true },
  symptoms: { type: [String], required: true },
  infection: { type: [String], required: true },
  prevention: { type: [String], required: true },
});

module.exports = mongoose.model("FoodInfo", FoodInfoSchema);
