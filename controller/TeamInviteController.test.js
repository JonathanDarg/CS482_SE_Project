const controller = require('./TeamInviteController');
const TeamInviteDao = require('../model/TeamInviteDao');
const TeamDao = require('../model/TeamDao');
const User = require('../model/User');

jest.mock('../model/TeamInviteDao');
jest.mock('../model/TeamDao');
jest.mock('../model/User');

describe('TeamInviteController', () => {
  let req, res;

  beforeEach(() => {
    req = { 
      body: {}, 
      params: {},
      session: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // sendInvite
  describe('sendInvite', () => {
    it('should send invite successfully when all conditions are met', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      const playerId = '507f1f77bcf86cd799439012';
      const teamId = '507f1f77bcf86cd799439013';
      
      req.session.user = { _id: managerId, role: 'manager' };
      req.body = { playerId };

      const manager = { _id: managerId, teamId, role: 'manager' };
      const team = { _id: teamId, teamName: 'Team A', players: ['p1', 'p2'], manager: managerId };
      const player = { _id: playerId, role: 'child', teamId: null };
      const invite = { _id: '123', teamId, managerId, playerId, status: 'pending' };

      User.findById.mockResolvedValueOnce(manager);
      TeamDao.readOneTeam.mockResolvedValue(team);
      User.findById.mockResolvedValueOnce(player);
      TeamInviteDao.createInvite.mockResolvedValue(invite);

      await controller.sendInvite(req, res);

      expect(User.findById).toHaveBeenCalledWith(managerId);
      expect(TeamDao.readOneTeam).toHaveBeenCalledWith(teamId);
      expect(User.findById).toHaveBeenCalledWith(playerId);
      expect(TeamInviteDao.createInvite).toHaveBeenCalledWith(teamId, managerId, playerId);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invite sent successfully',
        invite
      });
    });

    it('should return 401 when user is not logged in', async () => {
      req.session.user = null;
      req.body = { playerId: '123' };

      await controller.sendInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - Please log in' });
    });

    it('should return 403 when user is not a manager', async () => {
      req.session.user = { _id: '123', role: 'child' };
      req.body = { playerId: '456' };

      await controller.sendInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Only managers can send team invites' });
    });

    it('should return 400 when manager has no team', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      req.session.user = { _id: managerId, role: 'manager' };
      req.body = { playerId: '456' };

      const manager = { _id: managerId, role: 'manager', teamId: null };
      User.findById.mockResolvedValue(manager);

      await controller.sendInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Manager must be assigned to a team' });
    });

    it('should return 404 when team not found', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      const teamId = '507f1f77bcf86cd799439013';
      req.session.user = { _id: managerId, role: 'manager' };
      req.body = { playerId: '456' };

      const manager = { _id: managerId, teamId, role: 'manager' };
      User.findById.mockResolvedValue(manager);
      TeamDao.readOneTeam.mockResolvedValue(null);

      await controller.sendInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Team not found' });
    });

    it('should return 400 when team is full (15 players)', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      const teamId = '507f1f77bcf86cd799439013';
      req.session.user = { _id: managerId, role: 'manager' };
      req.body = { playerId: '456' };

      const manager = { _id: managerId, teamId, role: 'manager' };
      const team = { 
        _id: teamId, 
        teamName: 'Team A', 
        players: Array(15).fill('playerId'),
        manager: managerId 
      };

      User.findById.mockResolvedValue(manager);
      TeamDao.readOneTeam.mockResolvedValue(team);

      await controller.sendInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Team is full (maximum 15 players)' });
    });

    it('should return 404 when player not found', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      const playerId = '507f1f77bcf86cd799439012';
      const teamId = '507f1f77bcf86cd799439013';
      
      req.session.user = { _id: managerId, role: 'manager' };
      req.body = { playerId };

      const manager = { _id: managerId, teamId, role: 'manager' };
      const team = { _id: teamId, teamName: 'Team A', players: [], manager: managerId };

      User.findById.mockResolvedValueOnce(manager);
      TeamDao.readOneTeam.mockResolvedValue(team);
      User.findById.mockResolvedValueOnce(null);

      await controller.sendInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Player not found' });
    });

    it('should return 400 when player is not a child', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      const playerId = '507f1f77bcf86cd799439012';
      const teamId = '507f1f77bcf86cd799439013';
      
      req.session.user = { _id: managerId, role: 'manager' };
      req.body = { playerId };

      const manager = { _id: managerId, teamId, role: 'manager' };
      const team = { _id: teamId, teamName: 'Team A', players: [], manager: managerId };
      const player = { _id: playerId, role: 'parent', teamId: null };

      User.findById.mockResolvedValueOnce(manager);
      TeamDao.readOneTeam.mockResolvedValue(team);
      User.findById.mockResolvedValueOnce(player);

      await controller.sendInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Can only invite players with 'child' role" });
    });

    it('should return 400 when player is already on a team', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      const playerId = '507f1f77bcf86cd799439012';
      const teamId = '507f1f77bcf86cd799439013';
      
      req.session.user = { _id: managerId, role: 'manager' };
      req.body = { playerId };

      const manager = { _id: managerId, teamId, role: 'manager' };
      const team = { _id: teamId, teamName: 'Team A', players: [], manager: managerId };
      const player = { _id: playerId, role: 'child', teamId: 'otherTeamId' };

      User.findById.mockResolvedValueOnce(manager);
      TeamDao.readOneTeam.mockResolvedValue(team);
      User.findById.mockResolvedValueOnce(player);

      await controller.sendInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Player is already on a team' });
    });

    it('should handle database errors', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      req.session.user = { _id: managerId, role: 'manager' };
      req.body = { playerId: '456' };

      const dbError = new Error('DB connection failed');
      User.findById.mockRejectedValue(dbError);

      await controller.sendInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB connection failed' });
    });

    it('should handle error from createInvite (duplicate invite)', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      const playerId = '507f1f77bcf86cd799439012';
      const teamId = '507f1f77bcf86cd799439013';
      
      req.session.user = { _id: managerId, role: 'manager' };
      req.body = { playerId };

      const manager = { _id: managerId, teamId, role: 'manager' };
      const team = { _id: teamId, teamName: 'Team A', players: [], manager: managerId };
      const player = { _id: playerId, role: 'child', teamId: null };

      User.findById.mockResolvedValueOnce(manager);
      TeamDao.readOneTeam.mockResolvedValue(team);
      User.findById.mockResolvedValueOnce(player);
      TeamInviteDao.createInvite.mockRejectedValue(new Error('An invite for this player already exists'));

      await controller.sendInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'An invite for this player already exists' });
    });
  });

  // getPlayerInvites
  describe('getPlayerInvites', () => {
    it('should return invites for logged-in player', async () => {
      const playerId = '507f1f77bcf86cd799439011';
      req.session.user = { _id: playerId, role: 'child' };

      const invites = [
        { _id: '1', playerId, status: 'pending', teamId: { teamName: 'Team A' } },
        { _id: '2', playerId, status: 'pending', teamId: { teamName: 'Team B' } }
      ];

      TeamInviteDao.getInvitesByPlayer.mockResolvedValue(invites);

      await controller.getPlayerInvites(req, res);

      expect(TeamInviteDao.getInvitesByPlayer).toHaveBeenCalledWith(playerId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ invites });
    });

    it('should return 401 when user is not logged in', async () => {
      req.session.user = null;

      await controller.getPlayerInvites(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - Please log in' });
    });

    it('should return empty array when no invites exist', async () => {
      const playerId = '507f1f77bcf86cd799439011';
      req.session.user = { _id: playerId, role: 'child' };

      TeamInviteDao.getInvitesByPlayer.mockResolvedValue([]);

      await controller.getPlayerInvites(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ invites: [] });
    });

    it('should handle database errors', async () => {
      const playerId = '507f1f77bcf86cd799439011';
      req.session.user = { _id: playerId, role: 'child' };

      TeamInviteDao.getInvitesByPlayer.mockRejectedValue(new Error('DB error'));

      await controller.getPlayerInvites(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch invites' });
    });
  });

  // getTeamInvites
  describe('getTeamInvites', () => {
    it('should return invites for manager\'s team', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      const teamId = '507f1f77bcf86cd799439013';
      req.session.user = { _id: managerId, role: 'manager' };
      req.params.teamId = teamId;

      const manager = { _id: managerId, teamId, role: 'manager' };
      const invites = [
        { _id: '1', teamId, status: 'pending', playerId: { name: 'Player1' } },
        { _id: '2', teamId, status: 'accepted', playerId: { name: 'Player2' } }
      ];

      User.findById.mockResolvedValue(manager);
      TeamInviteDao.getInvitesByTeam.mockResolvedValue(invites);

      await controller.getTeamInvites(req, res);

      expect(User.findById).toHaveBeenCalledWith(managerId);
      expect(TeamInviteDao.getInvitesByTeam).toHaveBeenCalledWith(teamId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ invites });
    });

    it('should return 401 when user is not logged in', async () => {
      req.session.user = null;
      req.params.teamId = '123';

      await controller.getTeamInvites(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - Please log in' });
    });

    it('should return 403 when user is not a manager', async () => {
      req.session.user = { _id: '123', role: 'child' };
      req.params.teamId = '456';

      await controller.getTeamInvites(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Only managers can view team invites' });
    });

    it('should return 403 when manager has no team', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      req.session.user = { _id: managerId, role: 'manager' };
      req.params.teamId = '456';

      const manager = { _id: managerId, teamId: null, role: 'manager' };
      User.findById.mockResolvedValue(manager);

      await controller.getTeamInvites(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'You can only view invites for your own team' });
    });

    it('should return 403 when manager tries to view another team\'s invites', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      const teamId = '507f1f77bcf86cd799439013';
      const otherTeamId = '507f1f77bcf86cd799439099';
      
      req.session.user = { _id: managerId, role: 'manager' };
      req.params.teamId = otherTeamId;

      const manager = { _id: managerId, teamId, role: 'manager' };
      User.findById.mockResolvedValue(manager);

      await controller.getTeamInvites(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'You can only view invites for your own team' });
    });

    it('should handle database errors', async () => {
      const managerId = '507f1f77bcf86cd799439011';
      const teamId = '507f1f77bcf86cd799439013';
      req.session.user = { _id: managerId, role: 'manager' };
      req.params.teamId = teamId;

      User.findById.mockRejectedValue(new Error('DB error'));

      await controller.getTeamInvites(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch team invites' });
    });
  });

  // respondToInvite
  describe('respondToInvite', () => {
    it('should accept invite successfully as player', async () => {
      const playerId = '507f1f77bcf86cd799439011';
      const inviteId = '507f1f77bcf86cd799439020';
      const teamId = '507f1f77bcf86cd799439013';
      
      req.session.user = { _id: playerId, role: 'child' };
      req.params.inviteId = inviteId;
      req.body.response = 'accept';

      const invite = {
        _id: inviteId,
        status: 'pending',
        playerId: { _id: playerId },
        teamId: { _id: teamId, teamName: 'Team A', players: ['p1', 'p2'] },
        managerId: { _id: 'manager1' }
      };
      const player = { _id: playerId, role: 'child', parentId: null };

      TeamInviteDao.getInviteById.mockResolvedValue(invite);
      User.findById.mockResolvedValue(player);
      TeamDao.updateTeam.mockResolvedValue({});
      User.findByIdAndUpdate.mockResolvedValue({});
      TeamInviteDao.updateInviteStatus.mockResolvedValue({});
      TeamInviteDao.cancelPlayerInvites.mockResolvedValue({});

      await controller.respondToInvite(req, res);

      expect(TeamDao.updateTeam).toHaveBeenCalledWith(teamId, { $push: { players: playerId } });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(playerId, { teamId });
      expect(TeamInviteDao.updateInviteStatus).toHaveBeenCalledWith(inviteId, 'accepted');
      expect(TeamInviteDao.cancelPlayerInvites).toHaveBeenCalledWith(playerId, inviteId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invite accepted successfully',
        teamName: 'Team A'
      });
    });

    it('should accept invite successfully as parent', async () => {
      const parentId = '507f1f77bcf86cd799439099';
      const playerId = '507f1f77bcf86cd799439011';
      const inviteId = '507f1f77bcf86cd799439020';
      const teamId = '507f1f77bcf86cd799439013';
      
      req.session.user = { _id: parentId, role: 'parent' };
      req.params.inviteId = inviteId;
      req.body.response = 'accept';

      const invite = {
        _id: inviteId,
        status: 'pending',
        playerId: { _id: playerId },
        teamId: { _id: teamId, teamName: 'Team A', players: [] },
        managerId: { _id: 'manager1' }
      };
      const player = { _id: playerId, role: 'child', parentId };

      TeamInviteDao.getInviteById.mockResolvedValue(invite);
      User.findById.mockResolvedValue(player);
      TeamDao.updateTeam.mockResolvedValue({});
      User.findByIdAndUpdate.mockResolvedValue({});
      TeamInviteDao.updateInviteStatus.mockResolvedValue({});
      TeamInviteDao.cancelPlayerInvites.mockResolvedValue({});

      await controller.respondToInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invite accepted successfully',
        teamName: 'Team A'
      });
    });

    it('should reject invite successfully', async () => {
      const playerId = '507f1f77bcf86cd799439011';
      const inviteId = '507f1f77bcf86cd799439020';
      
      req.session.user = { _id: playerId, role: 'child' };
      req.params.inviteId = inviteId;
      req.body.response = 'reject';

      const invite = {
        _id: inviteId,
        status: 'pending',
        playerId: { _id: playerId },
        teamId: { _id: 'teamId', teamName: 'Team A', players: [] },
        managerId: { _id: 'manager1' }
      };
      const player = { _id: playerId, role: 'child', parentId: null };

      TeamInviteDao.getInviteById.mockResolvedValue(invite);
      User.findById.mockResolvedValue(player);
      TeamInviteDao.updateInviteStatus.mockResolvedValue({});

      await controller.respondToInvite(req, res);

      expect(TeamInviteDao.updateInviteStatus).toHaveBeenCalledWith(inviteId, 'rejected');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invite rejected' });
    });

    it('should return 401 when user is not logged in', async () => {
      req.session.user = null;
      req.params.inviteId = '123';
      req.body.response = 'accept';

      await controller.respondToInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - Please log in' });
    });

    it('should return 400 when response is invalid', async () => {
      req.session.user = { _id: '123', role: 'child' };
      req.params.inviteId = '456';
      req.body.response = 'invalid';

      await controller.respondToInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Response must be 'accept' or 'reject'" });
    });

    it('should return 404 when invite not found', async () => {
      req.session.user = { _id: '123', role: 'child' };
      req.params.inviteId = '456';
      req.body.response = 'accept';

      TeamInviteDao.getInviteById.mockResolvedValue(null);

      await controller.respondToInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invite not found' });
    });

    it('should return 400 when invite already responded to', async () => {
      const playerId = '507f1f77bcf86cd799439011';
      const inviteId = '507f1f77bcf86cd799439020';
      
      req.session.user = { _id: playerId, role: 'child' };
      req.params.inviteId = inviteId;
      req.body.response = 'accept';

      const invite = {
        _id: inviteId,
        status: 'accepted',
        playerId: { _id: playerId },
        teamId: { _id: 'teamId', teamName: 'Team A' }
      };

      TeamInviteDao.getInviteById.mockResolvedValue(invite);

      await controller.respondToInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'This invite has already been responded to' });
    });

    it('should return 403 when user has no permission to respond', async () => {
      const wrongUserId = '507f1f77bcf86cd799439099';
      const playerId = '507f1f77bcf86cd799439011';
      const inviteId = '507f1f77bcf86cd799439020';
      
      req.session.user = { _id: wrongUserId, role: 'child' };
      req.params.inviteId = inviteId;
      req.body.response = 'accept';

      const invite = {
        _id: inviteId,
        status: 'pending',
        playerId: { _id: playerId },
        teamId: { _id: 'teamId', teamName: 'Team A' }
      };
      const player = { _id: playerId, role: 'child', parentId: 'someOtherParent' };

      TeamInviteDao.getInviteById.mockResolvedValue(invite);
      User.findById.mockResolvedValue(player);

      await controller.respondToInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "You don't have permission to respond to this invite" });
    });

    it('should return 400 when team is full on accept', async () => {
      const playerId = '507f1f77bcf86cd799439011';
      const inviteId = '507f1f77bcf86cd799439020';
      
      req.session.user = { _id: playerId, role: 'child' };
      req.params.inviteId = inviteId;
      req.body.response = 'accept';

      const invite = {
        _id: inviteId,
        status: 'pending',
        playerId: { _id: playerId },
        teamId: { _id: 'teamId', teamName: 'Team A', players: Array(15).fill('playerId') },
        managerId: { _id: 'manager1' }
      };
      const player = { _id: playerId, role: 'child', parentId: null };

      TeamInviteDao.getInviteById.mockResolvedValue(invite);
      User.findById.mockResolvedValue(player);

      await controller.respondToInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Team is now full' });
    });

    it('should handle database errors', async () => {
      const playerId = '507f1f77bcf86cd799439011';
      req.session.user = { _id: playerId, role: 'child' };
      req.params.inviteId = '456';
      req.body.response = 'accept';

      TeamInviteDao.getInviteById.mockRejectedValue(new Error('DB error'));

      await controller.respondToInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });
});
