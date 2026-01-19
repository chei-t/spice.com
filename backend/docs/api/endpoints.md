# Spice E-commerce Platform API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.spice-store.com/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Routes (`/api/auth`)

### 1.1 Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `password`: Min 8 characters, must contain uppercase, lowercase, number, special char
- `firstName`, `lastName`: Required, 2-50 characters
- `phone`: Optional, valid phone format

**Error Responses:**
- `400` - Validation error or email already exists
- `500` - Server error

---

### 1.2 Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `403` - Account deactivated
- `500` - Server error

---

### 1.3 Refresh Token
**POST** `/auth/refresh-token`

**Authentication Required:** Yes

Refresh an expired JWT token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

---

### 1.4 Logout
**POST** `/auth/logout`

**Authentication Required:** Yes

Logout user and invalidate token.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 1.5 Forgot Password
**POST** `/auth/forgot-password`

Request password reset link.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

### 1.6 Reset Password
**POST** `/auth/reset-password/:token`

Reset password using token from email.

**Request Body:**
```json
{
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## 2. User Routes (`/api/users`)

**Authentication Required:** Yes (All endpoints)

### 2.1 Get User Profile
**GET** `/users/profile`

Get current user's profile information.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "customer",
    "createdAt": "2024-01-15T10:30:00Z",
    "isActive": true
  }
}
```

---

### 2.2 Update User Profile
**PUT** `/users/profile`

Update user profile information.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890"
  }
}
```

---

### 2.3 Change Password
**PUT** `/users/change-password`

Change user password.

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `401` - Current password incorrect
- `400` - Validation error

---

### 2.4 Delete Account
**DELETE** `/users/account`

Delete user account (soft delete).

**Request Body:**
```json
{
  "password": "SecurePass123!",
  "confirmDeletion": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 3. Product Routes (`/api/products`)

### 3.1 Get All Products
**GET** `/products`

**Authentication Required:** No

Get paginated list of products with filtering and sorting.

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 20): Items per page
- `category` (string): Filter by category ID
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `search` (string): Search in product name/description
- `sort` (string): Sort by field (price, name, createdAt)
- `order` (string): Sort order (asc, desc)
- `inStock` (boolean): Filter in-stock products only

**Example Request:**
```
GET /products?page=1&limit=20&category=electronics&minPrice=100&maxPrice=500&sort=price&order=asc
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "productId": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "Wireless Headphones",
        "description": "Premium noise-canceling headphones",
        "price": 299.99,
        "salePrice": 249.99,
        "stockQuantity": 50,
        "category": {
          "categoryId": "64f1a2b3c4d5e6f7g8h9i0j2",
          "name": "Electronics"
        },
        "brand": "AudioTech",
        "images": [
          {
            "imageUrl": "https://cdn.example.com/image1.jpg",
            "isPrimary": true
          }
        ],
        "averageRating": 4.5,
        "reviewCount": 128,
        "isActive": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "itemsPerPage": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### 3.2 Get Product by ID
**GET** `/products/:id`

**Authentication Required:** No

Get detailed information about a specific product.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "productId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Wireless Headphones",
    "description": "Premium noise-canceling headphones with 30-hour battery life",
    "price": 299.99,
    "salePrice": 249.99,
    "stockQuantity": 50,
    "category": {
      "categoryId": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Electronics",
      "slug": "electronics"
    },
    "brand": "AudioTech",
    "sku": "AT-WH-001",
    "specifications": {
      "color": "Black",
      "weight": "250g",
      "batteryLife": "30 hours",
      "connectivity": "Bluetooth 5.0"
    },
    "images": [
      {
        "imageId": "img001",
        "imageUrl": "https://cdn.example.com/image1.jpg",
        "altText": "Wireless Headphones Front View",
        "isPrimary": true
      }
    ],
    "averageRating": 4.5,
    "reviewCount": 128,
    "reviews": [],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `404` - Product not found

---

### 3.3 Create Product (Admin Only)
**POST** `/products`

**Authentication Required:** Yes (Admin)

Create a new product.

**Request Body:**
```json
{
  "name": "Wireless Headphones",
  "description": "Premium noise-canceling headphones",
  "price": 299.99,
  "salePrice": 249.99,
  "stockQuantity": 50,
  "categoryId": "64f1a2b3c4d5e6f7g8h9i0j2",
  "brand": "AudioTech",
  "sku": "AT-WH-001",
  "specifications": {
    "color": "Black",
    "weight": "250g"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "productId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Wireless Headphones",
    "price": 299.99
  }
}
```

**Error Responses:**
- `400` - Validation error
- `403` - Forbidden (not admin)
- `409` - SKU already exists

---

### 3.4 Update Product (Admin Only)
**PUT** `/products/:id`

**Authentication Required:** Yes (Admin)

Update existing product.

**Request Body:** (All fields optional)
```json
{
  "name": "Wireless Headphones Pro",
  "price": 349.99,
  "stockQuantity": 100
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "productId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Wireless Headphones Pro",
    "price": 349.99
  }
}
```

---

### 3.5 Delete Product (Admin Only)
**DELETE** `/products/:id`

**Authentication Required:** Yes (Admin)

Delete a product (soft delete).

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 3.6 Upload Product Images (Admin Only)
**POST** `/products/:id/images`

**Authentication Required:** Yes (Admin)

Upload product images (supports multiple files).

**Request:** `multipart/form-data`
- Field name: `images`
- Max files: 5
- Allowed types: jpg, jpeg, png, webp
- Max size per file: 5MB

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": {
    "images": [
      {
        "imageId": "img001",
        "imageUrl": "https://cdn.example.com/image1.jpg",
        "isPrimary": true
      }
    ]
  }
}
```

