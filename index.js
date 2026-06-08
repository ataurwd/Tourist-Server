require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const { corsMiddleware, corsOptionsDelegate } = require('./middleware/cors');
const { getCollections } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const storyRoutes = require('./routes/stories');
const guideRoutes = require('./routes/guides');
const packageRoutes = require('./routes/packages');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const messageRoutes = require('./routes/messages');
const conversationRoutes = require('./routes/conversations');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 7001;

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send_message', async (data) => {
    io.to(data.roomId).emit('receive_message', data);
    
    // Persist message to MongoDB
    try {
      const { messages: messageCollection } = getCollections();
      await messageCollection.insertOne({
        roomId: data.roomId,
        sender: data.sender,
        message: data.message,
        receiver: data.receiver,
        timestamp: new Date(data.timestamp)
      });
    } catch (error) {
      console.error('Error saving message to MongoDB:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

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
app.use(messageRoutes);
app.use('/conversations', conversationRoutes);

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
