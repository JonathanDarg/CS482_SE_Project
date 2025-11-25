const mongoose = require('mongoose');
const TeamScoreDao = require('./TeamScoreDao');

jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');

  // Model constructor
  function MockModel(data) {
    this.data = data;
  }

  // Static model functions
  MockModel.find = jest.fn();
  MockModel.findById = jest.fn();
  MockModel.findByIdAndDelete = jest.fn();
  MockModel.deleteMany = jest.fn();

  return {
    ...actual,
    model: jest.fn(() => MockModel),
    Schema: actual.Schema,
    Types: actual.Types,
  };
});

describe('TeamScoreDao', () => {
  let TeamScoreModel;

  beforeAll(() => {
    TeamScoreModel = mongoose.model();
  });

  beforeEach(() => jest.clearAllMocks());

  afterEach(() => {
    if (TeamScoreModel && TeamScoreModel.prototype && TeamScoreModel.prototype.save && TeamScoreModel.prototype.save._isMockFunction) {
      delete TeamScoreModel.prototype.save;
    }
  });

  // createTeamScore
  describe('createTeamScore', () => {
    it('should create a new team score', async () => {
      const scoreData = {
        teamId: new mongoose.Types.ObjectId(),
        score: 5,
        gameId: new mongoose.Types.ObjectId(),
        visiting: false
      };

      const savedScore = { ...scoreData, _id: 'score123' };

      TeamScoreModel.prototype.save = jest.fn().mockImplementation(function() {
        this._id = 'score123';
        return Promise.resolve(this);
      });

      const result = await TeamScoreDao.createTeamScore(scoreData);

      expect(TeamScoreModel.prototype.save).toHaveBeenCalled();
      expect(result._id).toBe('score123');
      expect(result.data.score).toBe(5);
      expect(result.data.visiting).toBe(false);
    });

    it('should create a visiting team score', async () => {
      const scoreData = {
        teamId: new mongoose.Types.ObjectId(),
        score: 3,
        gameId: new mongoose.Types.ObjectId(),
        visiting: true
      };

      TeamScoreModel.prototype.save = jest.fn().mockImplementation(function() {
        this._id = 'score456';
        return Promise.resolve(this);
      });

      const result = await TeamScoreDao.createTeamScore(scoreData);

      expect(result.data.visiting).toBe(true);
      expect(result.data.score).toBe(3);
    });

    it('should handle database errors', async () => {
      const scoreData = {
        teamId: new mongoose.Types.ObjectId(),
        score: 0,
        gameId: new mongoose.Types.ObjectId(),
        visiting: false
      };

      TeamScoreModel.prototype.save = jest.fn().mockRejectedValue(new Error('DB error'));

      await expect(TeamScoreDao.createTeamScore(scoreData)).rejects.toThrow('DB error');
    });
  });

  // getAllTeamScores
  describe('getAllTeamScores', () => {
    it('should return all team scores', async () => {
      const scores = [
        { _id: 'score1', teamId: 'team1', score: 5, gameId: 'game1', visiting: false },
        { _id: 'score2', teamId: 'team2', score: 3, gameId: 'game1', visiting: true },
        { _id: 'score3', teamId: 'team1', score: 7, gameId: 'game2', visiting: false }
      ];

      TeamScoreModel.find.mockResolvedValue(scores);

      const result = await TeamScoreDao.getAllTeamScores();

      expect(TeamScoreModel.find).toHaveBeenCalled();
      expect(result).toEqual(scores);
      expect(result.length).toBe(3);
    });

    it('should return empty array when no scores exist', async () => {
      TeamScoreModel.find.mockResolvedValue([]);

      const result = await TeamScoreDao.getAllTeamScores();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      TeamScoreModel.find.mockRejectedValue(new Error('DB error'));

      await expect(TeamScoreDao.getAllTeamScores()).rejects.toThrow('DB error');
    });
  });

  // readOneTeamScore
  describe('readOneTeamScore', () => {
    it('should return a team score by id', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      const score = {
        _id: scoreId,
        teamId: 'team1',
        score: 5,
        gameId: 'game1',
        visiting: false
      };

      TeamScoreModel.findById.mockResolvedValue(score);

      const result = await TeamScoreDao.readOneTeamScore(scoreId);

      expect(TeamScoreModel.findById).toHaveBeenCalledWith(scoreId);
      expect(result).toEqual(score);
    });

    it('should return null when score not found', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      TeamScoreModel.findById.mockResolvedValue(null);

      const result = await TeamScoreDao.readOneTeamScore(scoreId);

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      TeamScoreModel.findById.mockRejectedValue(new Error('DB error'));

      await expect(TeamScoreDao.readOneTeamScore(scoreId)).rejects.toThrow('DB error');
    });
  });

  // updateTeamScore
  describe('updateTeamScore', () => {
    it('should update a team score', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      const existingScore = {
        _id: scoreId,
        teamId: 'team1',
        score: 5,
        gameId: 'game1',
        visiting: false,
        save: jest.fn().mockResolvedValue(true)
      };

      const updateData = {
        teamId: 'team1',
        score: 7,
        gameId: 'game1',
        visiting: false
      };

      TeamScoreModel.findById.mockResolvedValue(existingScore);

      const result = await TeamScoreDao.updateTeamScore(scoreId, updateData);

      expect(TeamScoreModel.findById).toHaveBeenCalledWith(scoreId);
      expect(existingScore.score).toBe(7);
      expect(existingScore.save).toHaveBeenCalled();
      expect(result).toEqual(existingScore);
    });

    it('should update all fields including visiting status', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      const existingScore = {
        _id: scoreId,
        teamId: 'team1',
        score: 5,
        gameId: 'game1',
        visiting: false,
        save: jest.fn().mockResolvedValue(true)
      };

      const updateData = {
        teamId: 'team2',
        score: 10,
        gameId: 'game2',
        visiting: true
      };

      TeamScoreModel.findById.mockResolvedValue(existingScore);

      const result = await TeamScoreDao.updateTeamScore(scoreId, updateData);

      expect(existingScore.teamId).toBe('team2');
      expect(existingScore.score).toBe(10);
      expect(existingScore.gameId).toBe('game2');
      expect(existingScore.visiting).toBe(true);
    });

    it('should return null when score not found', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      const updateData = {
        teamId: 'team1',
        score: 7,
        gameId: 'game1',
        visiting: false
      };

      TeamScoreModel.findById.mockResolvedValue(null);

      const result = await TeamScoreDao.updateTeamScore(scoreId, updateData);

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      const updateData = {
        teamId: 'team1',
        score: 7,
        gameId: 'game1',
        visiting: false
      };

      TeamScoreModel.findById.mockRejectedValue(new Error('DB error'));

      await expect(TeamScoreDao.updateTeamScore(scoreId, updateData)).rejects.toThrow('DB error');
    });
  });

  // deleteTeamScore
  describe('deleteTeamScore', () => {
    it('should delete a team score', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      const deletedScore = { _id: scoreId, score: 5 };

      TeamScoreModel.findByIdAndDelete.mockResolvedValue(deletedScore);

      await TeamScoreDao.deleteTeamScore(scoreId);

      expect(TeamScoreModel.findByIdAndDelete).toHaveBeenCalledWith(scoreId);
    });

    it('should not throw error when deleting non-existent score', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      TeamScoreModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(TeamScoreDao.deleteTeamScore(scoreId)).resolves.not.toThrow();
    });

    it('should handle database errors', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      TeamScoreModel.findByIdAndDelete.mockRejectedValue(new Error('DB error'));

      await expect(TeamScoreDao.deleteTeamScore(scoreId)).rejects.toThrow('DB error');
    });
  });

  // deleteAll
  describe('deleteAll', () => {
    it('should delete all team scores', async () => {
      const deleteResult = { deletedCount: 5 };
      TeamScoreModel.deleteMany.mockResolvedValue(deleteResult);

      await TeamScoreDao.deleteAll();

      expect(TeamScoreModel.deleteMany).toHaveBeenCalled();
    });

    it('should handle when no scores exist', async () => {
      const deleteResult = { deletedCount: 0 };
      TeamScoreModel.deleteMany.mockResolvedValue(deleteResult);

      await expect(TeamScoreDao.deleteAll()).resolves.not.toThrow();
    });

    it('should handle database errors', async () => {
      TeamScoreModel.deleteMany.mockRejectedValue(new Error('DB error'));

      await expect(TeamScoreDao.deleteAll()).rejects.toThrow('DB error');
    });
  });

  // addHomeRun
  describe('addHomeRun', () => {
    it('should increment score by 1', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      const existingScore = {
        _id: scoreId,
        teamId: 'team1',
        score: 5,
        gameId: 'game1',
        visiting: false,
        save: jest.fn().mockResolvedValue(true)
      };

      TeamScoreModel.findById.mockResolvedValue(existingScore);

      const result = await TeamScoreDao.addHomeRun(scoreId);

      expect(TeamScoreModel.findById).toHaveBeenCalledWith(scoreId);
      expect(result.score).toBe(6);
      expect(existingScore.save).toHaveBeenCalled();
    });

    it('should increment from 0 to 1', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      const existingScore = {
        _id: scoreId,
        teamId: 'team1',
        score: 0,
        gameId: 'game1',
        visiting: false,
        save: jest.fn().mockResolvedValue(true)
      };

      TeamScoreModel.findById.mockResolvedValue(existingScore);

      const result = await TeamScoreDao.addHomeRun(scoreId);

      expect(result.score).toBe(1);
    });

    it('should handle multiple increments', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      const existingScore = {
        _id: scoreId,
        teamId: 'team1',
        score: 10,
        gameId: 'game1',
        visiting: false,
        save: jest.fn().mockResolvedValue(true)
      };

      TeamScoreModel.findById.mockResolvedValue(existingScore);

      await TeamScoreDao.addHomeRun(scoreId);
      await TeamScoreDao.addHomeRun(scoreId);

      expect(existingScore.score).toBe(12);
      expect(existingScore.save).toHaveBeenCalledTimes(2);
    });

    it('should return null when score not found', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      TeamScoreModel.findById.mockResolvedValue(null);

      const result = await TeamScoreDao.addHomeRun(scoreId);

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const scoreId = new mongoose.Types.ObjectId();
      TeamScoreModel.findById.mockRejectedValue(new Error('DB error'));

      await expect(TeamScoreDao.addHomeRun(scoreId)).rejects.toThrow('DB error');
    });
  });
});
