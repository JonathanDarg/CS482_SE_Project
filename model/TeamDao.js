const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    teamLogo: { type: String, default: "" },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const TeamModel = mongoose.model("Team", TeamSchema);

module.exports = {
    createTeam: async (data) => {
        const team = new TeamModel(data);
        return await team.save();
    },

    getAllTeams: async () => {
        return await TeamModel.find().populate("players");
    },

    readOneTeam: async (id) => {
        return await TeamModel.findById(id).populate("players");
    },

    updateTeam: async (id, data) => {
        return await TeamModel.findByIdAndUpdate(id, data, { new: true });
    },

    deleteTeam: async (id) => {
        await TeamModel.findByIdAndDelete(id);
    },

    deleteAll: async () => {
        await TeamModel.deleteMany();
    }
};
