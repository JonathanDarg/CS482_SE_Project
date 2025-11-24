const dao = require('../model/TeamStatsDao');

// Create a new Team Stats
exports.createStats = async (req, res) => {
  try {
    const newStats = {
      teamName: req.body.teamName,
      gamesPlayed: req.body.gamesPlayed || 0,
      totalWins: req.body.totalWins || 0,
      totalLosses: req.body.totalLosses || 0,
      pointsScored: req.body.pointsScored || 0,
    };

    const savedStats = await dao.createStats(newStats);
    res.status(201).json(savedStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating Team Stats' });
  }
};

// Get all Team Stats
exports.getAllStats = async (req, res) => {
  try {
    const stats = await dao.getAllStats();
    res.status(200).json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving Team Stats' });
  }
};

// Get one Team Stats by ID
exports.getStats = async (req, res) => {
  try {
    const stats = await dao.readOneStats(req.params.id);
    if (!stats) return res.status(404).json({ message: 'Team Stats not found' });
    res.status(200).json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving Team Stats' });
  }
};

// Update Team Stats
exports.updateStats = async (req, res) => {
  try {
    const updatedStats = await dao.updateStats(req.params.id, req.body);
    if (!updatedStats) return res.status(404).json({ message: 'Team Stats not found' });
    res.status(200).json(updatedStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating Team Stats' });
  }
};

// Delete Team Stats
exports.deleteStats = async (req, res) => {
  try {
    await dao.deleteStats(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting Team Stats' });
  }
};

// Delete all Team Stats
exports.deleteAllStats = async (req, res) => {
  try {
    await dao.deleteAllStats();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting all Team Stats' });
  }
};
