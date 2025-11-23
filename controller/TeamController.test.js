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
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // createTeam
  describe('createTeam', () => {
    it('creates a new team (array players, no trimming)', async () => {
      req.body = {
        teamName: 'Lions',
        manager: 'Coach Z',
        players: ['  Tom ', ' Jerry', '', '  '],
      };

      const expectedTeam = {
        teamName: 'Lions',
        manager: 'Coach Z',
        players: ['  Tom ', ' Jerry', '', '  ']
      };

      dao.createTeam.mockResolvedValue({ ...expectedTeam, _id: '123' });

      await controller.createTeam(req, res);

      expect(dao.createTeam).toHaveBeenCalledWith(expectedTeam);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ ...expectedTeam, _id: '123' });
    });

    it('accepts a single string for players', async () => {
      req.body = {
        teamName: 'Sharks',
        manager: 'Coach X',
        players: ' Sam '
      };

      const expectedTeam = {
        teamName: 'Sharks',
        manager: 'Coach X',
        players: [' Sam ']
      };

      dao.createTeam.mockResolvedValue({ ...expectedTeam, _id: '222' });

      await controller.createTeam(req, res);

      expect(dao.createTeam).toHaveBeenCalledWith(expectedTeam);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ ...expectedTeam, _id: '222' });
    });

    it('uses empty string for missing manager', async () => {
      req.body = {
        teamName: 'Lions',
        players: ['Amy'],
      };

      const expectedTeam = {
        teamName: 'Lions',
        manager: '',
        players: ['Amy']
      };

      dao.createTeam.mockResolvedValue({ ...expectedTeam, _id: '555' });

      await controller.createTeam(req, res);

      expect(dao.createTeam).toHaveBeenCalledWith(expectedTeam);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ ...expectedTeam, _id: '555' });
    });

    it('handles errors', async () => {
      dao.createTeam.mockRejectedValue(new Error('DB error'));

      await controller.createTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating team' });
    });
  });

  // getAllTeams
  describe('getAllTeams', () => {
    it('returns all teams', async () => {
      const teams = [{ teamName: 'Lions' }];
      dao.getAllTeams.mockResolvedValue(teams);

      await controller.getAllTeams(req, res);

      expect(dao.getAllTeams).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(teams);
    });

    it('handles errors', async () => {
      dao.getAllTeams.mockRejectedValue(new Error('DB error'));

      await controller.getAllTeams(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving teams' });
    });
  });

  // getTeam
  describe('getTeam', () => {
    it('returns a team', async () => {
      req.params.id = '123';
      const team = { _id: '123', teamName: 'Lions' };
      dao.readOneTeam.mockResolvedValue(team);

      await controller.getTeam(req, res);

      expect(dao.readOneTeam).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(team);
    });

    it('returns 404 when team not found', async () => {
      req.params.id = '999';
      dao.readOneTeam.mockResolvedValue(null);

      await controller.getTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Team not found' });
    });

    it('handles errors', async () => {
      req.params.id = '123';
      dao.readOneTeam.mockRejectedValue(new Error('DB error'));

      await controller.getTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving team' });
    });
  });

  // updateTeam
  describe('updateTeam', () => {
    it('updates a team (array players, no trimming)', async () => {
      req.params.id = '1';
      req.body = {
        teamName: 'Lions Updated',
        manager: 'Coach B',
        players: ['  Mike', '', 'Sue ']
      };

      const expectedUpdate = {
        teamName: 'Lions Updated',
        manager: 'Coach B',
        players: ['  Mike', '', 'Sue ']
      };

      dao.updateTeam.mockResolvedValue({ _id: '1', ...expectedUpdate });

      await controller.updateTeam(req, res);

      expect(dao.updateTeam).toHaveBeenCalledWith('1', expectedUpdate);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ _id: '1', ...expectedUpdate });
    });

    it('accepts single-string players on update', async () => {
      req.params.id = '1';
      req.body = {
        teamName: 'Updated',
        manager: 'Coach X',
        players: ' Sam '
      };

      const expectedUpdate = {
        teamName: 'Updated',
        manager: 'Coach X',
        players: [' Sam ']
      };

      dao.updateTeam.mockResolvedValue({ _id: '1', ...expectedUpdate });

      await controller.updateTeam(req, res);

      expect(dao.updateTeam).toHaveBeenCalledWith('1', expectedUpdate);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ _id: '1', ...expectedUpdate });
    });

    it('uses empty string for missing manager', async () => {
      req.params.id = '1';
      req.body = {
        teamName: 'Updated',
        players: [' Bob '],
      };

      const expectedUpdate = {
        teamName: 'Updated',
        manager: '',
        players: [' Bob ']
      };

      dao.updateTeam.mockResolvedValue({ _id: '1', ...expectedUpdate });

      await controller.updateTeam(req, res);

      expect(dao.updateTeam).toHaveBeenCalledWith('1', expectedUpdate);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ _id: '1', ...expectedUpdate });
    });

    it('returns 404 if not found', async () => {
      req.params.id = '2';
      dao.updateTeam.mockResolvedValue(null);

      await controller.updateTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Team not found' });
    });

    it('handles errors', async () => {
      req.params.id = '1';
      dao.updateTeam.mockRejectedValue(new Error('DB error'));

      await controller.updateTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating team' });
    });
  });

  // deleteTeam
  describe('deleteTeam', () => {
    it('deletes a team', async () => {
      req.params.id = '1';
      dao.deleteTeam.mockResolvedValue();

      await controller.deleteTeam(req, res);

      expect(dao.deleteTeam).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('handles errors', async () => {
      req.params.id = '1';
      dao.deleteTeam.mockRejectedValue(new Error('DB error'));

      await controller.deleteTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting team' });
    });
  });
});
