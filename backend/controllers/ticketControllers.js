const Order = require('../models/order')
const QRCode = require('qrcode')

exports.buyTicket = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body

    if (!orderId || !paymentMethod) {
      return res.status(400).json({ message: 'Order ID and payment method are required' })
    }

    // Find the order by its ID
    const order = await Order.findById(orderId).populate('event')
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const { event, tickets } = order

    if (!tickets || tickets.length === 0) {
      return res.status(400).json({ message: 'No tickets found in the order' })
    }

    // Calculate the total amount based on the tickets
    let totalAmount = 0
    for (const ticket of tickets) {
      const ticketType = event.ticketTypes.find(t => t.type === ticket.ticketType)
      if (!ticketType) {
        return res.status(400).json({ message: `Invalid ticket type: ${ticket.ticketType}` })
      }
      totalAmount += ticket.quantity * ticketType.price
    }

    // Update the order with the payment method and status
    order.paymentMethod = paymentMethod
    order.paymentStatus = 'pending' // you can change this to 'paid' once payment is processed
    order.totalAmount = totalAmount

    await order.save()

    res.status(200).json({ message: 'Ticket purchase initiated', order })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}


exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Order.find({ user: req.user.id, paymentStatus: 'paid' })
      .populate('event', 'title date location')
      .select('tickets event')

    res.status(200).json(tickets)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
exports.generateQRCode = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('event', 'title date location')
      .populate('user', 'firstName lastName email')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Unauthorized access' })
    // }

    const qrData = {
      orderId: order._id,
      event: order.event.title,
      date: order.event.date,
      user: `${order.user.firstName} ${order.user.lastName}`,
      tickets: order.tickets.map(ticket => ({
        id: ticket._id,
        type: ticket.ticketType,
      }))
    
    }
    res.setHeader('Content-Type', 'image/png')
    QRCode.toFileStream(res, JSON.stringify(qrData))
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
}
