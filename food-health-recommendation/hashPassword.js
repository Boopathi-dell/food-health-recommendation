const bcrypt = require("bcryptjs");

const passwordToHash = "Boopathi@1431"; // 🔹 Replace this with the correct password

bcrypt.hash(passwordToHash, 10, (err, hashedPassword) => {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }
    console.log("✅ Hashed Password:", hashedPassword);
});
