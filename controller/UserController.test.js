const userController = require('./UserController');
const User = require('../model/User');
const TeamDao = require('../model/TeamDao');

jest.mock('../model/User');
jest.mock('../model/TeamDao');

describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      session: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // getMe
  describe('getMe', () => {
    it('should return current user profile with team info', async () => {
      req.session.user = { id: 'user123', role: 'parent' };

      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@test.com',
        role: 'parent',
        teamId: 'team123',
        children: []
      };

      const mockTeam = {
        _id: 'team123',
        teamName: 'Test Team'
      };

      const populateChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUser)
      };
      User.findById.mockReturnValue(populateChain);
      TeamDao.readOneTeam.mockResolvedValue(mockTeam);

      await userController.getMe(req, res);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(populateChain.populate).toHaveBeenCalledWith('children', 'name role');
      expect(TeamDao.readOneTeam).toHaveBeenCalledWith('team123');
      expect(res.json).toHaveBeenCalledWith({
        user: {
          ...mockUser,
          team: { id: 'team123', name: 'Test Team' }
        }
      });
    });

    it('should return user without team info if no team', async () => {
      req.session.user = { id: 'user123', role: 'child' };

      const mockUser = {
        _id: 'user123',
        name: 'Test Child',
        email: 'child@test.com',
        role: 'child',
        teamId: null,
        children: []
      };

      const populateChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUser)
      };
      User.findById.mockReturnValue(populateChain);

      await userController.getMe(req, res);

      expect(TeamDao.readOneTeam).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('should return 401 if not authenticated', async () => {
      req.session.user = null;

      await userController.getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authenticated' });
    });

    it('should return 404 if user not found', async () => {
      req.session.user = { id: 'notfound', role: 'parent' };

      const populateChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null)
      };
      User.findById.mockReturnValue(populateChain);

      await userController.getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle null team gracefully', async () => {
      req.session.user = { id: 'user123', role: 'manager' };

      const mockUser = {
        _id: 'user123',
        name: 'Manager',
        email: 'manager@test.com',
        role: 'manager',
        teamId: 'team123'
      };

      const populateChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUser)
      };
      User.findById.mockReturnValue(populateChain);
      TeamDao.readOneTeam.mockResolvedValue(null);

      await userController.getMe(req, res);

      expect(res.json).toHaveBeenCalledWith({
        user: {
          ...mockUser,
          team: null
        }
      });
    });

    it('should handle database errors', async () => {
      req.session.user = { id: 'user123', role: 'parent' };

      User.findById.mockImplementation(() => {
        throw new Error('DB error');
      });

      await userController.getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  // getUserById
  describe('getUserById', () => {
    it('should return user profile when requester is the owner', async () => {
      req.params.id = 'user123';
      req.session.user = { id: 'user123', role: 'parent' };

      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@test.com',
        password: 'hashedpassword',
        role: 'parent',
        teamId: null
      };

      const populateChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUser)
      };
      User.findById.mockReturnValue(populateChain);

      await userController.getUserById(req, res);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
      expect(mockUser.email).toBeDefined(); // Email should be visible to owner
    });

    it('should return public profile without email when requester is not owner', async () => {
      req.params.id = 'user123';
      req.session.user = { id: 'otheruser', role: 'parent' };

      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@test.com',
        password: 'hashedpassword',
        role: 'parent',
        teamId: null
      };

      const populateChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUser)
      };
      User.findById.mockReturnValue(populateChain);

      await userController.getUserById(req, res);

      const call = res.json.mock.calls[0][0];
      expect(call.user.email).toBeUndefined(); // Email should be stripped
      expect(call.user.password).toBeUndefined(); // Password should be stripped
      expect(call.user.name).toBe('Test User'); // Other fields should remain
    });

    it('should return public profile when no session', async () => {
      req.params.id = 'user123';
      req.session.user = null;

      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@test.com',
        password: 'hashedpassword',
        role: 'parent',
        teamId: null
      };

      const populateChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUser)
      };
      User.findById.mockReturnValue(populateChain);

      await userController.getUserById(req, res);

      const call = res.json.mock.calls[0][0];
      expect(call.user.email).toBeUndefined();
      expect(call.user.password).toBeUndefined();
    });

    it('should include team info if user has a team', async () => {
      req.params.id = 'user123';
      req.session.user = { id: 'otheruser', role: 'parent' };

      const mockUser = {
        _id: 'user123',
        name: 'Manager',
        email: 'manager@test.com',
        role: 'manager',
        teamId: 'team123'
      };

      const mockTeam = {
        _id: 'team123',
        teamName: 'Test Team'
      };

      const populateChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUser)
      };
      User.findById.mockReturnValue(populateChain);
      TeamDao.readOneTeam.mockResolvedValue(mockTeam);

      await userController.getUserById(req, res);

      expect(TeamDao.readOneTeam).toHaveBeenCalledWith('team123');
      const call = res.json.mock.calls[0][0];
      expect(call.user.team).toEqual({ id: 'team123', name: 'Test Team' });
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 'notfound';
      req.session.user = { id: 'user123', role: 'parent' };

      const populateChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null)
      };
      User.findById.mockReturnValue(populateChain);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle database errors', async () => {
      req.params.id = 'user123';
      req.session.user = { id: 'user123', role: 'parent' };

      User.findById.mockImplementation(() => {
        throw new Error('DB error');
      });

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });

    it('should handle team lookup errors gracefully', async () => {
      req.params.id = 'user123';
      req.session.user = { id: 'user123', role: 'manager' };

      const mockUser = {
        _id: 'user123',
        name: 'Manager',
        email: 'manager@test.com',
        role: 'manager',
        teamId: 'team123'
      };

      const populateChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUser)
      };
      User.findById.mockReturnValue(populateChain);
      TeamDao.readOneTeam.mockRejectedValue(new Error('Team lookup error'));

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Team lookup error' });
    });
  });
});
