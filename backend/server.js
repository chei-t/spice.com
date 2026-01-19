import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

// Models
import User from "./src/models/userModel.js";

// Routes
import productRoutes from "./src/routes/productRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import wishlistRoutes from "./src/routes/wishlistRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

// ---------- Path Setup ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// ---------- Environment Validation ----------
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ Missing environment variables. Exiting...");
  process.exit(1);
}

console.log("Mongo URI:", process.env.MONGO_URI);
console.log("Port:", process.env.PORT);
console.log("JWT Secret:", process.env.JWT_SECRET);

// ---------- Express App ----------
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Rate limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Admin Account Setup ----------
const ensureAdminAccounts = async () => {
  const admins = [
    { name: "Solomon Boniface", email: "solomboni5@gmail.com", password: "Chief@001" },
    { name: "Solomon Muriithi", email: "solomonmuriithi370@gmail.com", password: "Chief@001" },
  ];

  for (const admin of admins) {
    const existing = await User.findOne({ email: admin.email });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await User.create({
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`✅ Admin created: ${admin.email}`);
    } else {
      console.log(`ℹ️ Admin already exists: ${admin.email}`);
    }
  }
};

// ---------- MongoDB Connection ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");

    // Only create admin accounts in dev or test
    if (process.env.NODE_ENV !== "production") {
      await ensureAdminAccounts();
    }
  })
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err.message));

// ---------- API Routes ----------
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);

// ---------- Root Route ----------
app.get("/", (req, res) => {
  res.send("🌿 Spices & Herbs API is Running Smoothly!");
});

// ---------- Error Handling ----------
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

// ---------- Server Start ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
