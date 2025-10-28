const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./model/DbConnection'); 
db.connect(); // Connect to MongoDB

const eventController = require('./controller/EventController'); 

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/events', eventController.getAllEvents);
app.get('/api/events/:id', eventController.getEvent);
app.get('/api/events/month/:month/:year', eventController.getByMonth);
app.post('/api/events', eventController.createEvent);
app.put('/api/events/:id', eventController.updateEvent);
app.delete('/api/events/:id', eventController.deleteEvent);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
