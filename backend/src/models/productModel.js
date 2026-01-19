import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      required: [true, "Product image URL is required"],
      validate: {
        validator: function (v) {
          // Allow valid image URLs with or without query params
          return /^https?:\/\/.+(\.(jpg|jpeg|png|webp|gif)(\?.*)?)?$/i.test(v);
        },
        message: "Please enter a valid image URL (must start with http/https)",
      },
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description should be at least 10 characters long"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["Spice", "Herb", "Blend", "Seed", "Other"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        name: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//  Auto-generate slug before saving
productSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
