const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

// Create guide booking
const createGuideBooking = async (req, res) => {
  try {
    const { bookings } = getCollections();
    const booking = req.body;
    const result = await bookings.insertOne(booking);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error creating booking', error: error.message });
  }
};

// Get all guide bookings
const getAllGuideBookings = async (req, res) => {
  try {
    const { bookings } = getCollections();
    const result = await bookings.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get bookings by email with pagination
const getBookingsByEmail = async (req, res) => {
  try {
    const { bookings } = getCollections();
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const userEmail = req.params.email;
    const query = { email: userEmail };
    const result = await bookings
      .find(query)
      .skip(page * size)
      .limit(size)
      .toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching bookings', error: error.message });
  }
};

// Count bookings for a user
const countBookingsByEmail = async (req, res) => {
  try {
    const { bookings } = getCollections();
    const userEmail = req.params.email;
    const query = { email: userEmail };
    const result = await bookings.countDocuments(query);
    res.send({ result });
  } catch (error) {
    res.status(500).send({ message: 'Error counting bookings', error: error.message });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { bookings } = getCollections();
    const id = new ObjectId(req.params.id);
    const result = await bookings.findOne({ _id: id });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching booking', error: error.message });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const { bookings } = getCollections();
    const id = new ObjectId(req.params.id);
    const result = await bookings.deleteOne({ _id: id });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error deleting booking', error: error.message });
  }
};

// Update booking status to rejected
const rejectBooking = async (req, res) => {
  try {
    const { bookings } = getCollections();
    const id = req.params.id;

    await bookings.updateOne(
      { _id: new ObjectId(id) },
      { $set: { statas: 'rejected' } }
    );

    const updatedBooking = await bookings.findOne({ _id: new ObjectId(id) });
    res.send(updatedBooking);
  } catch (error) {
    res.status(500).send({ message: 'Error updating booking', error: error.message });
  }
};

// Update booking status to accepted
const acceptBooking = async (req, res) => {
  try {
    const { bookings } = getCollections();
    const id = req.params.id;

    await bookings.updateOne(
      { _id: new ObjectId(id) },
      { $set: { statas: 'accepted' } }
    );

    const updatedBooking = await bookings.findOne({ _id: new ObjectId(id) });
    res.send(updatedBooking);
  } catch (error) {
    res.status(500).send({ message: 'Error updating booking', error: error.message });
  }
};

// Update booking status to in-review
const updateBookingStatusToInReview = async (req, res) => {
  try {
    const { bookings } = getCollections();
    const id = req.params.id;

    await bookings.updateOne(
      { _id: new ObjectId(id) },
      { $set: { statas: 'in-review' } }
    );

    const updatedBooking = await bookings.findOne({ _id: new ObjectId(id) });
    res.send(updatedBooking);
  } catch (error) {
    res.status(500).send({ message: 'Error updating booking', error: error.message });
  }
};

module.exports = {
  createGuideBooking,
  getAllGuideBookings,
  getBookingsByEmail,
  countBookingsByEmail,
  getBookingById,
  deleteBooking,
  rejectBooking,
  acceptBooking,
  updateBookingStatusToInReview,
};
