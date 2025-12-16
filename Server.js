const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const db = require("./model/DbConnection");
db.connect(); // Connect to MongoDB

// Controllers
const authController = require("./controller/AuthController");
const eventController = require("./controller/EventController");
const imageController = require("./controller/ImageController");
const teamController = require("./controller/TeamController");
const teamInviteController = require("./controller/TeamInviteController");
const teamStatsController = require("./controller/TeamStatsController");

// Models
const User = require("./model/User");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Session middleware 
app.use(
  session({
    secret: process.env.SESSION_SECRET || "baseball-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true only if HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// Auth routes
app.post("/api/auth/signup", authController.signup);
app.post("/api/auth/login", authController.login);
app.post("/api/auth/logout", authController.logout);
app.get("/api/auth/session", authController.checkSession);
app.get("/api/auth/children", authController.getChildren);
app.get("/api/users", authController.getAllUsers);
app.put("/api/users/role", authController.updateUserRole);
app.delete("/api/users/:userId", authController.deleteUser);

// Debug route 
app.get("/debug/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
app.get("/api/teams/managers", teamController.getManagers);          
app.get("/api/teams/children", teamController.getChildren);
app.get("/api/teams/children/:parentId", teamController.getChildrenByParent);
app.get("/api/teams", teamController.getAllTeams);
app.get("/api/teams/:id", teamController.getTeam);
app.post("/api/teams", teamController.createTeam);
app.put("/api/teams/:id", teamController.updateTeam);
app.delete("/api/teams/:id", teamController.deleteTeam);

// Team Invite routes
app.post("/api/invites/send", teamInviteController.sendInvite);
app.get("/api/invites/player", teamInviteController.getPlayerInvites);
app.get("/api/invites/team/:teamId", teamInviteController.getTeamInvites);
app.put("/api/invites/:inviteId/respond", teamInviteController.respondToInvite);

// Team Stats routes
app.get("/api/stats", teamStatsController.getAllStats);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
