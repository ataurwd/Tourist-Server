const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

const { users } = getCollections();

// Save user data
const saveUser = async (req, res) => {
  try {
    const { users: userCollection } = getCollections();
    const cartItem = req.body;
    const query = { email: cartItem.email };
    const existingUser = await userCollection.findOne(query);
    if (existingUser) {
      return res.status(409).send({ message: 'User already exists' });
    }
    const result = await userCollection.insertOne(cartItem);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error saving user', error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { users: userCollection } = getCollections();
    const result = await userCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching users', error: error.message });
  }
};

// Get user by email
const getUserByEmail = async (req, res) => {
  try {
    const { users: userCollection } = getCollections();
    const mainEmail = req.params.email;
    const decodedEmail = req.user?.email;
    if (decodedEmail !== mainEmail) {
      return res.status(401).send('unauthorized to access this data');
    }

    const query = { email: mainEmail };
    const result = await userCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching user', error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { users: userCollection } = getCollections();
    const id = new ObjectId(req.params.id);
    const result = await userCollection.findOne({ _id: id });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching user', error: error.message });
  }
};

// Get all guides (random 6)
const getAllGuides = async (req, res) => {
  try {
    const { users: userCollection } = getCollections();
    const result = await userCollection
      .aggregate([{ $match: { role: 'guide' } }, { $sample: { size: 6 } }])
      .toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching guides', error: error.message });
  }
};

// Search users by name
const searchUserByName = async (req, res) => {
  try {
    const { users: userCollection } = getCollections();
    const { search } = req.query;
    let option = {};
    if (search) {
      option = { name: { $regex: search, $options: 'i' } };
    }

    const result = await userCollection.find(option).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error searching users', error: error.message });
  }
};

// Get paginated users
const getPaginatedUsers = async (req, res) => {
  try {
    const { users: userCollection } = getCollections();
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);

    const result = await userCollection
      .find()
      .skip(page * size)
      .limit(size)
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching users', error: error.message });
  }
};

// Get total user count
const getTotalUserCount = async (req, res) => {
  try {
    const { users: userCollection } = getCollections();
    const result = await userCollection.estimatedDocumentCount();
    res.send({ result });
  } catch (error) {
    res.status(500).send({ message: 'Error counting users', error: error.message });
  }
};

module.exports = {
  saveUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  getAllGuides,
  searchUserByName,
  getPaginatedUsers,
  getTotalUserCount,
};
