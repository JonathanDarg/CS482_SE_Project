const dao = require('../model/EventDao');

// Create a new Event
exports.createEvent = async function (req, res) {
  try {
    let newEvent = {
      location: req.body.location,
      field: req.body.field,
      dateTime: req.body.dateTime,

      homeTeam: req.body.homeTeam,
      awayTeam: req.body.awayTeam,

      homeScore: req.body.homeScore ?? 0,
      awayScore: req.body.awayScore ?? 0,
      status: req.body.status ?? "upcoming",

      rating: req.body.rating,
      typeOfMatch: req.body.typeOfMatch,
      inning: req.body.inning,
      season: req.body.season
    };

    const savedEvent = await dao.createEvent(newEvent);
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating Event" });
  }
};

// Get all Events
exports.getAllEvents = async function (req, res) {
  try {
    const events = await dao.getAllEvents();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Events" });
  }
};

// Get one Event by ID
exports.getEvent = async function (req, res) {
  try {
    const event = await dao.readOneEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Event" });
  }
};

// Update Event
exports.updateEvent = async function (req, res) {
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

// Delete Event
exports.deleteEvent = async function (req, res) {
  try {
    await dao.deleteEvent(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Error deleting Event" });
  }
};

// Get Events by month
exports.getByMonth = async function (req, res) {
  try {
    const { month, year } = req.params;
    const events = await dao.getByMonth(month, year);
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Events by month" });
  }
};
