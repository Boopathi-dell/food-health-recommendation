const bcrypt = require("bcryptjs");

// 🔹 Replace with the actual password you are trying to log in with
const enteredPassword = "Admin@123";  

// 🔹 Replace with the hashed password from MongoDB (run Step 1 to get it)
const storedHashedPassword = "$2b$10$bS7R6pskobOWBWHmyHXyLODpwgofk8lxTVV.Nsr3qIHjHd8DYICJK";  

bcrypt.compare(enteredPassword, storedHashedPassword)
  .then(isMatch => {
    if (isMatch) {
      console.log("✅ Password matches!");
    } else {
      console.log("❌ Password mismatch");
    }
  })
  .catch(err => console.error("Error comparing passwords:", err));
