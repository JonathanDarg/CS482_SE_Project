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
    let events = await EventDao.getAllEvents();
    expect(events.length).toBe(0);
});

test('create one simple Event', async function () {
    let eventData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    };

    let event = await EventDao.createEvent(eventData);

    expect(event._id).toBeDefined();
    expect(event.rating).toBe(5);
});

test('create one Event better test', async function () {
    let eventData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    };

    let event = await EventDao.createEvent(eventData);
    let found = await EventDao.readOneEvent(event._id);

    expect(found).not.toBeNull();
    expect(event._id.toString()).toEqual(found._id.toString());
    expect(found.rating).toBe(5);
    expect(found.dateTime.toISOString()).toEqual(event.dateTime.toISOString());
});

test('update one Event', async function () {
    let eventData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    };

    let event = await EventDao.createEvent(eventData);

    let updatedData = {
        location: "Bob's House",
        dateTime: new Date('2024-08-01T15:00:00Z'),
        rating: 3,
        typeOfMatch: "Competitive",
        inning: 2,
        homeTeam: {},
        awayTeam: {}
    };

    let updatedEvent = await EventDao.updateEvent(event._id, updatedData);
    expect(updatedEvent.location).toBe("Bob's House");
    expect(updatedEvent.rating).toBe(3);
});

test('create and delete one Event', async function () {
    let eventData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    };

    let event = await EventDao.createEvent(eventData);
    let found = await EventDao.readOneEvent(event._id);
    expect(found).not.toBeNull();

    await EventDao.deleteEvent(event._id);
    let deleted = await EventDao.readOneEvent(event._id);
    expect(deleted).toBeNull();
});

test('readAll with data', async function () {
    await EventDao.deleteAll();

    await EventDao.createEvent({
        location: "A",
        dateTime: new Date(2024, 6, 1),
        rating: 5,
        typeOfMatch: "Friendly",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    });

    await EventDao.createEvent({
        location: "B",
        dateTime: new Date(2024, 7, 1),
        rating: 3,
        typeOfMatch: "Competitive",
        inning: 2,
        homeTeam: {},
        awayTeam: {}
    });

    await EventDao.createEvent({
        location: "C",
        dateTime: new Date(2024, 8, 1),
        rating: 4,
        typeOfMatch: "Tournament",
        inning: 3,
        homeTeam: {},
        awayTeam: {}
    });

    let events = await EventDao.getAllEvents();
    expect(events.length).toBe(3);
});

test('get Event by month', async function () {
    await EventDao.deleteAll();

    await EventDao.createEvent({
        location: "A",
        dateTime: new Date(2024, 6, 1),
        rating: 5,
        typeOfMatch: "Friendly",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    });

    await EventDao.createEvent({
        location: "B",
        dateTime: new Date(2024, 7, 1),
        rating: 3,
        typeOfMatch: "Competitive",
        inning: 2,
        homeTeam: {},
        awayTeam: {}
    });

    await EventDao.createEvent({
        location: "C",
        dateTime: new Date(2024, 8, 1),
        rating: 4,
        typeOfMatch: "Tournament",
        inning: 3,
        homeTeam: {},
        awayTeam: {}
    });

    let events = await EventDao.getByMonth(9, 2024);
    expect(events.length).toBe(1);
    expect(events[0].rating).toBe(4);
});

test('get next Event', async function () {
    let now = new Date();

    await EventDao.createEvent({
        location: "Past Event",
        dateTime: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        rating: 2,
        typeOfMatch: "Past",
        inning: 1,
        homeTeam: {},
        awayTeam: {}
    });

    await EventDao.createEvent({
        location: "Future Event 2",
        dateTime: new Date(now.getFullYear(), now.getMonth() + 2, now.getDate()),
        rating: 5,
        typeOfMatch: "Future",
        inning: 3,
        homeTeam: {},
        awayTeam: {}
    });

    await EventDao.createEvent({
        location: "Future Event 1",
        dateTime: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
        rating: 4,
        typeOfMatch: "Future",
        inning: 2,
        homeTeam: {},
        awayTeam: {}
    });

    let nextEvent = await EventDao.getNextEvent();
    expect(nextEvent.location).toBe("Future Event 1");
});

test('create Event with home and away team names and read them', async function () {
    let eventData = {
        location: "City Park",
        dateTime: new Date('2024-10-01T18:00:00Z'),
        rating: 4,
        typeOfMatch: "League",
        inning: 1,
        homeTeam: { name: "Lions" },
        awayTeam: { name: "Tigers" }
    };

    let saved = await EventDao.createEvent(eventData);
    let found = await EventDao.readOneEvent(saved._id);

    expect(found.homeTeam.name).toBe("Lions");
    expect(found.awayTeam.name).toBe("Tigers");
});
