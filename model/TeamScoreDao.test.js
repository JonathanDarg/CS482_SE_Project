const dbcon = require('./DbConnection');
const TeamScoreDao = require('./TeamScoreDao');
const mongoose = require('mongoose');
const TeamDao = require('./TeamDao');
const EventDao = require('./EventDao');

beforeAll(function(){
    dbcon.connect('test');
});

afterAll(async function(){
    await TeamScoreDao.deleteAll();
    await dbcon.disconnect();
});

beforeEach(async function(){
    await TeamScoreDao.deleteAll();
     let TeamData = {
         teamName: "Testers",
         wins: 10,
         losses: 5
     };
     let team = await TeamDao.createTeam(TeamData);

     this.team = team;

     let EventData = {
         dateTime: "2024-07-01T10:00:00Z",
         location: "Test Field",
         rating: 5,
         typeOfMatch: "Friendly"
     };
     let game = await EventDao.createEvent(EventData);

     this.game = game;

});

afterEach(async function(){
    await TeamScoreDao.deleteAll();
});

test('read all TeamScores from empty DB', async function(){

    let TeamScores =  await TeamScoreDao.getAllTeamScores();
    expect(TeamScores.length).toBe(0);

});

test('create one simple TeamScore', async function(){

    let TeamScoreData = {
        teamId: this.team._id,
        score: 42,
        gameId: this.game._id,
        visiting: true,
        // teamId: new mongoose.Types.ObjectId(),
        // gameId: new mongoose.Types.ObjectId()
    };
    let TeamScore = await TeamScoreDao.createTeamScore(TeamScoreData);
    
    expect(TeamScore._id).toBeDefined();
    expect(TeamScore.teamId).toBe(TeamScoreData.teamId);
    expect(TeamScore.score).toBe(TeamScoreData.score);
    expect(TeamScore.gameId).toBe(TeamScoreData.gameId);
    expect(TeamScore.visiting).toBe(TeamScoreData.visiting);

});

test('read one TeamScore', async function(){

    let TeamScoreData = {
        teamId: this.team._id,
        score: 42,
        gameId: this.game._id,
        visiting: true,
    };
    let TeamScore = await TeamScoreDao.createTeamScore(TeamScoreData);

    let readTeamScore = await TeamScoreDao.readOneTeamScore(TeamScore._id);

    expect(readTeamScore._id.toString()).toBe(TeamScore._id.toString());
    expect(readTeamScore.teamId.toString()).toBe(TeamScoreData.teamId.toString());
    expect(readTeamScore.score).toBe(TeamScoreData.score);
    expect(readTeamScore.gameId.toString()).toBe(TeamScoreData.gameId.toString());
    expect(readTeamScore.visiting).toBe(TeamScoreData.visiting);
});

test('update one TeamScore', async function(){
    
    let TeamScoreData = {
        teamId: this.team._id,
        score: 42,
        gameId: this.game._id,
        visiting: true,
    };
    let TeamScore = await TeamScoreDao.createTeamScore(TeamScoreData);

    let updatedData = {
        teamId: this.team._id,
        score: 55,
        gameId: this.game._id,
        visiting: false,
    };

    let updatedTeamScore = await TeamScoreDao.updateTeamScore(TeamScore._id, updatedData);

    expect(updatedTeamScore._id.toString()).toBe(TeamScore._id.toString());
    expect(updatedTeamScore.teamId.toString()).toBe(updatedData.teamId.toString());
    expect(updatedTeamScore.score).toBe(updatedData.score);
    expect(updatedTeamScore.gameId.toString()).toBe(updatedData.gameId.toString());
    expect(updatedTeamScore.visiting).toBe(updatedData.visiting);
});

test('add home run to TeamScore', async function(){
    
    let TeamScoreData = {
        teamId: this.team._id,
        score: 3,
        gameId: this.game._id,
        visiting: false,
    };
    let TeamScore = await TeamScoreDao.createTeamScore(TeamScoreData);

    let updatedTeamScore = await TeamScoreDao.addHomeRun(TeamScore._id);

    expect(updatedTeamScore._id.toString()).toBe(TeamScore._id.toString());
    expect(updatedTeamScore.score).toBe(4); // Score should be incremented by 1
});