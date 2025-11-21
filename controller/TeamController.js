// controllers/TeamController.js
const dao = require('../model/TeamDao');

// Create a new Team
exports.createTeam = async function (req, res) {
  try {
    let newTeam = {
      teamName: req.body.teamName,
      wins: req.body.wins,
      losses: req.body.losses,
      logo: req.body.logo || ""   // (file upload supported later)
    };

    const savedTeam = await dao.createTeam(newTeam);
    res.status(201).json(savedTeam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating Team" });
  }
};

// Get all Teams
exports.getAllTeams = async function (req, res) {
  try {
    const teams = await dao.getAllTeams();
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Teams" });
  }
};

// Get one Team by ID
exports.getTeam = async function (req, res) {
  try {
    const team = await dao.readOneTeam(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Team" });
  }
};

// Update Team
exports.updateTeam = async function (req, res) {
  try {
    const updatedTeam = await dao.updateTeam(req.params.id, req.body);

    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.status(200).json(updatedTeam);
  } catch (err) {
    res.status(500).json({ message: "Error updating Team" });
  }
};

// Delete Team
exports.deleteTeam = async function (req, res) {
  try {
    await dao.deleteTeam(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Error deleting Team" });
  }
};