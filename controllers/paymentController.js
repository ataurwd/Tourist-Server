const { ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.STRIP_SECRATE_KEY);
const { getCollections } = require('../config/database');

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { price, bookingId } = req.body;
    const amount = Math.round(Number(price) * 100);

    if (!Number.isFinite(amount) || amount < 50) {
      return res.status(400).send({
        message: 'Invalid price. Amount must be at least $0.50 USD.',
      });
    }

    const intentOptions = {
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: bookingId ? { bookingId: String(bookingId) } : {},
    };

    const requestOptions = bookingId
      ? { idempotencyKey: `booking-${bookingId}` }
      : undefined;

    const paymentIntent = await stripe.paymentIntents.create(
      intentOptions,
      requestOptions
    );

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe payment intent error:', error.message);
    res.status(500).send({
      message: error.message || 'Failed to create payment intent',
    });
  }
};

// Store payment information
const storePayment = async (req, res) => {
  try {
    const { payments } = getCollections();
    const payment = req.body;
    const result = await payments.insertOne(payment);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error storing payment', error: error.message });
  }
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const { payments } = getCollections();
    const result = await payments.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching payments', error: error.message });
  }
};

// Get single payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { payments } = getCollections();
    const id = new ObjectId(req.params.id);
    const result = await payments.findOne({ _id: id });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching payment', error: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  storePayment,
  getAllPayments,
  getPaymentById,
};
