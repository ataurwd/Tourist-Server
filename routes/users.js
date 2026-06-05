const express = require('express');
const { verifyTokenMiddleware } = require('../middleware/auth');
const {
  saveUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  getAllGuides,
  searchUserByName,
  getPaginatedUsers,
  getTotalUserCount,
} = require('../controllers/userController');

const router = express.Router();

// Save user
router.post('/user', saveUser);

// Get all users
router.get('/users', getAllUsers);

// Get user by email with verification
router.get('/user/:email', verifyTokenMiddleware, getUserByEmail);

// Get user by ID
router.get('/users/:id', getUserById);

// Get all guides (random 6)
router.get('/all-guides', getAllGuides);

// Search users by name
router.get('/searchName', searchUserByName);

// Get paginated users
router.get('/pagination', getPaginatedUsers);

// Get total user count
router.get('/totalCount', getTotalUserCount);

module.exports = router;
