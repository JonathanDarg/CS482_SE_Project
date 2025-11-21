const controller = require('./TeamStatsController');
const dao = require('../model/TeamStatsDao');

jest.mock('../model/TeamStatsDao');

describe('TeamStatsController', () => {
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

  // createStats
  describe('createStats', () => {
    it('should create stats', async () => {
      const statsData = { teamName: '123' };
      const savedStats = { ...statsData, gamesPlayed: 0, totalWins: 0, totalLosses: 0, pointsScored: 0, _id: 'abc' };
      req.body = statsData;
      dao.createStats.mockResolvedValue(savedStats);

      await controller.createStats(req, res);

      expect(dao.createStats).toHaveBeenCalledWith(expect.objectContaining({
        teamName: '123',
        gamesPlayed: 0,
        totalWins: 0,
        totalLosses: 0,
        pointsScored: 0
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedStats);
    });

    it('should handle errors', async () => {
      dao.createStats.mockRejectedValue(new Error('DB error'));
      await controller.createStats(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating Team Stats' });
    });
  });

  // get all stats
  describe('getAllStats', () => {
    it('should return all stats', async () => {
      const stats = [{ teamName: '123' }];
      dao.getAllStats.mockResolvedValue(stats);

      await controller.getAllStats(req, res);

      expect(dao.getAllStats).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(stats);
    });

    it('should handle errors', async () => {
      dao.getAllStats.mockRejectedValue(new Error('DB error'));
      await controller.getAllStats(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving Team Stats' });
    });
  });

  // get stats 
  describe('getStats', () => {
    it('should return stats by id', async () => {
      req.params.id = '1';
      const stats = { _id: '1', teamName: '123' };
      dao.readOneStats.mockResolvedValue(stats);

      await controller.getStats(req, res);

      expect(dao.readOneStats).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(stats);
    });

    it('should return 404 if not found', async () => {
      req.params.id = '1';
      dao.readOneStats.mockResolvedValue(null);

      await controller.getStats(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Team Stats not found' });
    });

    it('should handle errors', async () => {
      req.params.id = '1';
      dao.readOneStats.mockRejectedValue(new Error('DB error'));

      await controller.getStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving Team Stats' });
    });
  });

  // update stats
  describe('updateStats', () => {
    it('should update stats', async () => {
      req.params.id = '1';
      req.body = { totalWins: 5 };
      const updated = { _id: '1', totalWins: 5 };
      dao.updateStats.mockResolvedValue(updated);

      await controller.updateStats(req, res);

      expect(dao.updateStats).toHaveBeenCalledWith('1', { totalWins: 5 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should return 404 if stats not found', async () => {
      req.params.id = '1';
      dao.updateStats.mockResolvedValue(null);

      await controller.updateStats(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Team Stats not found' });
    });

    it('should handle errors', async () => {
      req.params.id = '1';
      dao.updateStats.mockRejectedValue(new Error('DB error'));

      await controller.updateStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating Team Stats' });
    });
  });

  // delete stats
  describe('deleteStats', () => {
    it('should delete stats', async () => {
      req.params.id = '1';
      dao.deleteStats.mockResolvedValue();

      await controller.deleteStats(req, res);

      expect(dao.deleteStats).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      req.params.id = '1';
      dao.deleteStats.mockRejectedValue(new Error('DB error'));

      await controller.deleteStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting Team Stats' });
    });
  });

  // delete all stats
  describe('deleteAllStats', () => {
    it('should delete all stats', async () => {
      dao.deleteAllStats.mockResolvedValue();

      await controller.deleteAllStats(req, res);

      expect(dao.deleteAllStats).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      dao.deleteAllStats.mockRejectedValue(new Error('DB error'));

      await controller.deleteAllStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting all Team Stats' });
    });
  });
});
