const mongoose = require('mongoose');
const TeamDao = require('./TeamDao');

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  const mockSchema = function () { return {}; };
  mockSchema.prototype = {
    save: jest.fn(),
  };

  const mockModel = function () {
    return {
      save: mockModel.prototype.save,
    };
  };
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

describe('TeamDao', () => {
  let TeamModel;

  beforeAll(() => {
    TeamModel = mongoose.model();
    TeamModel.prototype.save = jest.fn();
    TeamModel.find.mockReset();
    TeamModel.findById.mockReset();
    TeamModel.findByIdAndUpdate.mockReset();
    TeamModel.findByIdAndDelete.mockReset();
    TeamModel.deleteMany.mockReset();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTeam', () => {
    it('should create and save a team', async () => {
      const teamData = { 
        teamName: 'Lions', 
        manager: 'John Doe',
        players: ['Player 1', 'Player 2']
      };
      const savedTeam = { ...teamData, _id: '123' };
      TeamModel.prototype.save.mockResolvedValue(savedTeam);

      const result = await TeamDao.createTeam(teamData);

      expect(TeamModel.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(savedTeam);
    });

    it('should create team with empty manager and players', async () => {
      const teamData = { 
        teamName: 'Tigers'
      };
      const savedTeam = { 
        teamName: 'Tigers',
        manager: '',
        players: [],
        _id: '456'
      };
      TeamModel.prototype.save.mockResolvedValue(savedTeam);

      const result = await TeamDao.createTeam(teamData);

      expect(TeamModel.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(savedTeam);
    });
  });

  describe('getAllTeams', () => {
    it('should return all teams', async () => {
      const teams = [
        { teamName: 'Lions', manager: 'John', players: ['P1', 'P2'] },
        { teamName: 'Tigers', manager: 'Jane', players: ['P3'] }
      ];
      TeamModel.find.mockResolvedValue(teams);

      const result = await TeamDao.getAllTeams();

      expect(TeamModel.find).toHaveBeenCalled();
      expect(result).toEqual(teams);
    });

    it('should return empty array when no teams exist', async () => {
      TeamModel.find.mockResolvedValue([]);

      const result = await TeamDao.getAllTeams();

      expect(TeamModel.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('readOneTeam', () => {
    it('should return one team by id', async () => {
      const team = { 
        _id: '1', 
        teamName: 'Lions',
        manager: 'John',
        players: ['P1', 'P2']
      };
      TeamModel.findById.mockResolvedValue(team);

      const result = await TeamDao.readOneTeam('1');

      expect(TeamModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(team);
    });

    it('should return null if team not found', async () => {
      TeamModel.findById.mockResolvedValue(null);

      const result = await TeamDao.readOneTeam('999');

      expect(TeamModel.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });
  });

  describe('updateTeam', () => {
    it('should update and return the team', async () => {
      const updatedTeam = { 
        _id: '1', 
        teamName: 'Lions Updated',
        manager: 'John Doe',
        players: ['P1', 'P2', 'P3']
      };
      TeamModel.findByIdAndUpdate.mockResolvedValue(updatedTeam);

      const result = await TeamDao.updateTeam('1', { 
        teamName: 'Lions Updated',
        players: ['P1', 'P2', 'P3']
      });

      expect(TeamModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { teamName: 'Lions Updated', players: ['P1', 'P2', 'P3'] },
        { new: true }
      );
      expect(result).toEqual(updatedTeam);
    });

    it('should return null if team not found', async () => {
      TeamModel.findByIdAndUpdate.mockResolvedValue(null);

      const result = await TeamDao.updateTeam('999', { teamName: 'Updated' });

      expect(TeamModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '999',
        { teamName: 'Updated' },
        { new: true }
      );
      expect(result).toBeNull();
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team', async () => {
      const deletedTeam = { 
        _id: '1', 
        teamName: 'Lions' 
      };
      TeamModel.findByIdAndDelete.mockResolvedValue(deletedTeam);

      const result = await TeamDao.deleteTeam('1');

      expect(TeamModel.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual(deletedTeam);
    });

    it('should return null if team not found', async () => {
      TeamModel.findByIdAndDelete.mockResolvedValue(null);

      const result = await TeamDao.deleteTeam('999');

      expect(TeamModel.findByIdAndDelete).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });
  });

  describe('deleteAll', () => {
    it('should delete all teams', async () => {
      const deleteResult = { deletedCount: 5 };
      TeamModel.deleteMany.mockResolvedValue(deleteResult);

      const result = await TeamDao.deleteAll();

      expect(TeamModel.deleteMany).toHaveBeenCalled();
      expect(result).toEqual(deleteResult);
    });

    it('should return result even if no teams deleted', async () => {
      const deleteResult = { deletedCount: 0 };
      TeamModel.deleteMany.mockResolvedValue(deleteResult);

      const result = await TeamDao.deleteAll();

      expect(TeamModel.deleteMany).toHaveBeenCalled();
      expect(result).toEqual(deleteResult);
    });
  });
});