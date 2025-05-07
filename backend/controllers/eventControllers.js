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

    // Parse ticketTypes if it's passed as a string (it should be an array)
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
    // Calculate availableTickets from the ticketTypes array
    const availableTickets = parsedTicketTypes.reduce((sum, t) => sum + Number(t.quantity), 0);

    // Handle image upload (optional)
    let eventImageUrl = "/uploads/default-event.png";  // Default image if none is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "events_images",
      });
      eventImageUrl = result.secure_url;
    }

    // Create a new event with the uploaded image or default image URL
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      category,
      ticketTypes: parsedTicketTypes,  // Use parsed ticketTypes
      availableTickets,  // Added availableTickets calculation
      image: eventImageUrl,  // Use the event image URL (either default or uploaded)
    });

    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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

    const { title, description, date, location, category, ticketTypes } = req.body;

    // Handle image upload to Cloudinary
    if (req.file) {
      // Delete previous Cloudinary image if it exists and is not the default one
      if (event.image && !event.image.includes("default-event.png")) {
        const publicId = event.image.split("/").pop().split(".")[0]; // extract Cloudinary public ID
        try {
          await cloudinary.uploader.destroy(`events_images/${publicId}`);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "events_images",
      });
      event.image = result.secure_url;

      // Optional: delete local uploaded file after upload
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete local temp file:", err);
      });
    }

    // Update other fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.category = category || event.category;

    // Handle ticketTypes
    if (ticketTypes) {
      try {
        const parsedTicketTypes = typeof ticketTypes === 'string' 
          ? JSON.parse(ticketTypes) 
          : ticketTypes;
        event.ticketTypes = parsedTicketTypes;
      } catch (err) {
        console.error('Error parsing ticketTypes:', err);
        return res.status(400).json({ message: 'Invalid ticketTypes format' });
      }
    }

    await event.save();
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
