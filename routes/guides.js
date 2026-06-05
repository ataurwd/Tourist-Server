const express = require('express');
const {
  applyAsGuide,
  getAllGuideApplications,
  updateUserRoleToGuide,
  deleteGuideApplication,
  getGuidesForPackage,
} = require('../controllers/guideController');

const router = express.Router();

// Apply as guide
router.post('/guide', applyAsGuide);

// Get all guide applications
router.get('/guides', getAllGuideApplications);

// Update user role to guide
router.patch('/update-guide/:email', updateUserRoleToGuide);

// Delete guide application
router.delete('/guide/:id', deleteGuideApplication);

// Get guides for package
router.get('/package-guides/:id', getGuidesForPackage);

module.exports = router;
