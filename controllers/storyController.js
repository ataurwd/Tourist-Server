const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

// Add story
const addStory = async (req, res) => {
  try {
    const { stories } = getCollections();
    const story = req.body;
    const result = await stories.insertOne(story);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error adding story', error: error.message });
  }
};

// Get all stories
const getAllStories = async (req, res) => {
  try {
    const { stories } = getCollections();
    const result = await stories.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching stories', error: error.message });
  }
};

// Get stories by email
const getStoriesByEmail = async (req, res) => {
  try {
    const { stories } = getCollections();
    const mainEmail = req.params.email;
    const query = { email: mainEmail };
    const result = await stories.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching stories', error: error.message });
  }
};

// Get single story by ID
const getStoryById = async (req, res) => {
  try {
    const { stories } = getCollections();
    const id = new ObjectId(req.params.id);
    const result = await stories.findOne({ _id: id });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching story', error: error.message });
  }
};

// Update story
const updateStory = async (req, res) => {
  try {
    const { stories } = getCollections();
    const id = req.params.id;
    const { title, storyText, images } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid story ID' });
    }

    await stories.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, storyText, images } }
    );

    const updatedStory = await stories.findOne({ _id: new ObjectId(id) });
    res.send(updatedStory);
  } catch (error) {
    res.status(500).send({ message: 'Error updating story', error: error.message });
  }
};

// Delete story
const deleteStory = async (req, res) => {
  try {
    const { stories } = getCollections();
    const id = new ObjectId(req.params.id);
    const result = await stories.deleteOne({ _id: id });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error deleting story', error: error.message });
  }
};

module.exports = {
  addStory,
  getAllStories,
  getStoriesByEmail,
  getStoryById,
  updateStory,
  deleteStory,
};
