const dbcon = require('./DbConnection');
const EventDao = require('./EventDao');

beforeAll(function(){
    dbcon.connect('test');
});

afterAll(async function(){
    await EventDao.deleteAll();
    await dbcon.disconnect();
});

beforeEach(async function(){
    await EventDao.deleteAll();
});

test('read all Events from empty DB', async function(){

    let Events =  await EventDao.getAllEvents();
    expect(Events.length).toBe(0);

});

test('create one simple Event', async function(){

    let EventData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly"
    };

    let Event = await EventDao.createEvent(EventData);

    expect(Event._id).toBeDefined();
    expect(Event.rating).toBe(5);
});

test('create one Event better test', async function(){

    let EventData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly"
    };

    let Event = await EventDao.createEvent(EventData);
    let found = await EventDao.readOneEvent(Event._id);

    expect(Event._id).toBeDefined();
    expect(Event.rating).toBe(5);

    expect(Event._id).toEqual(found._id);
    expect(Event.date).toEqual(found.date);

});

test('update one Event', async function(){
    
    let EventData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly"
    };

    let Event = await EventDao.createEvent(EventData);

    let updatedData = {
        location: "Bob's House",
        dateTime: new Date('2024-08-01T15:00:00Z'),
        rating: 3,
        typeOfMatch: "Competitive"
    };

    let updatedEvent = await EventDao.updateEvent(Event._id, updatedData);
    expect(updatedEvent.location).toBe("Bob's House");
    expect(updatedEvent.rating).toBe(3);
});

test('create and delete one Event', async function(){
    
    let EventData = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly"
    };

    let Event = await EventDao.createEvent(EventData);
    let found = await EventDao.readOneEvent(Event._id);
    expect(found).not.toBeNull();

    await EventDao.deleteEvent(Event._id);
    let deleted = await EventDao.readOneEvent(Event._id);
    expect(deleted).toBeNull();
});

test('readAll with data', async function(){

    let EventData1 = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly"
    };

    let EventData2 = {
        location: "Bob's House",
        dateTime: new Date('2024-08-01T15:00:00Z'),
        rating: 3,
        typeOfMatch: "Competitive"
    };

    let EventData3 = {
        location: "Alice's House",
        dateTime: new Date('2024-09-01T15:00:00Z'),
        rating: 4,
        typeOfMatch: "Tournament"
    };

    await EventDao.createEvent(EventData1);
    await EventDao.createEvent(EventData2);
    await EventDao.createEvent(EventData3);
    
    let Events =  await EventDao.getAllEvents();
    expect(Events.length).toBe(3);
});

test('get Event by month', async function(){

    let EventData1 = {
        location: "Stuart's House",
        dateTime: new Date('2024-07-01T15:00:00Z'),
        rating: 5,
        typeOfMatch: "Friendly"
    };

    let EventData2 = {
        location: "Bob's House",
        dateTime: new Date('2024-08-01T15:00:00Z'),
        rating: 3,
        typeOfMatch: "Competitive"
    };

    let EventData3 = {
        location: "Alice's House",
        dateTime: new Date('2024-09-01T15:00:00Z'),
        rating: 4,
        typeOfMatch: "Tournament"
    };

    await EventDao.createEvent(EventData1);
    await EventDao.createEvent(EventData2);
    await EventDao.createEvent(EventData3);
    
    let Events =  await EventDao.getByMonth(9, 2024);
    expect(Events.at(0).rating).toBe(4);
});

