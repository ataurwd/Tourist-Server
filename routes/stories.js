const express = require('express');
const {
  addStory,
  getAllStories,
  getStoriesByEmail,
  getStoryById,
  updateStory,
  deleteStory,
} = require('../controllers/storyController');

const router = express.Router();

// Add story
router.post('/add-stories', addStory);

// Get all stories
router.get('/stories', getAllStories);

// Get stories by email
router.get('/storie/:email', getStoriesByEmail);

// Get single story
router.get('/story/:id', getStoryById);

// Update story
router.patch('/update/:id', updateStory);

// Delete story
router.delete('/story/:id', deleteStory);

module.exports = router;
