const dao = require("../model/TeamDao");
const User = require("../model/User");

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
      manager: req.body.manager || null,
      players: normalizePlayers(req.body.players)
    };

    const saved = await dao.createTeam(team);
    
    // Update manager's teamId if a manager is assigned
    if (team.manager) {
      await User.findByIdAndUpdate(team.manager, { teamId: saved._id });
    }
    
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
      manager: req.body.manager || null,
      players: normalizePlayers(req.body.players)
    };

    const updated = await dao.updateTeam(req.params.id, update);
    if (!updated) return res.status(404).json({ message: "Team not found" });
    
    // Update manager's teamId if a manager is assigned
    if (update.manager) {
      await User.findByIdAndUpdate(update.manager, { teamId: req.params.id });
    }
    
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

// Get all managers (users with role 'manager')
exports.getManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' })
      .select('name email isActive createdAt')
      .sort({ name: 1 });
    
    res.status(200).json(managers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving managers" });
  }
};

// Get all children (users with role 'child')
exports.getChildren = async (req, res) => {
  try {
    const children = await User.find({ role: 'child' })
      .populate('parentId', 'name email')
      .select('name email parentId isActive createdAt')
      .sort({ name: 1 });
    
    res.status(200).json(children);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving children" });
  }
};

// Get children by parent ID
exports.getChildrenByParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    
    const children = await User.find({ 
      role: 'child', 
      parentId: parentId 
    })
      .select('name email isActive createdAt')
      .sort({ name: 1 });
    
    res.status(200).json(children);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving children for parent" });
  }
};