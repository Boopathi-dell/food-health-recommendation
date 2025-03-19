const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  age: { type: Number,required: true  },
  gender: { type: String, enum: ["Male", "Female", "Other"],required: true  },
  healthConditions: { type: [String] }, // Array of health problems
});

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
module.exports = UserProfile;
