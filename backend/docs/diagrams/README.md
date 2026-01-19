# System Diagrams Documentation

This folder contains all architectural and flow diagrams for the spice e-commerce platform.

## Overview

The diagrams are created in Mermaid format for easy rendering and maintenance. You can view them directly on GitHub or convert them to images using various tools.

---

## Available Diagrams

### 1. ER Diagram (`er-diagram.mmd`)
**Purpose:** Database schema and relationships

**Shows:**
- All database entities (User, Product, Order, Cart, etc.)
- Relationships between entities
- Primary and foreign keys
- Cardinality (one-to-many, many-to-many)

**Use Cases:**
- Database design reference
- Understanding data relationships
- Planning queries and indexes
- Onboarding new developers

---

### 2. System Architecture (`system-architecture.mmd`)
**Purpose:** High-level system overview

**Components:**

#### Client Layer
- Frontend application (React/HTML/CSS/JS)
- User interface and interactions

#### API Layer
- API Gateway / Load Balancer
- Request routing and distribution
- SSL/TLS termination

#### Application Layer
- Backend Server (Node.js + Express)
- Business logic modules:
  - Authentication Module
  - Product Management
  - Order Processing
  - Cart & Wishlist
  - Admin Dashboard

#### Data Layer
- MongoDB (Main Database)
  - User data
  - Products
  - Orders
  - Reviews
- Redis Cache (Optional)
  - Session storage
  - Frequently accessed data
  - Rate limiting data

#### Storage Layer
- AWS S3 / Cloudinary
  - Product images
  - User uploads
  - Generated documents

#### External Services
- Payment Gateway (Stripe/PayPal)
- Email Service (SendGrid/Mailgun)
- Analytics (Google Analytics)

**Data Flow:**
```
User → Frontend → API Gateway → Backend → Database/Storage
                                    ↓
                          External Services
```

---

### 3. Authentication Flow (`auth-flow.mmd`)
**Purpose:** Detailed authentication process

**Flows Covered:**

#### Registration Flow
1. User submits registration form
2. Frontend validates input
3. Backend receives request
4. Email uniqueness check
5. Password hashing (bcrypt)
6. User creation in database
7. JWT token generation
8. Token sent to frontend
9. Token storage and redirect

#### Login Flow
1. User submits credentials
2. Backend finds user by email
3. Password verification (bcrypt compare)
4. Account status check
5. JWT token generation (access + refresh)
6. Refresh token storage
7. Tokens sent to frontend
8. Token storage and redirect

#### Authenticated Request Flow
1. User requests protected resource
2. Frontend sends request with JWT
3. Backend verifies token
4. If expired:
   - Frontend requests token refresh
   - Backend validates refresh token
   - New access token generated
   - Original request retried
5. If valid:
   - Request processed
   - Data returned

#### Logout Flow
1. User clicks logout
2. Backend invalidates refresh token
3. Frontend clears stored tokens
4. Redirect to login

**Security Measures:**
- Password hashing with bcrypt
- JWT with short expiration
- Refresh token rotation
- Token invalidation on logout

---

### 4. Data Flow - Order Processing (`data-flow.mmd`)
**Purpose:** Order creation and processing flow

**Steps:**

#### Pre-Order
1. User views cart
2. Cart validation (items exist, in stock)
3. Shipping address entry
4. Payment method selection
5. Order summary review

#### Order Creation
1. User confirms order
2. Backend validation
3. Stock availability check
4. Total amount calculation
5. Payment processing
6. Payment verification

#### Post-Order
1. Order record creation
2. Product stock update
3. Cart clearing
4. Email confirmation
5. Invoice generation
6. Analytics update

#### Order Tracking
- Status progression:
  - Pending → Processing → Shipped → Delivered
- Real-time status updates
- Tracking number assignment
- Delivery notifications

**Error Handling:**
- Empty cart detection
- Out of stock notification
- Payment failure handling
- Validation error messages

---

## How to View Diagrams

