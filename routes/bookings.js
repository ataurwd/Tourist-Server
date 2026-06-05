const express = require('express');
const {
  createGuideBooking,
  getAllGuideBookings,
  getBookingsByEmail,
  countBookingsByEmail,
  getBookingById,
  deleteBooking,
  rejectBooking,
  acceptBooking,
  updateBookingStatusToInReview,
} = require('../controllers/bookingController');

const router = express.Router();

// Create booking
router.post('/guide-booking', createGuideBooking);

// Get all bookings
router.get('/guide-bookings', getAllGuideBookings);

// Get bookings by email
router.get('/guide-booking/:email', getBookingsByEmail);

// Count bookings by email
router.get('/countGuide/:email', countBookingsByEmail);

// Get single booking
router.get('/guide-bookings/:id', getBookingById);

// Delete booking
router.delete('/guide-booking/:id', deleteBooking);

// Reject booking
router.patch('/update-status/:id', rejectBooking);

// Accept booking
router.patch('/update-accepted/:id', acceptBooking);

// Update booking status to in-review
router.patch('/update-guide-status/:id', updateBookingStatusToInReview);

module.exports = router;
