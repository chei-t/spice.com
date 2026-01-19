import Wishlist from "../models/Wishlist.js";
import Product from "../models/productModel.js";

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    await wishlist.populate("products");

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("❌ Add to Wishlist Error:", error);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  const userId = req.user._id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate("products");
    if (!wishlist) {
      return res.status(200).json({ products: [] });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    console.error("❌ Get Wishlist Error:", error);
    res.status(500).json({ message: "Failed to get wishlist" });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate("products");

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("❌ Remove from Wishlist Error:", error);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};

// Clear wishlist
export const clearWishlist = async (req, res) => {
  const userId = req.user._id;

  try {
    const wishlist = await Wishlist.findOneAndDelete({ user: userId });
    res.status(200).json({ message: "Wishlist cleared" });
  } catch (error) {
    console.error("❌ Clear Wishlist Error:", error);
    res.status(500).json({ message: "Failed to clear wishlist" });
  }
};