const dao = require("../model/TeamDao");

// Normalize player input string to array, array as a array
function normalizePlayers(playersInput) {
  if (!playersInput) return [];

  // If user provides a single string convert to array
  return Array.isArray(playersInput)
    ? playersInput
    : [playersInput];
}

// Create Team
exports.createTeam = async (req, res) => {
  try {
    const team = {
      teamName: req.body.teamName,
      manager: req.body.manager || "",
      players: normalizePlayers(req.body.players)
    };

    const saved = await dao.createTeam(team);
    res.status(201).json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating team" });
  }
};

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await dao.getAllTeams();
    res.status(200).json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving teams" });
  }
};

// Get one team
exports.getTeam = async (req, res) => {
  try {
    const team = await dao.readOneTeam(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving team" });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const update = {
      teamName: req.body.teamName,
      manager: req.body.manager || "",
      players: normalizePlayers(req.body.players)
    };

    const updated = await dao.updateTeam(req.params.id, update);
    if (!updated) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating team" });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    await dao.deleteTeam(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting team" });
  }
};
