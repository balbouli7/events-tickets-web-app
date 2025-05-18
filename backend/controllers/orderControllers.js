const Order = require('../models/order')
const Event = require('../models/event')
const User = require("../models/user")

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { event, tickets, paymentMethod } = req.body

    if (!event || !tickets || tickets.length === 0 || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const selectedEvent = await Event.findById(event)
    if (!selectedEvent) {
      return res.status(404).json({ message: 'Event not found' })
    }

    let totalAmount = 0
    for (const ticket of tickets) {
      const ticketType = selectedEvent.ticketTypes.find(t => t.type === ticket.ticketType)
      if (!ticketType) {
        return res.status(400).json({ message: `Invalid ticket type: ${ticket.ticketType}` })
      }
      totalAmount += ticket.quantity * ticketType.price
    }

    const newOrder = new Order({
      user: req.user.id,
      event,
      tickets,
      totalAmount,
      paymentMethod,
    })

    await newOrder.save()
    res.status(201).json({ message: 'Order placed successfully', order: newOrder })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get order by ID (User/Admin)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('event', 'title date location')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' })
    }

    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get all orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id, isDeleted: false }).populate('event', 'title date location')
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' })
    }

    const orders = await Order.find()
    .populate('user', 'firstName lastName email')
    .populate('event');  // This will populate the event field as well
      res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// delete event
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isDeleted = true;
    await order.save();

    res.status(200).json({ message: 'Order hidden successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

