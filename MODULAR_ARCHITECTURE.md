# Backend Modular Architecture Documentation

## Project Structure

```
Tourist-Server/
├── index.js                 # Entry point - Express app setup
├── package.json
├── .env                     # Environment variables
├── config/
│   └── database.js         # MongoDB connection & collections
├── middleware/
│   ├── auth.js             # JWT token verification
│   └── cors.js             # CORS configuration
├── routes/
│   ├── auth.js             # Authentication routes (JWT, logout)
│   ├── users.js            # User-related routes
│   ├── stories.js          # Tourist stories routes
│   ├── guides.js           # Guide application & management routes
│   ├── packages.js         # Package management routes
│   ├── bookings.js         # Booking management routes
│   └── payments.js         # Payment processing routes
├── controllers/
│   ├── userController.js   # User business logic
│   ├── storyController.js  # Story business logic
│   ├── guideController.js  # Guide business logic
│   ├── packageController.js# Package business logic
│   ├── bookingController.js# Booking business logic
│   └── paymentController.js# Payment business logic
└── utils/
    └── jwt.js              # JWT utility functions
```

## Architecture Overview

### 1. **Entry Point (index.js)**

- Initializes Express app
- Sets up middleware (CORS, cookie-parser, JSON parser)
- Registers all routes
- Starts the server

### 2. **Configuration (config/)**

- **database.js**: Handles MongoDB connection and collection initialization
- Exports `getCollections()` function used by controllers

### 3. **Middleware (middleware/)**

- **auth.js**: Token verification middleware for protected routes
- **cors.js**: CORS configuration for cross-origin requests

### 4. **Routes (routes/)**

Each file contains Express router with endpoint definitions:

- Routes define the HTTP methods and endpoints
- Pass requests to appropriate controllers

### 5. **Controllers (controllers/)**

Contains business logic for each feature:

- Handles request/response logic
- Calls database operations
- Error handling

### 6. **Utilities (utils/)**

- **jwt.js**: JWT token generation and verification helpers

## API Endpoints

### Authentication

```
POST   /jwt                 # Generate JWT token
GET    /logout              # Clear authentication token
```

### Users

```
POST   /user                # Register user
GET    /users               # Get all users
GET    /user/:email         # Get user by email (requires auth)
GET    /users/:id           # Get user by ID
GET    /all-guides          # Get random 6 guides
GET    /searchName          # Search users by name
GET    /pagination          # Get paginated users
GET    /totalCount          # Get total user count
```

### Stories

```
POST   /add-stories         # Add new story
GET    /stories             # Get all stories
GET    /storie/:email       # Get stories by user email
GET    /story/:id           # Get single story
PATCH  /update/:id          # Update story
DELETE /story/:id           # Delete story
```

### Guides

```
POST   /guide               # Apply as guide
GET    /guides              # Get all guide applications
PATCH  /update-guide/:email # Approve guide application
DELETE /guide/:id           # Reject guide application
GET    /package-guides/:id  # Get guides for specific package
```

### Packages

```
POST   /add-package         # Create package (admin)
GET    /packages            # Get all packages
GET    /packages/all        # Get all packages (requires auth)
GET    /package/:id         # Get single package
PUT    /package/:id         # Update package (requires auth, admin)
DELETE /package/:id         # Delete package (requires auth, admin)
```

### Bookings

```
POST   /guide-booking       # Create booking
GET    /guide-bookings      # Get all bookings
GET    /guide-booking/:email # Get user's bookings (paginated)
GET    /countGuide/:email   # Count user's bookings
GET    /guide-bookings/:id  # Get single booking
DELETE /guide-booking/:id   # Delete booking
PATCH  /update-status/:id   # Reject booking
PATCH  /update-accepted/:id # Accept booking
PATCH  /update-guide-status/:id # Update booking to in-review
```

### Payments

```
POST   /stripe-payment      # Create Stripe payment intent
POST   /payment             # Store payment information
GET    /payments            # Get all payments
GET    /payment/:id         # Get single payment
```

## Key Features

✅ **Modular Structure**: Clean separation of concerns
✅ **All Endpoints Preserved**: No changes to API endpoints
✅ **Error Handling**: Try-catch blocks in all controllers
✅ **JWT Authentication**: Protected routes with token verification
✅ **MongoDB Integration**: Centralized database management
✅ **Scalability**: Easy to add new routes and controllers
✅ **Environment Variables**: Secure configuration through .env

## Environment Variables Required

```
PORT=7001
DB_USER=your_db_user
DB_PASSWORD=your_db_password
SECRETE_KEY=your_jwt_secret
STRIP_SECRATE_KEY=your_stripe_secret_key
NODE_ENV=development
```

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## How to Add New Features

### Example: Adding a new endpoint

1. **Create controller function** in `controllers/`

```javascript
const newFeature = async (req, res) => {
  try {
    // Your logic here
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Error", error: error.message });
  }
};
```

2. **Add route** in `routes/newFeature.js`

```javascript
const express = require("express");
const { newFeature } = require("../controllers/newController");
const router = express.Router();

router.get("/new-endpoint", newFeature);

module.exports = router;
```

3. **Register route** in `index.js`

```javascript
const newRoutes = require("./routes/newFeature");
app.use(newRoutes);
```

## Best Practices Implemented

- ✅ Controllers are separated from routes
- ✅ Database logic centralized in config
- ✅ Consistent error handling
- ✅ Middleware for cross-cutting concerns (auth, CORS)
- ✅ Utility functions for reusable code
- ✅ Clear naming conventions
- ✅ All endpoints maintain backwards compatibility