### Option 1: GitHub (Automatic Rendering)
- GitHub automatically renders `.mmd` files
- Simply open the file on GitHub

### Option 2: VS Code
1. Install "Markdown Preview Mermaid Support" extension
2. Open any markdown file with mermaid code blocks
3. Use preview (Ctrl+Shift+V)

### Option 3: Mermaid Live Editor
1. Visit https://mermaid.live/
2. Copy diagram code
3. Paste and view/edit
4. Export as PNG/SVG

### Option 4: Convert to Images
Using Mermaid CLI:
```bash
# Install mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Convert to PNG
mmdc -i system-architecture.mmd -o system-architecture.png

# Convert to SVG
mmdc -i system-architecture.mmd -o system-architecture.svg
```

---

## Diagram Maintenance

### When to Update

#### ER Diagram
- New entity added
- Relationship changes
- Field modifications
- Index changes

#### System Architecture
- New service integration
- Infrastructure changes
- Deployment architecture updates
- New external services

#### Authentication Flow
- Auth mechanism changes
- New security measures
- Token handling updates
- Role changes

#### Data Flow
- Business process changes
- New features
- Workflow modifications
- Integration updates

### Best Practices
1. **Keep diagrams in sync with code**
   - Update diagrams during development
   - Review during code reviews

2. **Use consistent notation**
   - Follow Mermaid syntax
   - Use standard shapes and colors

3. **Add comments in complex sections**
   ```mermaid
   %% This section handles payment processing
   ```

4. **Version control**
   - Commit diagram updates with related code
   - Document major changes in commit messages

5. **Export images for documentation**
   - Generate PNG/SVG versions
   - Include in presentations/reports

---

## Diagram Color Coding

### System Architecture
- **Blue** (#e1f5ff): Client/Frontend layer
- **Yellow** (#fff4e1): Gateway/Routing layer
- **Green** (#e8f5e9): Application/Backend layer
- **Purple** (#f3e5f5): Database layer
- **Pink** (#fce4ec): Cache layer
- **Light Yellow** (#fff9c4): Storage layer
- **Red** (#ffebee): Payment services
- **Teal** (#e0f2f1): Communication services
- **Light Green** (#f1f8e9): Analytics

### Data Flow
- **Blue** (#e1f5ff): Start/Entry points
- **Red** (#ffcdd2): Error states/End points
- **Yellow** (#fff9c4): Warning states
- **Green** (#c8e6c9): Success states
- **Purple** (#e1bee7): Processing states
- **Orange** (#ffecb3): Payment processing
- **Cyan** (#b2ebf2): Database operations

---

## Additional Resources

### Mermaid Documentation
- Official docs: https://mermaid.js.org/
- Syntax guide: https://mermaid.js.org/intro/

### Diagram Types
- Flowchart: Process flows and logic
- Sequence: Interaction between components
- ER Diagram: Database relationships
- Class Diagram: Object structures

### Tools
- **Mermaid Live**: https://mermaid.live/
- **Draw.io**: https://draw.io/
- **Lucidchart**: https://lucidchart.com/
- **dbdiagram.io**: https://dbdiagram.io/ (for database diagrams)

---

## File Structure

```
docs/diagrams/
├── README.md                    # This file
├── er-diagram.mmd              # Database ER diagram
├── system-architecture.mmd     # System architecture
├── auth-flow.mmd               # Authentication flow
├── data-flow.mmd               # Order processing flow
├── exported/                   # Exported image files
│   ├── er-diagram.png
│   ├── system-architecture.png
│   ├── auth-flow.png
│   └── data-flow.png
└── sources/                    # Original source files (if any)
```

---

## Contributing

When adding or updating diagrams:

1. **Create the diagram** in Mermaid format
2. **Test rendering** using Mermaid Live Editor
3. **Update this README** with description
4. **Export images** for presentations
5. **Commit with descriptive message**

Example commit message:
```
docs: update system architecture diagram

- Added Redis cache layer
- Updated external services
- Added data flow arrows
```

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Maintained by:** Development Team