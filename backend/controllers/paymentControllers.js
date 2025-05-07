require("dotenv").config();
const Order = require('../models/order');
const Payment = require('../models/payment'); // Import the Payment model
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initiate payment
exports.initiatePayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const amount = order.totalAmount * 100; // Stripe expects the amount in cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never' // Prevents redirect-based payments
      },
    });
    

    // Create a new payment record
    const payment = new Payment({
      orderId: order._id,
      paymentMethod: 'stripe', // Assuming Stripe for now
      paymentStatus: 'pending', // Initial payment status
      amount: amount,
      transactionId: paymentIntent.id,
      stripePaymentIntentId: paymentIntent.id, // Store Stripe PaymentIntent ID
    });

    await payment.save();

    // Update the order status
    order.paymentMethod = 'stripe';
    order.paymentStatus = 'pending';
    order.stripePaymentIntentId = paymentIntent.id; // Store the payment intent ID
    await order.save();

    res.status(200).json({
      message: 'Payment initiated',
      clientSecret: paymentIntent.client_secret, // Send this client secret to the client
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Order:', order);

    // Find the associated payment
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (status === 'succeeded') {
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      payment.paymentStatus = 'succeeded'; // Update payment status to succeeded
    } else {
      order.paymentStatus = 'failed';
      payment.paymentStatus = 'failed'; // Update payment status to failed
    }

    await order.save();
    await payment.save();

    res.status(200).json({ message: 'Payment status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Refund payment
exports.refundPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const payment = await Payment.findOne({ orderId: orderId, stripePaymentIntentId: order.stripePaymentIntentId });
    if (!payment || payment.paymentStatus !== 'succeeded') {
      return res.status(400).json({ message: 'Order not eligible for refund' });
    }

    // Process the refund with Stripe
    await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
    });

    // Update payment and order status
    payment.paymentStatus = 'refunded';
    order.paymentStatus = 'refunded';
    order.orderStatus = 'cancelled';

    await payment.save();
    await order.save();

    res.status(200).json({ message: 'Payment refunded successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
