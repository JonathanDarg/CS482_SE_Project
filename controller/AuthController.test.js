const authController = require('./AuthController');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const TeamDao = require('../model/TeamDao');

jest.mock('../model/User');
jest.mock('bcryptjs');
jest.mock('../model/TeamDao');

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
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

  // signup
  describe('signup', () => {
    it('should create a parent account successfully', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
        role: 'parent'
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      const mockUser = {
        _id: 'user123',
        name: 'John Doe',
        email: 'john@test.com',
        password: 'hashedPassword',
        role: 'parent',
        save: jest.fn().mockResolvedValue(true)
      };
      User.mockImplementation(() => mockUser);

      await authController.signup(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@test.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Signup successful' });
    });

    it('should return 400 if email already exists', async () => {
      req.body = {
        name: 'Jane',
        email: 'existing@test.com',
        password: 'pass123'
      };

      User.findOne.mockResolvedValue({ email: 'existing@test.com' });

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email already registered' });
    });

    it('should create a child account with parent link', async () => {
      const parentId = 'parent123';
      req.body = {
        name: 'Child',
        email: 'child@test.com',
        password: 'pass123',
        role: 'child',
        parentEmail: 'parent@test.com'
      };

      User.findOne.mockResolvedValueOnce(null); // No existing user
      User.findOne.mockResolvedValueOnce({ _id: parentId, role: 'parent' }); // Parent exists
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const mockChild = {
        _id: 'child123',
        name: 'Child',
        email: 'child@test.com',
        password: 'hashedPassword',
        role: 'child',
        parentId,
        save: jest.fn().mockResolvedValue(true)
      };
      User.mockImplementation(() => mockChild);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

      await authController.signup(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'parent@test.com', role: 'parent' });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        parentId,
        { $push: { children: 'child123' } }
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if child signup without parent email', async () => {
      req.body = {
        name: 'Child',
        email: 'child@test.com',
        password: 'pass123',
        role: 'child'
      };

      User.findOne.mockResolvedValue(null);

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Parent email required for child accounts' });
    });

    it('should return 400 if parent not found for child', async () => {
      req.body = {
        name: 'Child',
        email: 'child@test.com',
        password: 'pass123',
        role: 'child',
        parentEmail: 'notfound@test.com'
      };

      User.findOne.mockResolvedValueOnce(null); // No existing user
      User.findOne.mockResolvedValueOnce(null); // Parent not found

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Parent account not found' });
    });

    it('should create a manager account with team', async () => {
      req.body = {
        name: 'Manager',
        email: 'manager@test.com',
        password: 'pass123',
        role: 'manager',
        teamCode: 'LEAGUE2025'
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const mockManager = {
        _id: 'manager123',
        name: 'Manager',
        email: 'manager@test.com',
        password: 'hashedPassword',
        role: 'manager',
        teamId: null,
        save: jest.fn().mockResolvedValue(true)
      };
      User.mockImplementation(() => mockManager);

      const mockTeam = {
        _id: 'team123',
        teamName: "Manager's Team",
        manager: 'manager123',
        players: []
      };
      TeamDao.createTeam.mockResolvedValue(mockTeam);

      await authController.signup(req, res);

      expect(TeamDao.createTeam).toHaveBeenCalledWith({
        teamName: "Manager's Team",
        manager: 'manager123',
        players: []
      });
      expect(mockManager.teamId).toBe('team123');
      expect(mockManager.save).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if manager signup without team code', async () => {
      req.body = {
        name: 'Manager',
        email: 'manager@test.com',
        password: 'pass123',
        role: 'manager'
      };

      User.findOne.mockResolvedValue(null);

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Team code required for manager accounts' });
    });

    it('should return 400 if invalid team code', async () => {
      req.body = {
        name: 'Manager',
        email: 'manager@test.com',
        password: 'pass123',
        role: 'manager',
        teamCode: 'WRONGCODE'
      };

      User.findOne.mockResolvedValue(null);

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid team code' });
    });

    it('should return 403 if non-admin tries to create admin account', async () => {
      req.body = {
        name: 'Admin',
        email: 'admin@test.com',
        password: 'pass123',
        role: 'admin'
      };
      req.session.user = { role: 'parent' };

      User.findOne.mockResolvedValue(null);

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Only admins can create admin accounts' });
    });

    it('should allow admin to create admin account', async () => {
      req.body = {
        name: 'New Admin',
        email: 'newadmin@test.com',
        password: 'pass123',
        role: 'admin'
      };
      req.session.user = { _id: 'admin1', role: 'admin' };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const mockAdmin = {
        _id: 'admin2',
        name: 'New Admin',
        email: 'newadmin@test.com',
        password: 'hashedPassword',
        role: 'admin',
        save: jest.fn().mockResolvedValue(true)
      };
      User.mockImplementation(() => mockAdmin);

      await authController.signup(req, res);

      expect(mockAdmin.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle database errors', async () => {
      req.body = {
        name: 'Test',
        email: 'test@test.com',
        password: 'pass123'
      };

      User.findOne.mockRejectedValue(new Error('DB error'));

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  // login
  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      req.body = {
        email: 'user@test.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'user@test.com',
        password: 'hashedPassword',
        role: 'parent',
        isActive: true,
        parentId: null,
        teamId: null
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'user@test.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(req.session.user).toEqual({
        _id: 'user123',
        name: 'Test User',
        email: 'user@test.com',
        role: 'parent',
        parentId: null,
        teamId: null
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: req.session.user
      });
    });

    it('should return 400 if user not found', async () => {
      req.body = {
        email: 'notfound@test.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    it('should return 403 if account is deactivated', async () => {
      req.body = {
        email: 'user@test.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        email: 'user@test.com',
        password: 'hashedPassword',
        isActive: false
      };

      User.findOne.mockResolvedValue(mockUser);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Account is deactivated' });
    });

    it('should return 400 if password is incorrect', async () => {
      req.body = {
        email: 'user@test.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        _id: 'user123',
        email: 'user@test.com',
        password: 'hashedPassword',
        isActive: true
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    it('should handle database errors', async () => {
      req.body = {
        email: 'user@test.com',
        password: 'password123'
      };

      User.findOne.mockRejectedValue(new Error('DB error'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  // logout
  describe('logout', () => {
    it('should destroy session and logout', async () => {
      req.session.destroy = jest.fn((callback) => callback());

      await authController.logout(req, res);

      expect(req.session.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Logged out' });
    });
  });

  // checkSession
  describe('checkSession', () => {
    it('should return logged in status when session exists', async () => {
      req.session.user = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@test.com',
        role: 'parent'
      };

      await authController.checkSession(req, res);

      expect(res.json).toHaveBeenCalledWith({
        loggedIn: true,
        user: req.session.user
      });
    });

    it('should return not logged in when no session', async () => {
      req.session.user = null;

      await authController.checkSession(req, res);

      expect(res.json).toHaveBeenCalledWith({ loggedIn: false });
    });
  });

  // getChildren
  describe('getChildren', () => {
    it('should return children for parent user', async () => {
      req.session.user = { _id: 'parent123', role: 'parent' };

      const mockParent = {
        _id: 'parent123',
        children: [
          { _id: 'child1', name: 'Child 1', email: 'child1@test.com' },
          { _id: 'child2', name: 'Child 2', email: 'child2@test.com' }
        ]
      };

      const populateChain = {
        populate: jest.fn().mockResolvedValue(mockParent)
      };
      User.findById.mockReturnValue(populateChain);

      await authController.getChildren(req, res);

      expect(User.findById).toHaveBeenCalledWith('parent123');
      expect(populateChain.populate).toHaveBeenCalledWith('children', 'name email createdAt');
      expect(res.json).toHaveBeenCalledWith({ children: mockParent.children });
    });

    it('should return 403 if user is not a parent', async () => {
      req.session.user = { _id: 'user123', role: 'child' };

      await authController.getChildren(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    });

    it('should return 403 if no session', async () => {
      req.session.user = null;

      await authController.getChildren(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    });

    it('should handle database errors', async () => {
      req.session.user = { _id: 'parent123', role: 'parent' };

      const populateChain = {
        populate: jest.fn().mockRejectedValue(new Error('DB error'))
      };
      User.findById.mockReturnValue(populateChain);

      await authController.getChildren(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  // getAllUsers
  describe('getAllUsers', () => {
    it('should return all users for admin', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };

      const mockUsers = [
        { _id: 'user1', name: 'User 1', email: 'user1@test.com', role: 'parent' },
        { _id: 'user2', name: 'User 2', email: 'user2@test.com', role: 'child' }
      ];

      const selectChain = {
        sort: jest.fn().mockResolvedValue(mockUsers)
      };
      const findChain = {
        select: jest.fn().mockReturnValue(selectChain)
      };
      User.find.mockReturnValue(findChain);

      await authController.getAllUsers(req, res);

      expect(User.find).toHaveBeenCalledWith({});
      expect(findChain.select).toHaveBeenCalledWith('-password');
      expect(selectChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 403 if user is not admin', async () => {
      req.session.user = { _id: 'user123', role: 'parent' };

      await authController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Admin only.' });
    });

    it('should return 403 if no session', async () => {
      req.session.user = null;

      await authController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Admin only.' });
    });

    it('should handle database errors', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };

      User.find.mockImplementation(() => {
        throw new Error('DB error');
      });

      await authController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  // updateUserRole
  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };
      req.body = {
        userId: 'user123',
        newRole: 'manager'
      };

      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'user@test.com',
        role: 'parent',
        teamId: null,
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById.mockResolvedValue(mockUser);

      await authController.updateUserRole(req, res);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockUser.role).toBe('manager');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'User role updated successfully',
        user: {
          id: 'user123',
          name: 'Test User',
          email: 'user@test.com',
          role: 'manager'
        }
      });
    });

    it('should return 403 if user is not admin', async () => {
      req.session.user = { _id: 'user123', role: 'parent' };
      req.body = { userId: 'user456', newRole: 'manager' };

      await authController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Admin only.' });
    });

    it('should return 400 if userId or newRole missing', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };
      req.body = { userId: 'user123' };

      await authController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User ID and new role are required' });
    });

    it('should return 400 if invalid role', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };
      req.body = {
        userId: 'user123',
        newRole: 'invalidrole'
      };

      await authController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid role' });
    });

    it('should return 404 if user not found', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };
      req.body = {
        userId: 'notfound',
        newRole: 'manager'
      };

      User.findById.mockResolvedValue(null);

      await authController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 400 if trying to demote yourself', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };
      req.body = {
        userId: 'admin123',
        newRole: 'parent'
      };

      const mockUser = {
        _id: 'admin123',
        role: 'admin',
        toString: () => 'admin123'
      };

      User.findById.mockResolvedValue(mockUser);

      await authController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot demote yourself' });
    });

    it('should clear teamId when changing from manager', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };
      req.body = {
        userId: 'manager123',
        newRole: 'parent'
      };

      const mockUser = {
        _id: 'manager123',
        name: 'Manager',
        email: 'manager@test.com',
        role: 'manager',
        teamId: 'team123',
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById.mockResolvedValue(mockUser);

      await authController.updateUserRole(req, res);

      expect(mockUser.teamId).toBeNull();
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };
      req.body = {
        userId: 'user123',
        newRole: 'manager'
      };

      User.findById.mockRejectedValue(new Error('DB error'));

      await authController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  // deleteUser
  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };
      req.params.userId = 'user123';

      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        toString: () => 'user123'
      };

      User.findById.mockResolvedValue(mockUser);
      User.findByIdAndDelete = jest.fn().mockResolvedValue(mockUser);

      await authController.deleteUser(req, res);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(User.findByIdAndDelete).toHaveBeenCalledWith('user123');
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return 403 if user is not admin', async () => {
      req.session.user = { _id: 'user123', role: 'parent' };
      req.params.userId = 'user456';

      await authController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Admin only.' });
    });

    it('should return 400 if userId missing', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };
      req.params = {};

      await authController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User ID is required' });
    });

    it('should return 404 if user not found', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };
      req.params.userId = 'notfound';

      User.findById.mockResolvedValue(null);

      await authController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 400 if trying to delete yourself', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };
      req.params.userId = 'admin123';

      const mockUser = {
        _id: 'admin123',
        toString: () => 'admin123'
      };

      User.findById.mockResolvedValue(mockUser);

      await authController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot delete yourself' });
    });

    it('should handle database errors', async () => {
      req.session.user = { _id: 'admin123', role: 'admin' };
      req.params.userId = 'user123';

      User.findById.mockRejectedValue(new Error('DB error'));

      await authController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });
});
