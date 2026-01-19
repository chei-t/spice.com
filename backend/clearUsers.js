import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";

dotenv.config();

const clearUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await User.deleteMany({});
    console.log(`🧹 ${result.deletedCount} users deleted!`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit();
  } catch (error) {
    console.error("❌ Error deleting users:", error.message);
    process.exit(1);
  }
};

clearUsers();
