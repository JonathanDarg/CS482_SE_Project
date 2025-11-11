const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // unique team signup code
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Team", teamSchema);
