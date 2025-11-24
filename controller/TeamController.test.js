const controller = require('./TeamController');
const dao = require('../model/TeamDao');
const User = require('../model/User');

jest.mock('../model/TeamDao');
jest.mock('../model/User');

describe('TeamController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // createTeam
  describe('createTeam', () => {
    it('should create a new team with ObjectId references', async () => {
      const teamData = { 
        teamName: 'Lions', 
        manager: '507f1f77bcf86cd799439011',
        players: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013']
      };
      const savedTeam = { ...teamData, _id: '123' };

      req.body = teamData;
      dao.createTeam.mockResolvedValue(savedTeam);

      await controller.createTeam(req, res);

      expect(dao.createTeam).toHaveBeenCalledWith({
        teamName: 'Lions',
        manager: '507f1f77bcf86cd799439011',
        players: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013']
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedTeam);
    });

    it('should handle empty players array', async () => {
      const teamData = { 
        teamName: 'Tigers', 
        manager: '507f1f77bcf86cd799439011'
      };
      const savedTeam = { 
        teamName: 'Tigers', 
        manager: '507f1f77bcf86cd799439011',
        players: [],
        _id: '456' 
      };

      req.body = teamData;
      dao.createTeam.mockResolvedValue(savedTeam);

      await controller.createTeam(req, res);

      expect(dao.createTeam).toHaveBeenCalledWith({
        teamName: 'Tigers',
        manager: '507f1f77bcf86cd799439011',
        players: []
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedTeam);
    });

    it('should handle missing manager field as null', async () => {
      const teamData = { 
        teamName: 'Bears',
        players: ['507f1f77bcf86cd799439012']
      };
      const savedTeam = { 
        teamName: 'Bears',
        manager: null,
        players: ['507f1f77bcf86cd799439012'],
        _id: '789'
      };

      req.body = teamData;
      dao.createTeam.mockResolvedValue(savedTeam);

      await controller.createTeam(req, res);

      expect(dao.createTeam).toHaveBeenCalledWith({
        teamName: 'Bears',
        manager: null,
        players: ['507f1f77bcf86cd799439012']
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedTeam);
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should normalize single string player to array', async () => {
      const teamData = { 
        teamName: 'Hawks',
        manager: null,
        players: '507f1f77bcf86cd799439012'
      };
      const savedTeam = { 
        teamName: 'Hawks',
        manager: null,
        players: ['507f1f77bcf86cd799439012'],
        _id: '999'
      };

      req.body = teamData;
      dao.createTeam.mockResolvedValue(savedTeam);

      await controller.createTeam(req, res);

      expect(dao.createTeam).toHaveBeenCalledWith({
        teamName: 'Hawks',
        manager: null,
        players: ['507f1f77bcf86cd799439012']
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle undefined players', async () => {
      req.body = { teamName: 'Lions' };
      const savedTeam = { teamName: 'Lions', manager: null, players: [], _id: '123' };
      dao.createTeam.mockResolvedValue(savedTeam);

      await controller.createTeam(req, res);

      expect(dao.createTeam).toHaveBeenCalledWith({
        teamName: 'Lions',
        manager: null,
        players: [],
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedTeam);
    });

    it('should handle errors and log them', async () => {
      req.body = { teamName: 'Lions' };
      const error = new Error('DB error');
      dao.createTeam.mockRejectedValue(error);

      await controller.createTeam(req, res);

      expect(console.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating team' });
    });
  });

  // getAllTeams
  describe('getAllTeams', () => {
    it('should return all teams with populated data', async () => {
      const teams = [
        { 
          teamName: 'Lions', 
          manager: { _id: '1', name: 'John', email: 'john@test.com' }, 
          players: [
            { _id: '2', name: 'P1', email: 'p1@test.com' },
            { _id: '3', name: 'P2', email: 'p2@test.com' }
          ]
        }
      ];
      dao.getAllTeams.mockResolvedValue(teams);

      await controller.getAllTeams(req, res);

      expect(dao.getAllTeams).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(teams);
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should handle errors and log them', async () => {
      const error = new Error('DB error');
      dao.getAllTeams.mockRejectedValue(error);

      await controller.getAllTeams(req, res);

      expect(console.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving teams' });
    });
  });

  // getTeam
  describe('getTeam', () => {
    it('should return one team with populated data', async () => {
      req.params.id = '123';
      const team = { 
        _id: '123', 
        teamName: 'Lions',
        manager: { _id: '1', name: 'John', email: 'john@test.com' },
        players: [
          { _id: '2', name: 'P1', email: 'p1@test.com' }
        ]
      };
      dao.readOneTeam.mockResolvedValue(team);

      await controller.getTeam(req, res);

      expect(dao.readOneTeam).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(team);
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should return 404 if team not found', async () => {
      req.params.id = '999';
      dao.readOneTeam.mockResolvedValue(null);

      await controller.getTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Team not found' });
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should handle errors and log them', async () => {
      req.params.id = '123';
      const error = new Error('DB error');
      dao.readOneTeam.mockRejectedValue(error);

      await controller.getTeam(req, res);

      expect(console.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving team' });
    });
  });

  // updateTeam
  describe('updateTeam', () => {
    it('should update a team', async () => {
      req.params.id = '1';
      req.body = { 
        teamName: 'Lions Updated',
        manager: '507f1f77bcf86cd799439011',
        players: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013']
      };
      const updatedTeam = { 
        _id: '1', 
        teamName: 'Lions Updated',
        manager: { _id: '507f1f77bcf86cd799439011', name: 'John' },
        players: [
          { _id: '507f1f77bcf86cd799439012', name: 'P1' },
          { _id: '507f1f77bcf86cd799439013', name: 'P2' }
        ]
      };

      dao.updateTeam.mockResolvedValue(updatedTeam);

      await controller.updateTeam(req, res);

      expect(dao.updateTeam).toHaveBeenCalledWith('1', {
        teamName: 'Lions Updated',
        manager: '507f1f77bcf86cd799439011',
        players: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013']
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTeam);
    });

    it('should handle null manager', async () => {
      req.params.id = '1';
      req.body = { teamName: 'Wolves', players: ['507f1f77bcf86cd799439012'] };
      const updatedTeam = { 
        _id: '1', 
        teamName: 'Wolves',
        manager: null,
        players: [{ _id: '507f1f77bcf86cd799439012', name: 'P1' }]
      };

      dao.updateTeam.mockResolvedValue(updatedTeam);

      await controller.updateTeam(req, res);

      expect(dao.updateTeam).toHaveBeenCalledWith('1', {
        teamName: 'Wolves',
        manager: null,
        players: ['507f1f77bcf86cd799439012']
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTeam);
    });

    it('should return 404 if team not found', async () => {
      req.params.id = '2';
      req.body = { teamName: 'Tigers' };
      dao.updateTeam.mockResolvedValue(null);

      await controller.updateTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Team not found' });
    });

    it('should handle errors and log them', async () => {
      req.params.id = '1';
      req.body = { teamName: 'Lions' };
      const error = new Error('DB error');
      dao.updateTeam.mockRejectedValue(error);

      await controller.updateTeam(req, res);

      expect(console.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating team' });
    });
  });

  // deleteTeam
  describe('deleteTeam', () => {
    it('should delete a team', async () => {
      req.params.id = '1';
      dao.deleteTeam.mockResolvedValue();

      await controller.deleteTeam(req, res);

      expect(dao.deleteTeam).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should handle errors and log them', async () => {
      req.params.id = '1';
      const error = new Error('DB error');
      dao.deleteTeam.mockRejectedValue(error);

      await controller.deleteTeam(req, res);

      expect(console.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting team' });
    });
  });

  // getManagers
  describe('getManagers', () => {
    it('should return all managers', async () => {
      const managers = [
        { _id: '1', name: 'John', email: 'john@test.com', isActive: true },
        { _id: '2', name: 'Jane', email: 'jane@test.com', isActive: false },
      ];

      User.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(managers),
      });

      await controller.getManagers(req, res);

      expect(User.find).toHaveBeenCalledWith({ role: 'manager' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(managers);
    });

    it('should handle errors', async () => {
      const error = new Error('DB error');
      User.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValue(error),
      });

      await controller.getManagers(req, res);

      expect(console.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving managers' });
    });
  });

  // getChildren
  describe('getChildren', () => {
    it('should return all children with parent info', async () => {
      const children = [
        { _id: '1', name: 'Child 1', email: 'child1@test.com', parentId: { _id: 'parent1', name: 'Parent 1' }, isActive: true }
      ];

      User.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(children)
      });

      await controller.getChildren(req, res);

      expect(User.find).toHaveBeenCalledWith({ role: 'child' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(children);
    });

    it('should handle errors', async () => {
      const error = new Error('DB error');
      User.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValue(error)
      });

      await controller.getChildren(req, res);

      expect(console.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving children' });
    });
  });

  // getChildrenByParent
  describe('getChildrenByParent', () => {
    it('should return children for specific parent', async () => {
      req.params.parentId = 'parent123';
      const children = [{ _id: '1', name: 'Child 1', email: 'child1@test.com', isActive: true }];

      User.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(children)
      });

      await controller.getChildrenByParent(req, res);

      expect(User.find).toHaveBeenCalledWith({ role: 'child', parentId: 'parent123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(children);
    });

    it('should handle errors', async () => {
      req.params.parentId = 'parent123';
      const error = new Error('DB error');

      User.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValue(error)
      });

      await controller.getChildrenByParent(req, res);

      expect(console.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving children for parent' });
    });
  });
});
