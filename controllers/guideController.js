const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

// Apply as guide
const applyAsGuide = async (req, res) => {
  try {
    const { guides } = getCollections();
    const guide = req.body;
    const { email } = guide;
    const isExist = await guides.findOne({ email });
    if (isExist) {
      return res.status(409).send({ message: 'User already exists' });
    }
    const result = await guides.insertOne(guide);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error applying as guide', error: error.message });
  }
};

// Get all guides applications
const getAllGuideApplications = async (req, res) => {
  try {
    const { guides } = getCollections();
    const result = await guides.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching guides', error: error.message });
  }
};

// Update user role from tourist to guide
const updateUserRoleToGuide = async (req, res) => {
  try {
    const { users, guides } = getCollections();
    const email = req.params.email;

    await users.updateOne(
      { email },
      { $set: { role: 'guide' } }
    );

    await guides.deleteOne({ email });

    const updatedUser = await users.findOne({ email });
    res.send(updatedUser);
  } catch (error) {
    res.status(500).send({ message: 'Error updating guide', error: error.message });
  }
};

// Delete guide application
const deleteGuideApplication = async (req, res) => {
  try {
    const { guides } = getCollections();
    const id = new ObjectId(req.params.id);
    const result = await guides.deleteOne({ _id: id });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error deleting guide', error: error.message });
  }
};

// Get guides for a specific package
const getGuidesForPackage = async (req, res) => {
  try {
    const { guides } = getCollections();
    const id = new ObjectId(req.params.id);
    const result = await guides.find({ packageId: id }).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching guides', error: error.message });
  }
};

module.exports = {
  applyAsGuide,
  getAllGuideApplications,
  updateUserRoleToGuide,
  deleteGuideApplication,
  getGuidesForPackage,
};
