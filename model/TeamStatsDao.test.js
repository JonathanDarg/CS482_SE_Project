const mongoose = require('mongoose');
const TeamStatsDao = require('../model/TeamStatsDao');

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');

  const mockSchema = function () { return {}; };
  const mockModel = function () {
    return { save: mockModel.prototype.save };
  };
  mockModel.prototype.save = jest.fn();
  mockModel.find = jest.fn();
  mockModel.findById = jest.fn();
  mockModel.findByIdAndUpdate = jest.fn();
  mockModel.findByIdAndDelete = jest.fn();
  mockModel.deleteMany = jest.fn();

  return {
    ...actualMongoose,
    model: jest.fn(() => mockModel),
    Schema: actualMongoose.Schema,
    Types: actualMongoose.Types,
  };
});

describe('TeamStatsDao', () => {
  let TeamStatsModel;

  beforeAll(() => {
    TeamStatsModel = mongoose.model();
    TeamStatsModel.prototype.save = jest.fn();
    TeamStatsModel.find.mockReset();
    TeamStatsModel.findById.mockReset();
    TeamStatsModel.findByIdAndUpdate.mockReset();
    TeamStatsModel.findByIdAndDelete.mockReset();
    TeamStatsModel.deleteMany.mockReset();
  });

  describe('createStats', () => {
    it('should create and save team stats', async () => {
      const statsData = { teamName: '123' };
      const savedStats = { ...statsData, gamesPlayed: 0, totalWins: 0, totalLosses: 0, pointsScored: 0, _id: 'abc' };
      TeamStatsModel.prototype.save.mockResolvedValue(savedStats);

      const result = await TeamStatsDao.createStats(statsData);

      expect(TeamStatsModel.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(savedStats);
    });
  });

  describe('getAllStats', () => {
    it('should return all stats', async () => {
      const stats = [{ teamName: '123' }];
      TeamStatsModel.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(stats) });

      const result = await TeamStatsDao.getAllStats();

      expect(TeamStatsModel.find).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });

  describe('readOneStats', () => {
    it('should return one stats record by id', async () => {
      const stats = { _id: '1', teamName: '123' };
      TeamStatsModel.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(stats) });

      const result = await TeamStatsDao.readOneStats('1');

      expect(TeamStatsModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(stats);
    });
  });

  describe('updateStats', () => {
    it('should update and return stats', async () => {
      const updated = { _id: '1', totalWins: 5 };
      TeamStatsModel.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await TeamStatsDao.updateStats('1', { totalWins: 5 });

      expect(TeamStatsModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { totalWins: 5 }, { new: true });
      expect(result).toEqual(updated);
    });
  });

  describe('deleteStats', () => {
    it('should delete stats', async () => {
      TeamStatsModel.findByIdAndDelete.mockResolvedValue();

      await TeamStatsDao.deleteStats('1');

      expect(TeamStatsModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });

  describe('deleteAllStats', () => {
    it('should delete all stats', async () => {
      TeamStatsModel.deleteMany.mockResolvedValue();

      await TeamStatsDao.deleteAllStats();

      expect(TeamStatsModel.deleteMany).toHaveBeenCalled();
    });
  });
});