---

## 4. Cart Routes (`/api/cart`)

**Authentication Required:** Yes (All endpoints)

### 4.1 Get User Cart
**GET** `/cart`

Get current user's cart with all items.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "cartId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "items": [
      {
        "cartItemId": "item001",
        "product": {
          "productId": "64f1a2b3c4d5e6f7g8h9i0j2",
          "name": "Wireless Headphones",
          "price": 249.99,
          "images": [
            {
              "imageUrl": "https://cdn.example.com/image1.jpg"
            }
          ],
          "stockQuantity": 50
        },
        "quantity": 2,
        "subtotal": 499.98
      }
    ],
    "totalItems": 2,
    "totalAmount": 499.98,
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 4.2 Add Item to Cart
**POST** `/cart/items`

Add a product to cart.

**Request Body:**
```json
{
  "productId": "64f1a2b3c4d5e6f7g8h9i0j2",
  "quantity": 2
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cartItemId": "item001",
    "product": {
      "productId": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Wireless Headphones"
    },
    "quantity": 2
  }
}
```

**Error Responses:**
- `400` - Invalid quantity or product not available
- `404` - Product not found

---

### 4.3 Update Cart Item
**PUT** `/cart/items/:itemId`

Update quantity of cart item.

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": {
    "cartItemId": "item001",
    "quantity": 3,
    "subtotal": 749.97
  }
}
```

---

### 4.4 Remove Item from Cart
**DELETE** `/cart/items/:itemId`

Remove an item from cart.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### 4.5 Clear Cart
**DELETE** `/cart`

Remove all items from cart.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

## 5. Wishlist Routes (`/api/wishlist`)

**Authentication Required:** Yes (All endpoints)

### 5.1 Get User Wishlist
**GET** `/wishlist`

Get current user's wishlist.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "wishlistId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "items": [
      {
        "wishlistItemId": "wish001",
        "product": {
          "productId": "64f1a2b3c4d5e6f7g8h9i0j2",
          "name": "Wireless Headphones",
          "price": 249.99,
          "salePrice": 199.99,
          "images": [
            {
              "imageUrl": "https://cdn.example.com/image1.jpg"
            }
          ],
          "inStock": true
        },
        "addedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "totalItems": 5
  }
}
```

---

### 5.2 Add to Wishlist
**POST** `/wishlist/items`

Add a product to wishlist.

**Request Body:**
```json
{
  "productId": "64f1a2b3c4d5e6f7g8h9i0j2"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Product added to wishlist",
  "data": {
    "wishlistItemId": "wish001",
    "productId": "64f1a2b3c4d5e6f7g8h9i0j2"
  }
}
```

---

### 5.3 Remove from Wishlist
**DELETE** `/wishlist/items/:itemId`

Remove item from wishlist.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Item removed from wishlist"
}
```

---

### 5.4 Move to Cart
**POST** `/wishlist/items/:itemId/move-to-cart`

Move wishlist item to cart.

**Request Body:**
```json
{
  "quantity": 1
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Item moved to cart",
  "data": {
    "cartItemId": "item001"
  }
}
```

---

## 6. Order Routes (`/api/orders`)

**Authentication Required:** Yes (All endpoints)

### 6.1 Create Order
**POST** `/orders`

Create a new order from cart items.

**Request Body:**
```json
{
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardToken": "tok_visa_xxxx"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "orderNumber": "ORD-2024-001234",
    "totalAmount": 499.98,
    "status": "pending",
    "estimatedDelivery": "2024-01-20T00:00:00Z"
  }
}
```

---

### 6.2 Get User Orders
**GET** `/orders`

Get all orders for current user.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "64f1a2b3c4d5e6f7g8h9i0j1",
        "orderNumber": "ORD-2024-001234",
        "totalAmount": 499.98,
        "status": "delivered",
        "orderDate": "2024-01-15T10:30:00Z",
        "items": [
          {
            "product": {
              "name": "Wireless Headphones",
              "image": "https://cdn.example.com/image1.jpg"
            },
            "quantity": 2,
            "unitPrice": 249.99
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 15
    }
  }
}
```

---

### 6.3 Get Order by ID
**GET** `/orders/:id`

