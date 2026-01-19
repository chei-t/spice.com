# Database Schema Documentation

## Overview

This document provides detailed information about the MongoDB database schema for the Spice  e-commerce platform. It includes collection structures, field definitions, validation rules, indexes, and relationships.

---

## Table of Contents

1. [User Collection](#user-collection)
2. [Product Collection](#product-collection)
3. [Category Collection](#category-collection)
4. [Cart Collection](#cart-collection)
5. [Wishlist Collection](#wishlist-collection)
6. [Order Collection](#order-collection)
7. [Review Collection](#review-collection)
8. [FlashSale Collection](#flashsale-collection)
9. [Message Collection](#message-collection)
10. [Indexes](#indexes)
11. [Relationships](#relationships)
12. [Best Practices](#best-practices)

---

## User Collection

**Collection Name:** `users`

### Schema

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phone: String,
  role: String,
  isActive: Boolean,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshToken: String,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Mongoose Model

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password by default
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Please provide a valid phone number']
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'superadmin'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshToken: String,
  lastLogin: Date
}, {
  timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Field Details

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| firstName | String | Yes | No | User's first name (2-50 chars) |
| lastName | String | Yes | No | User's last name (2-50 chars) |
| email | String | Yes | Yes | User's email address (lowercase) |
| password | String | Yes | No | Hashed password (bcrypt) |
| phone | String | No | No | User's phone number |
| role | String | Yes | No | User role (customer/admin/superadmin) |
| isActive | Boolean | Yes | No | Account status (default: true) |
| resetPasswordToken | String | No | No | Token for password reset |
| resetPasswordExpire | Date | No | No | Expiration for reset token |
| refreshToken | String | No | No | JWT refresh token |
| lastLogin | Date | No | No | Last login timestamp |

---

## Product Collection

**Collection Name:** `products`

### Schema

```javascript
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters'],
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
    validate: {
      validator: function(value) {
        return !value || value < this.price;
      },
      message: 'Sale price must be less than regular price'
    }
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  specifications: {
    type: Map,
    of: String
  },
  images: [{
    imageUrl: {
      type: String,
      required: true
    },
    altText: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  }],
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for checking if in stock
productSchema.virtual('inStock').get(function() {
  return this.stockQuantity > 0;
});

// Virtual for effective price
productSchema.virtual('effectivePrice').get(function() {
  return this.salePrice || this.price;
});

// Index for text search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
```

### Field Details

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| name | String | Yes | No | Product name (3-200 chars) |
| description | String | Yes | No | Product description (10-2000 chars) |
| price | Number | Yes | No | Regular price (≥0) |
| salePrice | Number | No | No | Discounted price (< regular price) |
| stockQuantity | Number | Yes | No | Available stock (≥0) |
| category | ObjectId | Yes | No | Reference to Category |
| brand | String | Yes | No | Product brand |
| sku | String | Yes | Yes | Stock Keeping Unit (unique) |
| specifications | Map | No | No | Key-value pairs of specs |
| images | Array | No | No | Product images array |
| averageRating | Number | No | No | Average rating (0-5) |
| reviewCount | Number | No | No | Total number of reviews |
| isActive | Boolean | Yes | No | Product visibility status |
| views | Number | No | No | Product view count |

---

## Category Collection

**Collection Name:** `categories`

### Schema

```javascript
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: String
}, {
  timestamps: true
});

// Pre-save hook to generate slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
```

---

## Cart Collection

**Collection Name:** `carts`

### Schema

```javascript
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual for total items
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Method to calculate cart total
cartSchema.methods.calculateTotal = async function() {
  await this.populate('items.product');
  return this.items.reduce((total, item) => {
    const price = item.product.salePrice || item.product.price;
    return total + (price * item.quantity);
  }, 0);
};

module.exports = mongoose.model('Cart', cartSchema);
```

---

## Wishlist Collection

**Collection Name:** `wishlists`

### Schema

```javascript
const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Prevent duplicate products in wishlist
wishlistSchema.index({ user: 1, 'items.product': 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
```

---

## Order Collection

**Collection Name:** `orders`

### Schema

```javascript
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String, // Store product name at time of order
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  shipping: {
    trackingNumber: String,
    carrier: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'in_transit', 'delivered', 'cancelled'],
      default: 'pending'
    },
    shippedAt: Date,
    deliveredAt: Date,
    estimatedDelivery: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  shippingAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  notes: String,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Pre-save hook to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
```

---

## Review Collection

**Collection Name:** `reviews`

### Schema

```javascript
const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  images: [String]
}, {
  timestamps: true
});

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Method to update product rating
reviewSchema.statics.calculateAverageRating = async function(productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      reviewCount: result[0].reviewCount
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewCount: 0
    });
  }
};

// Update product rating after save
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.product);
});

// Update product rating after remove
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
```

---

## FlashSale Collection

**Collection Name:** `flashsales`

### Schema

```javascript
const flashSaleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Flash sale name is required'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [1, 'Discount must be at least 1%'],
    max: [90, 'Discount cannot exceed 90%']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  maxUsagePerUser: {
    type: Number,
    default: 1
  },
  totalUsageLimit: Number,
  usageCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual to check if sale is currently active
flashSaleSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
});

module.exports = mongoose.model('FlashSale', flashSaleSchema);
```

---

## Message Collection

**Collection Name:** `messages`

### Schema

```javascript
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  readAt: Date,
  attachments: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
```

---

## Indexes

### Performance Indexes

```javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });
db.users.createIndex({ createdAt: -1 });

// Product indexes
db.products.createIndex({ sku: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.products.createIndex({ brand: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ averageRating: -1 });
db.products.createIndex({ createdAt: -1 });
db.products.createIndex({ isActive: 1, stockQuantity: 1 });
db.products.createIndex({ name: "text", description: "text" }); // Text search

// Category indexes
db.categories.createIndex({ slug: 1 }, { unique: true });
db.categories.createIndex({ parentCategory: 1 });

// Cart indexes
db.carts.createIndex({ user: 1 }, { unique: true });
db.carts.createIndex({ "items.product": 1 });

// Wishlist indexes
db.wishlists.createIndex({ user: 1 }, { unique: true });
db.wishlists.createIndex({ "items.product": 1 });

// Order indexes
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });
db.orders.createIndex({ "payment.status": 1 });
db.orders.createIndex({ "shipping.status": 1 });

// Review indexes
db.reviews.createIndex({ product: 1, user: 1 }, { unique: true });
db.reviews.createIndex({ product: 1, rating: -1 });
db.reviews.createIndex({ user: 1 });
db.reviews.createIndex({ createdAt: -1 });

// Flash sale indexes
db.flashsales.createIndex({ startDate: 1, endDate: 1 });
db.flashsales.createIndex({ isActive: 1 });

// Message indexes
db.messages.createIndex({ sender: 1, recipient: 1 });
db.messages.createIndex({ recipient: 1, status: 1 });
db.messages.createIndex({ createdAt: -1 });
```

---

## Relationships

### One-to-Many Relationships

1. **User → Orders**
   - One user can have many orders
   - `orders.user` references `users._id`

2. **User → Reviews**
   - One user can write many reviews
   - `reviews.user` references `users._id`

3. **Product → Reviews**
   - One product can have many reviews
   - `reviews.product` references `products._id`

4. **Category → Products**
   - One category can have many products
   - `products.category` references `categories._id`

5. **Category → Subcategories**
   - One category can have many child categories
   - `categories.parentCategory` references `categories._id`

### One-to-One Relationships

1. **User → Cart**
   - One user has one cart
   - `carts.user` references `users._id` (unique)

2. **User → Wishlist**
   - One user has one wishlist
   - `wishlists.user` references `users._id` (unique)

### Many-to-Many Relationships

1. **Products ↔ Flash Sales**
   - Implemented via array in FlashSale
   - `flashsales.products` contains array of product IDs

2. **Cart Items ↔ Products**
   - Embedded array in Cart
   - `carts.items.product` references `products._id`

3. **Wishlist Items ↔ Products**
   - Embedded array in Wishlist
   - `wishlists.items.product` references `products._id`

---

## Best Practices

### 1. Data Validation

```javascript
// Always validate at schema level
price: {
  type: Number,
  required: true,
  min: [0, 'Price cannot be negative']
}

// Use custom validators
validate: {
  validator: function(value) {
    return value > this.startDate;
  },
  message: 'End date must be after start date'
}
```

### 2. Indexes

- Create indexes on frequently queried fields
- Use compound indexes for multi-field queries
- Monitor index usage with `explain()`
- Remove unused indexes

### 3. Virtuals

```javascript
// Use virtuals for computed fields
productSchema.virtual('inStock').get(function() {
  return this.stockQuantity > 0;
});
```

### 4. Middleware

```javascript
// Use pre-save hooks for automated tasks
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});
```

### 5. Populate Wisely

```javascript
// Only populate when needed
const orders = await Order.find({ user: userId })
  .populate('items.product', 'name price images')
  .select('-__v');
```

### 6. Lean Queries

```javascript
// Use lean() for read-only operations
const products = await Product.find().lean();
```

### 7. Projection

```javascript
// Select only needed fields
const users = await User.find()
  .select('firstName lastName email')
  .lean();
```

### 8. Pagination

```javascript
// Always paginate large result sets
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;
const skip = (page - 1) * limit;

const products = await Product.find()
  .skip(skip)
  .limit(limit);
```

---

## Environment Variables

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# Database Options
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=2
```

---

**Last Updated:** December 2025 
**Version:** 1.0.0