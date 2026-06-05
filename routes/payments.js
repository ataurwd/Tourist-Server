const express = require('express');
const {
  createPaymentIntent,
  storePayment,
  getAllPayments,
  getPaymentById,
} = require('../controllers/paymentController');

const router = express.Router();

// Create payment intent
router.post('/stripe-payment', createPaymentIntent);

// Store payment
router.post('/payment', storePayment);

// Get all payments
router.get('/payments', getAllPayments);

// Get single payment
router.get('/payment/:id', getPaymentById);

module.exports = router;
