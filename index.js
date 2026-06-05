require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { corsMiddleware, corsOptionsDelegate } = require('./middleware/cors');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const storyRoutes = require('./routes/stories');
const guideRoutes = require('./routes/guides');
const packageRoutes = require('./routes/packages');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');

const app = express();
const port = process.env.PORT || 7001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.options('*', corsOptionsDelegate);

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Register routes
app.use(authRoutes);
app.use(userRoutes);
app.use(storyRoutes);
app.use(guideRoutes);
app.use(packageRoutes);
app.use(bookingRoutes);
app.use(paymentRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

