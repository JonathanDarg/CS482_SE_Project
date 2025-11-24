const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const TeamModel = mongoose.model("Team", TeamSchema);

module.exports = {
  createTeam: async (data) => {
    const team = new TeamModel(data);
    // Always call instance save
    return await team.save();
  },

  getAllTeams: async () => {
    return await TeamModel.find()
      .populate("manager", "name email")
      .populate("players", "name email");
  },

  readOneTeam: async (id) => {
    return await TeamModel.findById(id)
      .populate("manager", "name email")
      .populate("players", "name email");
  },

  updateTeam: async (id, data) => {
    return await TeamModel.findByIdAndUpdate(id, data, { new: true })
      .populate("manager", "name email")
      .populate("players", "name email");
  },

  deleteTeam: async (id) => {
    return await TeamModel.findByIdAndDelete(id);
  },

  deleteAll: async () => {
    return await TeamModel.deleteMany();
  }
};
