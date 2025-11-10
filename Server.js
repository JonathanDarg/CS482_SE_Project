const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./model/DbConnection");
db.connect(); // Connect to MongoDB

const eventController = require("./controller/EventController");
const imageController = require("./controller/ImageController");
const teamController = require("./controller/teamController");


const app = express();
app.use(cors());
app.use(express.json());

// Event routes
app.get("/api/events", eventController.getAllEvents);
app.get("/api/events/:id", eventController.getEvent);
app.get("/api/events/month/:month/:year", eventController.getByMonth);
app.post("/api/events", eventController.createEvent);
app.put("/api/events/:id", eventController.updateEvent);
app.delete("/api/events/:id", eventController.deleteEvent);

// Image routes
app.post("/api/images/upload", imageController.uploadImage);
app.get("/api/images", imageController.getImages);
app.get("/api/images/:id", imageController.getImageById);
app.delete("/api/images/:id", imageController.deleteImage);

// Team routes
app.get("/api/teams", teamController.getAllTeams);
app.get("/api/teams/:id", teamController.getTeam);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
