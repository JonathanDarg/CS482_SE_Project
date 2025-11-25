const TeamInviteDao = require("../model/TeamInviteDao");
const TeamDao = require("../model/TeamDao");
const User = require("../model/User");

const MAX_TEAM_SIZE = 15;

module.exports = {
  // Send an invite to a player (Manager only)
  sendInvite: async (req, res) => {
    try {
      // Check if user is logged in
      if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized - Please log in" });
      }

      const { playerId } = req.body;
      const managerId = req.session.user._id;

      // Verify the sender is a manager
      if (req.session.user.role !== 'manager') {
        return res.status(403).json({ message: "Only managers can send team invites" });
      }

      // Get manager's team
      const manager = await User.findById(managerId);
      if (!manager || !manager.teamId) {
        return res.status(400).json({ message: "Manager must be assigned to a team" });
      }

      const teamId = manager.teamId;

      // Check team player count
      const team = await TeamDao.readOneTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      if (team.players.length >= MAX_TEAM_SIZE) {
        return res.status(400).json({ message: `Team is full (maximum ${MAX_TEAM_SIZE} players)` });
      }

      // Verify the player exists and is a child
      const player = await User.findById(playerId);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }

      if (player.role !== 'child') {
        return res.status(400).json({ message: "Can only invite players with 'child' role" });
      }

      // Check if player is already on a team
      if (player.teamId) {
        return res.status(400).json({ message: "Player is already on a team" });
      }

      // Create the invite
      const invite = await TeamInviteDao.createInvite(teamId, managerId, playerId);

      res.status(201).json({ 
        message: "Invite sent successfully", 
        invite 
      });
    } catch (err) {
      console.error("Error sending invite:", err);
      res.status(500).json({ message: err.message || "Failed to send invite" });
    }
  },

  // Get invites for the logged-in player
  getPlayerInvites: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized - Please log in" });
      }

      const playerId = req.session.user._id;
      const invites = await TeamInviteDao.getInvitesByPlayer(playerId);

      res.status(200).json({ invites });
    } catch (err) {
      console.error("Error fetching player invites:", err);
      res.status(500).json({ message: "Failed to fetch invites" });
    }
  },

  // Get invites for a team (Manager only)
  getTeamInvites: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized - Please log in" });
      }

      const { teamId } = req.params;

      // Verify the user is a manager of this team
      if (req.session.user.role !== 'manager') {
        return res.status(403).json({ message: "Only managers can view team invites" });
      }

      const manager = await User.findById(req.session.user._id);
      if (!manager || !manager.teamId || manager.teamId.toString() !== teamId) {
        return res.status(403).json({ message: "You can only view invites for your own team" });
      }

      const invites = await TeamInviteDao.getInvitesByTeam(teamId);

      res.status(200).json({ invites });
    } catch (err) {
      console.error("Error fetching team invites:", err);
      res.status(500).json({ message: "Failed to fetch team invites" });
    }
  },

  // Respond to an invite (accept/reject) - Player or Parent
  respondToInvite: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized - Please log in" });
      }

      const { inviteId } = req.params;
      const { response } = req.body; // 'accept' or 'reject'

      if (!['accept', 'reject'].includes(response)) {
        return res.status(400).json({ message: "Response must be 'accept' or 'reject'" });
      }

      // Get the invite
      const invite = await TeamInviteDao.getInviteById(inviteId);
      if (!invite) {
        return res.status(404).json({ message: "Invite not found" });
      }

      if (invite.status !== 'pending') {
        return res.status(400).json({ message: "This invite has already been responded to" });
      }

      // Verify the user is the player or their parent
      const userId = req.session.user._id;
      const playerId = invite.playerId._id.toString();
      const player = await User.findById(playerId);

      const isPlayer = userId === playerId;
      const isParent = req.session.user.role === 'parent' && 
                       player.parentId && 
                       player.parentId.toString() === userId;

      if (!isPlayer && !isParent) {
        return res.status(403).json({ message: "You don't have permission to respond to this invite" });
      }

      if (response === 'accept') {
        // Check if team is still not full
        const teamPlayerCount = invite.teamId.players.length;
        if (teamPlayerCount >= MAX_TEAM_SIZE) {
          return res.status(400).json({ message: "Team is now full" });
        }

        // Add player to team
        await TeamDao.updateTeam(invite.teamId._id, {
          $push: { players: playerId }
        });

        // Update player's teamId
        await User.findByIdAndUpdate(playerId, { teamId: invite.teamId._id });

        // Update invite status to accepted
        await TeamInviteDao.updateInviteStatus(inviteId, 'accepted');

        // Reject all other pending invites for this player
        await TeamInviteDao.cancelPlayerInvites(playerId, inviteId);

        res.status(200).json({ 
          message: "Invite accepted successfully", 
          teamName: invite.teamId.teamName 
        });
      } else {
        // Reject the invite
        await TeamInviteDao.updateInviteStatus(inviteId, 'rejected');

        res.status(200).json({ message: "Invite rejected" });
      }
    } catch (err) {
      console.error("Error responding to invite:", err);
      res.status(500).json({ message: err.message || "Failed to respond to invite" });
    }
  }
};
