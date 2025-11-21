const controller = require('./TeamController');
const dao = require('../model/TeamDao');

jest.mock('../model/TeamDao');

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

    // Suppress console.error in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Ensure getTeamStats exists on the mock DAO
    if (!dao.getTeamStats) dao.getTeamStats = jest.fn();
  });

  // createTeam
  describe('createTeam', () => {
    it('should create a new team and return 201', async () => {
      const teamData = { teamName: 'Lions', wins: 5, losses: 2 };
      const savedTeam = { ...teamData, logo: '', _id: '123' };

      req.body = teamData;
      dao.createTeam.mockResolvedValue(savedTeam);

      await controller.createTeam(req, res);

      expect(dao.createTeam).toHaveBeenCalledWith(expect.objectContaining({ ...teamData, logo: '' }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedTeam);
    });

    it('should handle errors', async () => {
      dao.createTeam.mockRejectedValue(new Error('DB error'));

      await controller.createTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating Team' });
    });
  });

  // get all teams
  describe('getAllTeams', () => {
    it('should return all teams', async () => {
      const teams = [{ teamName: 'Lions' }, { teamName: 'Tigers' }];
      dao.getAllTeams.mockResolvedValue(teams);

      await controller.getAllTeams(req, res);

      expect(dao.getAllTeams).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(teams);
    });

    it('should handle errors', async () => {
      dao.getAllTeams.mockRejectedValue(new Error('DB error'));

      await controller.getAllTeams(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving Teams' });
    });
  });

  // get one team
  describe('getTeam', () => {
    it('should return one team', async () => {
      req.params.id = '123';
      const team = { _id: '123', teamName: 'Lions' };
      dao.readOneTeam.mockResolvedValue(team);

      await controller.getTeam(req, res);

      expect(dao.readOneTeam).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(team);
    });

    it('should return 404 if team not found', async () => {
      req.params.id = '999';
      dao.readOneTeam.mockResolvedValue(null);

      await controller.getTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Team not found' });
    });

    it('should handle errors', async () => {
      req.params.id = '123';
      dao.readOneTeam.mockRejectedValue(new Error('DB error'));

      await controller.getTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving Team' });
    });
  });

  // update team
  describe('updateTeam', () => {
    it('should update a team', async () => {
      req.params.id = '1';
      req.body = { wins: 6 };
      const updatedTeam = { _id: '1', teamName: 'Lions', wins: 6 };

      dao.updateTeam.mockResolvedValue(updatedTeam);

      await controller.updateTeam(req, res);

      expect(dao.updateTeam).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTeam);
    });

    it('should return 404 if team not found', async () => {
      req.params.id = '2';
      dao.updateTeam.mockResolvedValue(null);

      await controller.updateTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Team not found' });
    });

    it('should handle errors', async () => {
      req.params.id = '1';
      dao.updateTeam.mockRejectedValue(new Error('DB error'));

      await controller.updateTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating Team' });
    });
  });

  // delete team
  describe('deleteTeam', () => {
    it('should delete a team', async () => {
      req.params.id = '1';
      dao.deleteTeam.mockResolvedValue();

      await controller.deleteTeam(req, res);

      expect(dao.deleteTeam).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      req.params.id = '1';
      dao.deleteTeam.mockRejectedValue(new Error('DB error'));

      await controller.deleteTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting Team' });
    });
  });
});