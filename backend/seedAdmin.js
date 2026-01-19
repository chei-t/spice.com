import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js"; // adjust the path if needed
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const createAdmins = async () => {
  try {
    console.log("🧹 Clearing existing admin users...");
    await User.deleteMany({ role: "admin" });

    // Hash the password once and reuse it
    const hashedPassword = await bcrypt.hash("Chief@001", 10);

    const admins = [
      {
        name: "Solomon Boniface",
        email: "solomboni5@gmail.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Solomon Muriithi",
        email: "solomonmuriithi370@gmail.com",
        password: hashedPassword,
        role: "admin",
      },
    ];

    await User.insertMany(admins);

    console.log("✅ Admin users created successfully!");
    console.log(admins);
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin users:", error);
    process.exit(1);
  }
};

createAdmins();
