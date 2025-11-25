const mongoose = require("mongoose");

const TeamInviteSchema = new mongoose.Schema({
  teamId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Team", 
    required: true 
  },
  managerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  playerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending',
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const TeamInviteModel = mongoose.model("TeamInvite", TeamInviteSchema);

module.exports = TeamInviteModel;
