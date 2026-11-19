/**
 * ORDER MODEL
 * Mongoose schema definition for storing orders in MongoDB Atlas.
 */
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
  shippingDetails: { type: String, required: true }, // Stores encrypted text string
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);