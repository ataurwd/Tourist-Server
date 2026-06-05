const express = require('express');
const { verifyTokenMiddleware } = require('../middleware/auth');
const {
  addPackage,
  getAllPackages,
  getAllPackagesWithAuth,
  getPackageById,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');

const router = express.Router();

// Add package
router.post('/add-package', addPackage);

// Get all packages
router.get('/packages', getAllPackages);

// Get all packages with auth
router.get('/packages/all', verifyTokenMiddleware, getAllPackagesWithAuth);

// Get single package
router.get('/package/:id', getPackageById);

// Update package
router.put('/package/:id', verifyTokenMiddleware, updatePackage);

// Delete package
router.delete('/package/:id', verifyTokenMiddleware, deletePackage);

module.exports = router;
