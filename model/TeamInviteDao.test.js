const mongoose = require("mongoose");
const TeamInviteDao = require("./TeamInviteDao");
const TeamDao = require("./TeamDao");

jest.mock("./TeamDao");

jest.mock("mongoose", () => {
  const actual = jest.requireActual("mongoose");

  // Model constructor
  function MockModel(data) {
    this.data = data;
  }

  // Static model functions
  MockModel.find = jest.fn();
  MockModel.findOne = jest.fn();
  MockModel.findById = jest.fn();
  MockModel.findByIdAndUpdate = jest.fn();
  MockModel.findByIdAndDelete = jest.fn();
  MockModel.updateMany = jest.fn();

  return {
    ...actual,
    model: jest.fn(() => MockModel),
    Schema: actual.Schema,
    Types: actual.Types,
  };
});

// Chainable populate and sort mock
const createPopulateChain = (result) => {
  const promiseChain = Promise.resolve(result);
  const chain = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnValue(promiseChain),
    then: promiseChain.then.bind(promiseChain),
    catch: promiseChain.catch.bind(promiseChain)
  };
  return chain;
};

describe("TeamInviteDao", () => {
  let TeamInviteModel;

  beforeAll(() => {
    TeamInviteModel = mongoose.model();
  });

  beforeEach(() => jest.clearAllMocks());

  afterEach(() => {
    if (TeamInviteModel && TeamInviteModel.prototype && TeamInviteModel.prototype.save && TeamInviteModel.prototype.save._isMockFunction) {
      delete TeamInviteModel.prototype.save;
    }
  });

  // createInvite
  describe("createInvite", () => {
    it("should create a new invite when no pending invite exists", async () => {
      const teamId = new mongoose.Types.ObjectId();
      const managerId = new mongoose.Types.ObjectId();
      const playerId = new mongoose.Types.ObjectId();
      const savedInvite = { _id: "123", teamId, managerId, playerId, status: "pending" };

      TeamInviteModel.findOne.mockResolvedValue(null);
      TeamInviteModel.prototype.save = jest.fn().mockResolvedValue(savedInvite);

      const result = await TeamInviteDao.createInvite(teamId, managerId, playerId);

      expect(TeamInviteModel.findOne).toHaveBeenCalledWith({
        teamId,
        playerId,
        status: 'pending'
      });
      expect(result).toEqual(savedInvite);
    });

    it("should throw error when pending invite already exists", async () => {
      const teamId = new mongoose.Types.ObjectId();
      const managerId = new mongoose.Types.ObjectId();
      const playerId = new mongoose.Types.ObjectId();
      const existingInvite = { _id: "existing", teamId, managerId, playerId, status: "pending" };

      TeamInviteModel.findOne.mockResolvedValue(existingInvite);

      await expect(TeamInviteDao.createInvite(teamId, managerId, playerId))
        .rejects.toThrow("An invite for this player already exists");

      expect(TeamInviteModel.findOne).toHaveBeenCalledWith({
        teamId,
        playerId,
        status: 'pending'
      });
    });

    it("should handle database errors during save", async () => {
      const teamId = new mongoose.Types.ObjectId();
      const managerId = new mongoose.Types.ObjectId();
      const playerId = new mongoose.Types.ObjectId();
      const dbError = new Error("DB error");

      TeamInviteModel.findOne.mockResolvedValue(null);
      TeamInviteModel.prototype.save = jest.fn().mockRejectedValue(dbError);

      await expect(TeamInviteDao.createInvite(teamId, managerId, playerId))
        .rejects.toThrow("DB error");
    });
  });

  // getInvitesByPlayer
  describe("getInvitesByPlayer", () => {
    it("should return all pending invites for a player with populated data", async () => {
      const playerId = new mongoose.Types.ObjectId();
      const invites = [
        { _id: "1", playerId, status: "pending", teamId: { teamName: "Team A" }, managerId: { name: "Manager1" } },
        { _id: "2", playerId, status: "pending", teamId: { teamName: "Team B" }, managerId: { name: "Manager2" } }
      ];

      const chain = createPopulateChain(invites);
      TeamInviteModel.find.mockReturnValue(chain);

      const result = await TeamInviteDao.getInvitesByPlayer(playerId);

      expect(TeamInviteModel.find).toHaveBeenCalledWith({ playerId, status: 'pending' });
      expect(chain.populate).toHaveBeenCalledWith('teamId', 'teamName');
      expect(chain.populate).toHaveBeenCalledWith('managerId', 'name email');
      expect(result).toEqual(invites);
    });

    it("should return empty array when no pending invites exist", async () => {
      const playerId = new mongoose.Types.ObjectId();
      const chain = createPopulateChain([]);
      TeamInviteModel.find.mockReturnValue(chain);

      const result = await TeamInviteDao.getInvitesByPlayer(playerId);

      expect(result).toEqual([]);
    });
  });

  // getInvitesByTeam
  describe("getInvitesByTeam", () => {
    it("should return all invites for a team with populated data", async () => {
      const teamId = new mongoose.Types.ObjectId();
      const invites = [
        { _id: "1", teamId, status: "pending", playerId: { name: "Player1" }, managerId: { name: "Manager1" } },
        { _id: "2", teamId, status: "accepted", playerId: { name: "Player2" }, managerId: { name: "Manager1" } },
        { _id: "3", teamId, status: "rejected", playerId: { name: "Player3" }, managerId: { name: "Manager1" } }
      ];

      const chain = createPopulateChain(invites);
      TeamInviteModel.find.mockReturnValue(chain);

      const result = await TeamInviteDao.getInvitesByTeam(teamId);

      expect(TeamInviteModel.find).toHaveBeenCalledWith({ teamId });
      expect(chain.populate).toHaveBeenCalledWith('playerId', 'name email role');
      expect(chain.populate).toHaveBeenCalledWith('managerId', 'name email');
      expect(result).toEqual(invites);
    });

    it("should return empty array when no invites exist for team", async () => {
      const teamId = new mongoose.Types.ObjectId();
      const chain = createPopulateChain([]);
      TeamInviteModel.find.mockReturnValue(chain);

      const result = await TeamInviteDao.getInvitesByTeam(teamId);

      expect(result).toEqual([]);
    });
  });

  // getInviteById
  describe("getInviteById", () => {
    it("should return invite with all populated fields", async () => {
      const inviteId = new mongoose.Types.ObjectId();
      const invite = {
        _id: inviteId,
        status: "pending",
        teamId: { teamName: "Team A", players: [] },
        managerId: { name: "Manager1", email: "m@test.com" },
        playerId: { name: "Player1", email: "p@test.com" }
      };

      const chain = createPopulateChain(invite);
      TeamInviteModel.findById.mockReturnValue(chain);

      const result = await TeamInviteDao.getInviteById(inviteId);

      expect(TeamInviteModel.findById).toHaveBeenCalledWith(inviteId);
      expect(chain.populate).toHaveBeenCalledWith('teamId', 'teamName players');
      expect(chain.populate).toHaveBeenCalledWith('managerId', 'name email');
      expect(chain.populate).toHaveBeenCalledWith('playerId', 'name email');
      expect(result).toEqual(invite);
    });

    it("should return null when invite not found", async () => {
      const inviteId = new mongoose.Types.ObjectId();
      const chain = createPopulateChain(null);
      TeamInviteModel.findById.mockReturnValue(chain);

      const result = await TeamInviteDao.getInviteById(inviteId);

      expect(result).toBeNull();
    });
  });

  // updateInviteStatus
  describe("updateInviteStatus", () => {
    it("should update invite status to accepted", async () => {
      const inviteId = new mongoose.Types.ObjectId();
      const updatedInvite = {
        _id: inviteId,
        status: "accepted",
        teamId: { teamName: "Team A" },
        managerId: { name: "Manager1" },
        playerId: { name: "Player1" }
      };

      const chain = createPopulateChain(updatedInvite);
      TeamInviteModel.findByIdAndUpdate.mockReturnValue(chain);

      const result = await TeamInviteDao.updateInviteStatus(inviteId, "accepted");

      expect(TeamInviteModel.findByIdAndUpdate).toHaveBeenCalledWith(
        inviteId,
        { status: "accepted" },
        { new: true }
      );
      expect(result).toEqual(updatedInvite);
    });

    it("should update invite status to rejected", async () => {
      const inviteId = new mongoose.Types.ObjectId();
      const updatedInvite = {
        _id: inviteId,
        status: "rejected",
        teamId: { teamName: "Team A" },
        managerId: { name: "Manager1" },
        playerId: { name: "Player1" }
      };

      const chain = createPopulateChain(updatedInvite);
      TeamInviteModel.findByIdAndUpdate.mockReturnValue(chain);

      const result = await TeamInviteDao.updateInviteStatus(inviteId, "rejected");

      expect(TeamInviteModel.findByIdAndUpdate).toHaveBeenCalledWith(
        inviteId,
        { status: "rejected" },
        { new: true }
      );
      expect(result).toEqual(updatedInvite);
    });

    it("should return null when invite not found", async () => {
      const inviteId = new mongoose.Types.ObjectId();
      const chain = createPopulateChain(null);
      TeamInviteModel.findByIdAndUpdate.mockReturnValue(chain);

      const result = await TeamInviteDao.updateInviteStatus(inviteId, "accepted");

      expect(result).toBeNull();
    });
  });

  // getTeamPlayerCount
  describe("getTeamPlayerCount", () => {
    it("should return the number of players on a team", async () => {
      const teamId = new mongoose.Types.ObjectId();
      const team = {
        _id: teamId,
        teamName: "Team A",
        players: ["player1", "player2", "player3"]
      };

      TeamDao.readOneTeam.mockResolvedValue(team);

      const result = await TeamInviteDao.getTeamPlayerCount(teamId);

      expect(TeamDao.readOneTeam).toHaveBeenCalledWith(teamId);
      expect(result).toBe(3);
    });

    it("should return 0 when team has no players", async () => {
      const teamId = new mongoose.Types.ObjectId();
      const team = {
        _id: teamId,
        teamName: "Team B",
        players: []
      };

      TeamDao.readOneTeam.mockResolvedValue(team);

      const result = await TeamInviteDao.getTeamPlayerCount(teamId);

      expect(result).toBe(0);
    });

    it("should return 0 when team not found", async () => {
      const teamId = new mongoose.Types.ObjectId();
      TeamDao.readOneTeam.mockResolvedValue(null);

      const result = await TeamInviteDao.getTeamPlayerCount(teamId);

      expect(result).toBe(0);
    });
  });

  // deleteInvite
  describe("deleteInvite", () => {
    it("should delete an invite by ID", async () => {
      const inviteId = new mongoose.Types.ObjectId();
      const deletedInvite = { _id: inviteId, status: "pending" };

      TeamInviteModel.findByIdAndDelete.mockResolvedValue(deletedInvite);

      const result = await TeamInviteDao.deleteInvite(inviteId);

      expect(TeamInviteModel.findByIdAndDelete).toHaveBeenCalledWith(inviteId);
      expect(result).toEqual(deletedInvite);
    });

    it("should return null when invite not found", async () => {
      const inviteId = new mongoose.Types.ObjectId();
      TeamInviteModel.findByIdAndDelete.mockResolvedValue(null);

      const result = await TeamInviteDao.deleteInvite(inviteId);

      expect(result).toBeNull();
    });
  });

  // cancelPlayerInvites
  describe("cancelPlayerInvites", () => {
    it("should cancel all pending invites for a player", async () => {
      const playerId = new mongoose.Types.ObjectId();
      const updateResult = { nModified: 2 };

      TeamInviteModel.updateMany.mockResolvedValue(updateResult);

      const result = await TeamInviteDao.cancelPlayerInvites(playerId);

      expect(TeamInviteModel.updateMany).toHaveBeenCalledWith(
        { playerId, status: 'pending' },
        { status: 'rejected' }
      );
      expect(result).toEqual(updateResult);
    });

    it("should cancel all pending invites except the excluded one", async () => {
      const playerId = new mongoose.Types.ObjectId();
      const excludeInviteId = new mongoose.Types.ObjectId();
      const updateResult = { nModified: 1 };

      TeamInviteModel.updateMany.mockResolvedValue(updateResult);

      const result = await TeamInviteDao.cancelPlayerInvites(playerId, excludeInviteId);

      expect(TeamInviteModel.updateMany).toHaveBeenCalledWith(
        { playerId, status: 'pending', _id: { $ne: excludeInviteId } },
        { status: 'rejected' }
      );
      expect(result).toEqual(updateResult);
    });

    it("should handle when no invites need to be cancelled", async () => {
      const playerId = new mongoose.Types.ObjectId();
      const updateResult = { nModified: 0 };

      TeamInviteModel.updateMany.mockResolvedValue(updateResult);

      const result = await TeamInviteDao.cancelPlayerInvites(playerId);

      expect(result).toEqual(updateResult);
    });
  });
});
