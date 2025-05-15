require("dotenv").config();
const Event = require('../models/event')
const { upload, cloudinary } = require("../config/cloudinary");
const multer = require("multer");
const fs = require('fs');  // For file operations like deleting old image
const path = require('path');

// create event
exports.createEvent = async (req, res) => {
  try {
    let { title, description, date, location, category, ticketTypes } = req.body;

    // Check for required fields
    if (!title || !description || !date || !location || !category || !ticketTypes) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Parse ticketTypes
    let parsedTicketTypes;
    if (typeof ticketTypes === 'string') {
      try {
        parsedTicketTypes = JSON.parse(ticketTypes);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid ticketTypes format' });
      }
    } else if (Array.isArray(ticketTypes)) {
      parsedTicketTypes = ticketTypes;
    } else {
      return res.status(400).json({ message: 'ticketTypes must be an array or a valid JSON string' });
    }

    // Validate ticket types
    parsedTicketTypes = parsedTicketTypes.map(ticket => {
      return {
        type: ticket.type,
        price: ticket.price,
        quantity: ticket.initialQuantity, // Use initialQuantity as quantity
        initialQuantity: ticket.initialQuantity // Keep initialQuantity
      };
    });

    // Calculate totals
    const totalTickets = parsedTicketTypes.reduce((sum, t) => sum + Number(t.initialQuantity), 0);
    const availableTickets = totalTickets;

    // Handle image upload
    let eventImageUrl = "/uploads/default-event.png";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "events_images",
      });
      eventImageUrl = result.secure_url;
    }

    // Create new event
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      category,
      ticketTypes: parsedTicketTypes,
      totalTickets,
      availableTickets,
      image: eventImageUrl,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


//all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('category', 'name')
    res.status(200).json(events)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
//get event by id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('category', 'name')
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.status(200).json(event)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
// update events
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    let { title, description, date, location, category, ticketTypes } = req.body;

    // Parse and validate ticketTypes
       let parsedTicketTypes;
    if (req.body.ticketTypes) {
      parsedTicketTypes = typeof req.body.ticketTypes === 'string' 
        ? JSON.parse(req.body.ticketTypes) 
        : req.body.ticketTypes;

      // Update ticket quantities while maintaining sold tickets
      parsedTicketTypes = parsedTicketTypes.map(newTicket => {
        const existingTicket = event.ticketTypes.find(t => t.type === newTicket.type);
        
        if (existingTicket) {
          // For existing tickets, keep the same quantity if not provided
          return {
            type: newTicket.type,
            price: newTicket.price,
            quantity: newTicket.quantity !== undefined ? newTicket.quantity : existingTicket.quantity,
            initialQuantity: newTicket.initialQuantity !== undefined ? newTicket.initialQuantity : existingTicket.initialQuantity
          };
        }
        
        // For new ticket types
        return {
          type: newTicket.type,
          price: newTicket.price,
          quantity: newTicket.quantity || newTicket.initialQuantity,
          initialQuantity: newTicket.initialQuantity
        };
      });
    }
    // Handle image upload
    if (req.file?.path) {
      // Delete previous Cloudinary image if not default
      if (event.image && !event.image.includes("default-event.png")) {
        const publicId = event.image.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`events_images/${publicId}`);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }

      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "events_images",
        });
        event.image = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ message: 'Image upload failed' });
      }

      // Delete local temp file
      fs.unlink(req.file.path, err => {
        if (err) console.error("Failed to delete local temp file:", err);
      });
    }

    // Update event fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.category = category || event.category;

    // Update ticket types if provided
    if (parsedTicketTypes) {
      event.ticketTypes = parsedTicketTypes;


      // Recalculate totals
      event.totalTickets = parsedTicketTypes.reduce(
        (sum, ticket) => sum + Number(ticket.initialQuantity),
        0
      );
      event.availableTickets = parsedTicketTypes.reduce(
        (sum, ticket) => sum + Number(ticket.quantity),
        0
      );
    }

    await event.save();
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};
// delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await event.deleteOne()
    res.status(200).json({ message: 'Event deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
