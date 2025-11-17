const dbcon = require('./DbConnection');
const EventDao = require('./EventDao');

beforeAll(async function () {
    await dbcon.connect('test');
});

afterAll(async function () {
    await EventDao.deleteAll();
    await dbcon.disconnect();
});

beforeEach(async () => {
    await EventDao.deleteAll();
});

test('read all Events from empty DB', async function () {
    let Events = await EventDao.getAllEvents();
    expect(Events.length).toBe(0);
});

test('create one simple Event', async function () {
    let EventData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    };

    let Event = await EventDao.createEvent(EventData);

    expect(Event._id).toBeDefined();
    expect(Event.rating).toBe(5);
});

test('create one Event better test', async function () {
    let EventData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    };

    let Event = await EventDao.createEvent(EventData);
    let found = await EventDao.readOneEvent(Event._id);

    expect(Event._id).toBeDefined();
    expect(Event.rating).toBe(5);
    expect(Event._id.toString()).toEqual(found._id.toString());
    expect(Event.dateTime).toEqual(found.dateTime);
});

test('update one Event', async function () {

    let EventData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    };

    let Event = await EventDao.createEvent(EventData);

    let updatedData = {
        location: "Bob's House",
        dateTime: new Date('2024-08-01T15:00:00Z'),
        rating: 3,
        typeOfMatch: "Competitive",
        inning: 2,
        homeTeam: {},
        awayTeam: {}
    };

    let updatedEvent = await EventDao.updateEvent(Event._id, updatedData);
    expect(updatedEvent.location).toBe("Bob's House");
    expect(updatedEvent.rating).toBe(3);
});

test('create and delete one Event', async function () {

    let EventData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    };

    let Event = await EventDao.createEvent(EventData);
    let found = await EventDao.readOneEvent(Event._id);
    expect(found).not.toBeNull();

    await EventDao.deleteEvent(Event._id);
    let deleted = await EventDao.readOneEvent(Event._id);
    expect(deleted).toBeNull();
});

test('readAll with data', async function () {
    // Clear DB to avoid duplicates
    await EventDao.deleteAll();

    let EventData1 = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    };

    let EventData2 = {
        location: "Bob's House",
        dateTime: new Date('2024-08-01T15:00:00Z'),
        rating: 3,
        typeOfMatch: "Competitive",
        inning: 2,
        homeTeam: {},
        awayTeam: {}
    };

    let EventData3 = {
        location: "Alice's House",
        dateTime: new Date('2024-09-01T15:00:00Z'),
        rating: 4,
        typeOfMatch: "Tournament",
        inning: 3,
        homeTeam: {},
        awayTeam: {}
    };

    await EventDao.createEvent(EventData1);
    await EventDao.createEvent(EventData2);
    await EventDao.createEvent(EventData3);

    let Events = await EventDao.getAllEvents();
    expect(Events.length).toBe(3);
});

test('get Event by month', async function () {
    let EventData1 = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    };

    let EventData2 = {
        location: "Bob's House",
        dateTime: new Date('2024-08-01T15:00:00Z'),
        rating: 3,
        typeOfMatch: "Competitive",
        inning: 2,
        homeTeam: {},
        awayTeam: {}
    };

    let EventData3 = {
        location: "Alice's House",
        dateTime: new Date('2024-09-01T15:00:00Z'),
        rating: 4,
        typeOfMatch: "Tournament",
        inning: 3,
        homeTeam: {},
        awayTeam: {}
    };

    await EventDao.createEvent(EventData1);
    await EventDao.createEvent(EventData2);
    await EventDao.createEvent(EventData3);

    let Events = await EventDao.getByMonth(9, 2024);
    expect(Events.length).toBe(1);
    expect(Events[0].rating).toBe(4);
});

test('get next Event', async function () {
    let now = new Date();

    let pastEventData = {
        location: "Past Event",
        dateTime: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        rating: 2,
        typeOfMatch: "Past",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    };

    let futureEventData1 = {
        location: "Future Event 1",
        dateTime: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
        rating: 4,
        typeOfMatch: "Future",
        inning: 2,
        homeTeam: {},
        awayTeam: {}
    };

    let futureEventData2 = {
        location: "Future Event 2",
        dateTime: new Date(now.getFullYear(), now.getMonth() + 2, now.getDate()),
        rating: 5,
        typeOfMatch: "Future",
        inning: 3,
        homeTeam: {},
        awayTeam: {}
    };

    await EventDao.createEvent(pastEventData);
    await EventDao.createEvent(futureEventData2);
    await EventDao.createEvent(futureEventData1);

    let nextEvent = await EventDao.getNextEvent();
    expect(nextEvent.location).toBe("Future Event 1");
});

test('create Event with home and away team names and read them', async function () {
    let EventData = {
        location: "City Park",
        dateTime: new Date('2024-10-01T18:00:00Z'),
        rating: 4,
        typeOfMatch: "League",
        inning: 1,
        homeTeam: { name: "Lions" },
        awayTeam: { name: "Tigers" }
    };

    let saved = await EventDao.createEvent(EventData);
    let found = await EventDao.readOneEvent(saved._id);

    expect(found.homeTeam.name).toBe("Lions");
    expect(found.awayTeam.name).toBe("Tigers");
    expect(found.homeTeam.name).not.toBe(found.awayTeam.name);
});
