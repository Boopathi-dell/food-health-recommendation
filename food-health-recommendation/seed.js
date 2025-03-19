const mongoose = require("mongoose");
const connectDB = require("./config/db");
const FoodRecommendation = require("./models/FoodRecommendation");

const seedData = async () => {
    await connectDB();

    const data = [
        { disease: "diabetes", recommendedFoods: ["oats", "quinoa", "vegetables", "lean protein"] },
        { disease: "hypertension", recommendedFoods: ["leafy greens", "berries", "low-fat dairy"] },
    ];

    await FoodRecommendation.insertMany(data);
    console.log("✅ Data Seeded Successfully!");
    process.exit();
};

seedData();
