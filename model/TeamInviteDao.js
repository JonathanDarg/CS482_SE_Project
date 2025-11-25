const TeamInviteModel = require("./TeamInvite");
const TeamModel = require("./TeamDao");

module.exports = {
  // Create a new team invite
  createInvite: async (teamId, managerId, playerId) => {
    // Check if there's already a pending invite for this player to this team
    const existingInvite = await TeamInviteModel.findOne({
      teamId,
      playerId,
      status: 'pending'
    });

    if (existingInvite) {
      throw new Error("An invite for this player already exists");
    }

    const invite = new TeamInviteModel({
      teamId,
      managerId,
      playerId,
      status: 'pending'
    });

    return await invite.save();
  },

  // Get all invites for a specific player
  getInvitesByPlayer: async (playerId) => {
    return await TeamInviteModel.find({ playerId, status: 'pending' })
      .populate('teamId', 'teamName')
      .populate('managerId', 'name email')
      .sort({ createdAt: -1 });
  },

  // Get all invites for a specific team
  getInvitesByTeam: async (teamId) => {
    return await TeamInviteModel.find({ teamId })
      .populate('playerId', 'name email role')
      .populate('managerId', 'name email')
      .sort({ createdAt: -1 });
  },

  // Get a single invite by ID
  getInviteById: async (inviteId) => {
    return await TeamInviteModel.findById(inviteId)
      .populate('teamId', 'teamName players')
      .populate('managerId', 'name email')
      .populate('playerId', 'name email');
  },

  // Update invite status (accept/reject)
  updateInviteStatus: async (inviteId, status) => {
    return await TeamInviteModel.findByIdAndUpdate(
      inviteId,
      { status },
      { new: true }
    ).populate('teamId', 'teamName')
     .populate('managerId', 'name email')
     .populate('playerId', 'name email');
  },

  // Check team player count
  getTeamPlayerCount: async (teamId) => {
    const team = await TeamModel.readOneTeam(teamId);
    return team ? team.players.length : 0;
  },

  // Delete invite
  deleteInvite: async (inviteId) => {
    return await TeamInviteModel.findByIdAndDelete(inviteId);
  },

  // Cancel all pending invites for a player (used when accepting one invite)
  cancelPlayerInvites: async (playerId, excludeInviteId = null) => {
    const query = { 
      playerId, 
      status: 'pending'
    };
    
    if (excludeInviteId) {
      query._id = { $ne: excludeInviteId };
    }

    return await TeamInviteModel.updateMany(
      query,
      { status: 'rejected' }
    );
  }
};
