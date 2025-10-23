const dbcon = require('./DbConnection');
const gameDao = require('./GameDao');

beforeAll(function(){
    dbcon.connect('test');
});

afterAll(async function(){
    await gameDao.deleteAll();
    await dbcon.disconnect();
});

beforeEach(async function(){
    await gameDao.deleteAll();
});

test('read all games from empty DB', async function(){

    let games =  await gameDao.getAllGames();
    expect(games.length).toBe(0);

});

test('create one simple game', async function(){

    let gameData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly"
    };

    let game = await gameDao.createGame(gameData);

    expect(game._id).toBeDefined();
    expect(game.rating).toBe(5);
});

test('create one game better test', async function(){

    let gameData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly"
    };

    let game = await gameDao.createGame(gameData);
    let found = await gameDao.readOneGame(game._id);

    expect(game._id).toBeDefined();
    expect(game.rating).toBe(5);

    expect(game._id).toEqual(found._id);
    expect(game.date).toEqual(found.date);

});

test('update one game', async function(){
    
    let gameData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly"
    };

    let game = await gameDao.createGame(gameData);

    let updatedData = {
        location: "Bob's House",
        dateTime: new Date('2024-08-01T15:00:00Z'),
        rating: 3,
        typeOfMatch: "Competitive"
    };

    let updatedGame = await gameDao.updateGame(game._id, updatedData);
    expect(updatedGame.location).toBe("Bob's House");
    expect(updatedGame.rating).toBe(3);
});

test('create and delete one game', async function(){
    
    let gameData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly"
    };

    let game = await gameDao.createGame(gameData);
    let found = await gameDao.readOneGame(game._id);
    expect(found).not.toBeNull();

    await gameDao.deleteGame(game._id);
    let deleted = await gameDao.readOneGame(game._id);
    expect(deleted).toBeNull();
});

test('readAll with data', async function(){

    let gameData1 = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly"
    };

    let gameData2 = {
        location: "Bob's House",
        dateTime: new Date('2024-08-01T15:00:00Z'),
        rating: 3,
        typeOfMatch: "Competitive"
    };

    let gameData3 = {
        location: "Alice's House",
        dateTime: new Date('2024-09-01T15:00:00Z'),
        rating: 4,
        typeOfMatch: "Tournament"
    };

    await gameDao.createGame(gameData1);
    await gameDao.createGame(gameData2);
    await gameDao.createGame(gameData3);
    
    let games =  await gameDao.getAllGames();
    expect(games.length).toBe(3);
});
