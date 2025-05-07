const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // Reference to the Order model
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'crypto', 'cash', 'stripe'],
    required: true,
  },
  paymentStatus: {
    type: String, // 'pending', 'succeeded', 'failed', etc.
    required: true,
  },
  amount: {
    type: Number, // Amount in the smallest currency unit (e.g., cents for USD)
    required: true,
  },
  transactionId: {
    type: String, // Transaction ID from Stripe or other payment processors
    required: true,
  },
  stripePaymentIntentId: {
    type: String, // Store the Stripe PaymentIntent ID for future reference
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // The date the payment was created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // The date the payment record was last updated
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
