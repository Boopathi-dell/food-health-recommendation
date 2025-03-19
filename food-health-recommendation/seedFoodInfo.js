const mongoose = require("mongoose");
const connectDB = require("./config/db");
const FoodInfo = require("./models/FoodInfo");

const seedFoodData = async () => {
    await connectDB();

    const foodData = [
        {
            food: "apple",
            foodType: "Fruit",
            symptoms: ["Nutrient deficiency", "Allergic reaction (rare)"],
            infection: ["No major infection risk"],
            prevention: ["Wash before eating", "Avoid if allergic"],
        },
        {
            food: "chicken",
            foodType: "Meat",
            symptoms: ["Food poisoning", "Salmonella risk"],
            infection: ["Salmonella, E. coli"],
            prevention: ["Cook properly", "Store at cold temperatures"],
        },
        {
            food: "spinach",
            foodType: "Vegetable",
            symptoms: ["Iron overdose (rare)", "Kidney stones (excessive consumption)"],
            infection: ["E. coli, Pesticide contamination"],
            prevention: ["Wash properly", "Eat in moderation"],
        },
    ];

    await FoodInfo.insertMany(foodData);
    console.log("✅ Food Info Data Seeded Successfully!");
    process.exit();
};

seedFoodData();
