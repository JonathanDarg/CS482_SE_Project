const dao = require('../model/TeamDao');     

// Create a new Team 
exports.createTeam = async function(req, res) {
  try {
    let newTeam = {};
    newTeam.teamName = req.body.teamName;
    newTeam.wins = req.body.wins;
    newTeam.losses = req.body.losses;

    const savedTeam = await dao.createTeam(newTeam);
    res.status(201).json(savedTeam); // Return the saved Team as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating Team" });
  }
};


// Get all Teams 
exports.getAllTeams = async function(req, res) {
  try {
    const Teams = await dao.getAllTeams();
    res.status(200).json(Teams); // Send list to FullCalendar
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Teams" });
  }
};

// Get one Team by ID 
exports.getTeam = async function(req, res) {
  try {
    const Team = await dao.readOneTeam(req.params.id);
    if (!Team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.status(200).json(Team);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Team" });
  }
};

// Update Team 
exports.updateTeam = async function(req, res) {
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

// Delete one Team 
exports.deleteTeam = async function(req, res) {
  try {
    await dao.deleteTeam(req.params.id);
    res.status(204).end(); // no content
  } catch (err) {
    res.status(500).json({ message: "Error deleting Team" });
  }
};