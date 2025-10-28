const dao = require('../model/EventDao');     

// Create a new Event 
exports.createEvent = async function(req, res) {
  try {
    let newEvent = {};
    newEvent.location = req.body.location;
    newEvent.dateTime = req.body.dateTime;
    newEvent.rating = req.body.rating;
    newEvent.typeOfMatch = req.body.typeOfMatch;

    const savedEvent = await dao.createEvent(newEvent);
    res.status(201).json(savedEvent); // Return the saved Event as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating Event" });
  }
};


// Get all Events 
exports.getAllEvents = async function(req, res) {
  try {
    const Events = await dao.getAllEvents();
    res.status(200).json(Events); // Send list to FullCalendar
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Events" });
  }
};

// Get one Event by ID 
exports.getEvent = async function(req, res) {
  try {
    const Event = await dao.readOneEvent(req.params.id);
    if (!Event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(Event);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Event" });
  }
};

// Update Event 
exports.updateEvent = async function(req, res) {
  try {
    const updatedEvent = await dao.updateEvent(req.params.id, req.body);
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: "Error updating Event" });
  }
};

// Delete one Event 
exports.deleteEvent = async function(req, res) {
  try {
    await dao.deleteEvent(req.params.id);
    res.status(204).end(); // no content
  } catch (err) {
    res.status(500).json({ message: "Error deleting Event" });
  }
};

// Get Events by month 
exports.getByMonth = async function(req, res) {
  try {
    const { month, year } = req.params;
    const Events = await dao.getByMonth(month, year);
    res.status(200).json(Events);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Events by month" });
  }
};
