const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  ticketTypes: [
    {
      type: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },  // Current available
      initialQuantity: { type: Number, required: true }  // Original total
    },
  ],
  totalTickets: { type: Number, required: true },
  availableTickets: { type: Number, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

// Middleware to calculate totals before saving
eventSchema.pre("save", function(next) {
  this.totalTickets = this.ticketTypes.reduce(
    (sum, ticket) => sum + ticket.initialQuantity,
    0
  );
  this.availableTickets = this.ticketTypes.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0
  );
  next();
});

module.exports = mongoose.model("Event", eventSchema);