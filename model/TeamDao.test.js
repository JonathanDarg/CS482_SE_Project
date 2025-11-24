const mongoose = require("mongoose");
const TeamDao = require("./TeamDao");

jest.mock("mongoose", () => {
  const actual = jest.requireActual("mongoose");

  // Model constructor
  function MockModel(data) {
    this.data = data;
    // Do not assign `save` on the instance so tests can mock
    // `TeamModel.prototype.save` and have DAO instances use it.
  }

  // Static model functions
  MockModel.find = jest.fn();
  MockModel.findById = jest.fn();
  MockModel.findByIdAndUpdate = jest.fn();
  MockModel.findByIdAndDelete = jest.fn();
  MockModel.deleteMany = jest.fn();

  return {
    ...actual,
    model: jest.fn(() => MockModel),
    Schema: actual.Schema,
    Types: actual.Types,
  };
});

// Chainable populate mock
const createPopulateChain = (result) => {
  const chain = { _calls: 0 };
  chain.populate = jest.fn().mockImplementation(() => {
    chain._calls += 1;
    if (chain._calls < 2) return chain;
    return Promise.resolve(result);
  });
  return chain;
};

describe("TeamDao", () => {
  let TeamModel;

  beforeAll(() => {
    TeamModel = mongoose.model();
  });

  beforeEach(() => jest.clearAllMocks());

  afterEach(() => {
    if (TeamModel && TeamModel.prototype && TeamModel.prototype.save && TeamModel.prototype.save._isMockFunction) {
      delete TeamModel.prototype.save;
    }
  });
  // createTeam
  describe("createTeam", () => {
    it("creates and saves a team with objectId references", async () => {
      const teamData = {
        teamName: "Lions",
        manager: "507f1f77bcf86cd799439011",
        players: [
          "507f1f77bcf86cd799439012",
          "507f1f77bcf86cd799439013",
        ],
      };

      const savedTeam = { ...teamData, _id: "123" };

      // mock save on the prototype so any new instance created by the DAO
      // will use this mocked save implementation
      TeamModel.prototype.save = jest.fn().mockResolvedValue(savedTeam);

      const result = await TeamDao.createTeam(teamData);

      expect(TeamModel.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(savedTeam);
    });

    it("creates team with null manager and empty players", async () => {
      const teamData = { teamName: "Tigers", manager: null, players: [] };
      const savedTeam = { ...teamData, _id: "456" };

      TeamModel.prototype.save = jest.fn().mockResolvedValue(savedTeam);

      const result = await TeamDao.createTeam(teamData);

      expect(TeamModel.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(savedTeam);
    });
  });

  // getAllTeams
  describe("getAllTeams", () => {
    it("returns all teams with populated manager and players", async () => {
      const teams = [
        {
          teamName: "Lions",
          manager: { _id: "1", name: "John", email: "john@test.com" },
          players: [
            { _id: "2", name: "P1", email: "p1@test.com" },
            { _id: "3", name: "P2", email: "p2@test.com" },
          ],
        },
      ];

      const chain = createPopulateChain(teams);
      TeamModel.find.mockReturnValue(chain);

      const result = await TeamDao.getAllTeams();

      expect(TeamModel.find).toHaveBeenCalled();
      expect(chain.populate).toHaveBeenCalledTimes(2);
      expect(chain.populate).toHaveBeenNthCalledWith(1, "manager", "name email");
      expect(chain.populate).toHaveBeenNthCalledWith(2, "players", "name email");
      expect(result).toEqual(teams);
    });

    it("returns empty array when no teams exist", async () => {
      const chain = createPopulateChain([]);
      TeamModel.find.mockReturnValue(chain);

      const result = await TeamDao.getAllTeams();

      expect(result).toEqual([]);
    });
  });

  // readOneTeam
  describe("readOneTeam", () => {
    it("returns populated team", async () => {
      const team = {
        _id: "1",
        teamName: "Lions",
        manager: { _id: "1", name: "John", email: "john@test.com" },
        players: [{ _id: "2", name: "P1", email: "p1@test.com" }],
      };

      const chain = createPopulateChain(team);
      TeamModel.findById.mockReturnValue(chain);

      const result = await TeamDao.readOneTeam("1");

      expect(TeamModel.findById).toHaveBeenCalledWith("1");
      expect(chain.populate).toHaveBeenCalledTimes(2);
      expect(result).toEqual(team);
    });

    it("returns null when not found", async () => {
      const chain = createPopulateChain(null);
      TeamModel.findById.mockReturnValue(chain);

      const result = await TeamDao.readOneTeam("999");

      expect(result).toBeNull();
    });
  });

  // updateTeam
  describe("updateTeam", () => {
    it("updates team and returns populated result", async () => {
      const updatedTeam = {
        _id: "1",
        teamName: "Updated",
        manager: { _id: "1", name: "John", email: "john@test.com" },
        players: [],
      };

      const chain = createPopulateChain(updatedTeam);
      TeamModel.findByIdAndUpdate.mockReturnValue(chain);

      const data = { teamName: "Updated" };

      const result = await TeamDao.updateTeam("1", data);

      expect(TeamModel.findByIdAndUpdate).toHaveBeenCalledWith("1", data, { new: true });
      expect(chain.populate).toHaveBeenCalledTimes(2);
      expect(result).toEqual(updatedTeam);
    });

    it("returns null when team does not exist", async () => {
      const chain = createPopulateChain(null);
      TeamModel.findByIdAndUpdate.mockReturnValue(chain);

      const result = await TeamDao.updateTeam("999", { teamName: "Updated" });

      expect(result).toBeNull();
    });
  });

  // deleteTeam
  describe("deleteTeam", () => {
    it("deletes team", async () => {
      const deleted = { _id: "1" };

      TeamModel.findByIdAndDelete.mockResolvedValue(deleted);

      const result = await TeamDao.deleteTeam("1");
      expect(result).toEqual(deleted);
    });

    it("returns null when not found", async () => {
      TeamModel.findByIdAndDelete.mockResolvedValue(null);

      const result = await TeamDao.deleteTeam("999");
      expect(result).toBeNull();
    });
  });

  // deleteAll
  describe("deleteAll", () => {
    it("deletes all teams", async () => {
      const res = { deletedCount: 5 };
      TeamModel.deleteMany.mockResolvedValue(res);

      const result = await TeamDao.deleteAll();
      expect(result).toEqual(res);
    });

    it("handles deleting zero", async () => {
      const res = { deletedCount: 0 };
      TeamModel.deleteMany.mockResolvedValue(res);

      const result = await TeamDao.deleteAll();
      expect(result).toEqual(res);
    });
  });
});