Get detailed information about specific order.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "orderId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "orderNumber": "ORD-2024-001234",
    "status": "shipped",
    "orderDate": "2024-01-15T10:30:00Z",
    "items": [
      {
        "orderItemId": "item001",
        "product": {
          "productId": "64f1a2b3c4d5e6f7g8h9i0j2",
          "name": "Wireless Headphones",
          "image": "https://cdn.example.com/image1.jpg"
        },
        "quantity": 2,
        "unitPrice": 249.99,
        "totalPrice": 499.98
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "payment": {
      "paymentMethod": "credit_card",
      "status": "completed",
      "amount": 499.98,
      "transactionId": "txn_123456"
    },
    "shipping": {
      "trackingNumber": "TRACK123456",
      "carrier": "FedEx",
      "status": "in_transit",
      "estimatedDelivery": "2024-01-20T00:00:00Z"
    },
    "totalAmount": 499.98,
    "taxAmount": 39.99,
    "shippingAmount": 10.00,
    "discountAmount": 0.00
  }
}
```

---

### 6.4 Cancel Order
**POST** `/orders/:id/cancel`

Cancel an order (only if status is 'pending' or 'processing').

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "orderId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "status": "cancelled",
    "refundAmount": 499.98,
    "refundStatus": "processing"
  }
}
```

**Error Responses:**
- `400` - Order cannot be cancelled (already shipped/delivered)

---

## 7. Review Routes (`/api/reviews`)

### 7.1 Get Product Reviews
**GET** `/reviews/product/:productId`

**Authentication Required:** No

Get all reviews for a product.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `rating` (number): Filter by rating

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "reviewId": "64f1a2b3c4d5e6f7g8h9i0j1",
        "user": {
          "firstName": "John",
          "lastName": "D."
        },
        "rating": 5,
        "title": "Excellent product!",
        "comment": "Great sound quality and comfortable to wear.",
        "isVerifiedPurchase": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "summary": {
      "averageRating": 4.5,
      "totalReviews": 128,
      "ratingDistribution": {
        "5": 80,
        "4": 30,
        "3": 10,
        "2": 5,
        "1": 3
      }
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 13
    }
  }
}
```

---

### 7.2 Create Review
**POST** `/reviews`

**Authentication Required:** Yes

Create a product review.

**Request Body:**
```json
{
  "productId": "64f1a2b3c4d5e6f7g8h9i0j2",
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Great sound quality and very comfortable."
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "reviewId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "rating": 5,
    "isVerifiedPurchase": true
  }
}
```

**Validation:**
- User must have purchased the product
- One review per product per user
- Rating: 1-5 stars

---

### 7.3 Update Review
**PUT** `/reviews/:id`

**Authentication Required:** Yes

Update user's own review.

**Request Body:**
```json
{
  "rating": 4,
  "title": "Good product",
  "comment": "Updated review text"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Review updated successfully"
}
```

---

### 7.4 Delete Review
**DELETE** `/reviews/:id`

**Authentication Required:** Yes

Delete user's own review.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## 8. Admin Routes (`/api/admin`)

**Authentication Required:** Yes (Admin role)

### 8.1 Get Dashboard Stats
**GET** `/admin/dashboard`

Get admin dashboard statistics.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalRevenue": 125000.50,
    "totalOrders": 1250,
    "totalCustomers": 850,
    "totalProducts": 320,
    "recentOrders": 45,
    "pendingOrders": 12,
    "lowStockProducts": 8,
    "revenueByMonth": [
      { "month": "Jan", "revenue": 45000 },
      { "month": "Feb", "revenue": 52000 }
    ],
    "topSellingProducts": [
      {
        "productId": "64f1a2b3c4d5e6f7g8h9i0j2",
        "name": "Wireless Headphones",
        "soldQuantity": 450
      }
    ]
  }
}
```

---

### 8.2 Get All Orders (Admin)
**GET** `/admin/orders`

Get all orders with admin filters.

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status
- `dateFrom`, `dateTo`: Date range
- `search`: Search by order number or customer

**Response:** Similar to user orders but includes all users' orders

---

### 8.3 Update Order Status
**PUT** `/admin/orders/:id/status`

Update order status.

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456",
  "carrier": "FedEx"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "orderId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "status": "shipped",
    "trackingNumber": "TRACK123456"
  }
}
```

---

### 8.4 Get All Customers
**GET** `/admin/customers`

Get list of all customers.

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Search by name or email
- `active`: Filter active/inactive

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "totalOrders": 5,
        "totalSpent": 1250.00,
        "createdAt": "2024-01-15T10:30:00Z",
        "isActive": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 20,
      "totalItems": 850
    }
  }
}
```

---

### 8.5 Create Flash Sale
**POST** `/admin/flash-sales`

Create a new flash sale.

**Request Body:**
```json
{
  "name": "Summer Sale 2024",
  "description": "Big summer discounts",
  "discountPercentage": 25,
  "startDate": "2024-07-01T00:00:00Z",
  "endDate": "2024-07-15T23:59:59Z",
  "productIds": [
    "64f1a2b3c4d5e6f7g8h9i0j2",
    "64f1a2b3c4d5e6f7g8h9i0j3"
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Flash sale created successfully",
  "data": {
    "flashSaleId": "64f1a2b3c4d5nceidw",
    "name": "Summer Sale 2024",
    "startDate": "2024-07-01T00:00:00Z",
    "endDate": "2024-07-15T23:59:59Z",
    "productCount": 2
  }
}

```

---