const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

// Add package
const addPackage = async (req, res) => {
  try {
    const { packages } = getCollections();
    const packageItem = req.body;
    const result = await packages.insertOne(packageItem);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error adding package', error: error.message });
  }
};

// Get all packages
const getAllPackages = async (req, res) => {
  try {
    const { packages } = getCollections();
    const result = await packages.find().toArray();
    res.send(result);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

// Get all packages (with token verification)
const getAllPackagesWithAuth = async (req, res) => {
  try {
    const { packages } = getCollections();
    const result = await packages.find().toArray();
    res.send(result);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

// Get single package
const getPackageById = async (req, res) => {
  try {
    const { packages } = getCollections();
    const id = new ObjectId(req.params.id);
    const result = await packages.findOne({ _id: id });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching package', error: error.message });
  }
};

// Update package
const updatePackage = async (req, res) => {
  try {
    const { packages } = getCollections();
    const id = new ObjectId(req.params.id);
    const packageItem = req.body;
    console.log('Updating package:', id, 'with data:', packageItem);
    const result = await packages.updateOne(
      { _id: id },
      { $set: packageItem }
    );
    console.log('Update result:', result);
    res.send(result);
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).send({ message: 'Failed to update package', error: error.message });
  }
};

// Delete package
const deletePackage = async (req, res) => {
  try {
    const { packages } = getCollections();
    const id = new ObjectId(req.params.id);
    const result = await packages.deleteOne({ _id: id });
    res.send(result);
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).send({ message: 'Failed to delete package' });
  }
};

module.exports = {
  addPackage,
  getAllPackages,
  getAllPackagesWithAuth,
  getPackageById,
  updatePackage,
  deletePackage,
};
