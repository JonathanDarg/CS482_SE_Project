const mongoose = require('mongoose');

const TeamStatsSchema = new mongoose.Schema({
  teamName: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  gamesPlayed: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  totalLosses: { type: Number, default: 0 },
  pointsScored: { type: Number, default: 0 },
});

const TeamStatsModel = mongoose.model('TeamStats', TeamStatsSchema);

module.exports = {
  createStats: async (data) => {
    const stats = new TeamStatsModel(data);
    return await stats.save();
  },

  getAllStats: async () => {
    return await TeamStatsModel.find().populate('teamName');
  },

  readOneStats: async (id) => {
    return await TeamStatsModel.findById(id).populate('teamName');
  },

  updateStats: async (id, data) => {
    return await TeamStatsModel.findByIdAndUpdate(id, data, { new: true });
  },

  deleteStats: async (id) => {
    await TeamStatsModel.findByIdAndDelete(id);
  },

  deleteAllStats: async () => {
    await TeamStatsModel.deleteMany();
  },
};
