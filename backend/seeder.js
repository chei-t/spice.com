// seeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import slugify from "slugify";

import Product from "./src/models/productModel.js";
import User from "./src/models/userModel.js"; //  import User model
import connectDB from "./src/config/db.js";
import products from "./src/data/products.js"; // your spices/products array

dotenv.config();

//  Connect to MongoDB
connectDB();

const seedData = async () => {
  try {
    console.log("🧹 Clearing old data...");

    //  Clear old data
    await Product.deleteMany();
    await User.deleteMany();

    //  Seed admin users
    const admins = [
      {
        name: "Solomon Boniface",
        email: "solomboni5@gmail.com",
        password: bcrypt.hashSync("Chief@001", 10),
        role: "admin",
      },
      {
        name: "Solomon Muriithi",
        email: "solomonmuriithi370@gmail.com",
        password: bcrypt.hashSync("Chief@001", 10),
        role: "admin",
      },
    ];

    await User.insertMany(admins);
    console.log("✅ Admin users created successfully!");

    //  Generate product slugs
    const productsWithSlugs = products.map((product) => ({
      ...product,
      slug: slugify(product.name, { lower: true, strict: true }),
    }));

    //  Insert products
    await Product.insertMany(productsWithSlugs);
    console.log("✅ Products imported successfully!");

    console.log("🌱 Database seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    console.log("🗑 All data destroyed successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error deleting data:", error);
    process.exit(1);
  }
};

// CLI options: `node seeder.js` or `node seeder.js -d`
if (process.argv[2] === "-d") {
  destroyData();
} else {
  seedData();
}
