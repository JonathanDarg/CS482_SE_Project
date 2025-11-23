const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  manager: { type: String, default: "" },
  players: [{ type: String }]
});

const TeamModel = mongoose.model("Team", TeamSchema);

module.exports = {
  createTeam: async (data) => {
    const team = new TeamModel(data);
    return await team.save();
  },

  getAllTeams: async () => {
    return await TeamModel.find();
  },

  readOneTeam: async (id) => {
    return await TeamModel.findById(id);
  },

  updateTeam: async (id, data) => {
    return await TeamModel.findByIdAndUpdate(id, data, { new: true });
  },

  deleteTeam: async (id) => {
    return await TeamModel.findByIdAndDelete(id);
  },

  deleteAll: async () => {
    return await TeamModel.deleteMany();
  }
};