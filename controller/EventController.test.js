const controller = require('./EventController');
const dao = require('../model/EventDao');

jest.mock('../model/EventDao');

describe('EventController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // CREATE
  describe('createEvent', () => {
    it('should create a new Event and return 201', async () => {
      const fakeEvent = {
        location: 'Park',
        dateTime: '2025-05-10T12:00',
        rating: 5,
        typeOfMatch: 'friendly',
        homeTeam: { name: 'Lions' },
        awayTeam: { name: 'Tigers' },
        inning: 1
      };

      req.body = fakeEvent;
      dao.createEvent.mockResolvedValue(fakeEvent);

      await controller.createEvent(req, res);

      expect(dao.createEvent).toHaveBeenCalledWith(expect.objectContaining(fakeEvent));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeEvent);
    });

    it('should default optional fields', async () => {
      const fakeEvent = {
        location: 'Stadium',
        dateTime: '2025-06-01T18:00',
        homeTeam: { name: 'Bears' },
        awayTeam: { name: 'Wolves' },
        rating: 4,
        typeOfMatch: 'tournament',
        inning: 2,
      };
      req.body = fakeEvent;
      dao.createEvent.mockResolvedValue({ ...fakeEvent, homeScore: 0, awayScore: 0, status: 'upcoming' });

      await controller.createEvent(req, res);

      expect(dao.createEvent).toHaveBeenCalledWith(expect.objectContaining({
        ...fakeEvent,
        homeScore: 0,
        awayScore: 0,
        status: 'upcoming'
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle errors', async () => {
      dao.createEvent.mockRejectedValue(new Error('DB error'));

      await controller.createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating Event' });
    });
  });

  // GET ALL
  describe('getAllEvents', () => {
    it('should return all Events', async () => {
      const events = [{ id: 1 }, { id: 2 }];
      dao.getAllEvents.mockResolvedValue(events);

      await controller.getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(events);
    });

    it('should handle errors', async () => {
      dao.getAllEvents.mockRejectedValue(new Error('DB error'));

      await controller.getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving Events' });
    });
  });

  // GET ONE
  describe('getEvent', () => {
    it('should return one Event', async () => {
      req.params.id = '123';
      const event = { id: '123' };

      dao.readOneEvent.mockResolvedValue(event);

      await controller.getEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(event);
    });

    it('should return 404 if event not found', async () => {
      req.params.id = '999';
      dao.readOneEvent.mockResolvedValue(null);

      await controller.getEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should handle errors', async () => {
      req.params.id = '123';
      dao.readOneEvent.mockRejectedValue(new Error('DB error'));

      await controller.getEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving Event' });
    });
  });

  // UPDATE
  describe('updateEvent', () => {
    it('should update an event', async () => {
      req.params.id = '1';
      req.body = { rating: 3 };
      const updated = { id: '1', rating: 3 };

      dao.updateEvent.mockResolvedValue(updated);

      await controller.updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should return 404 if event not found', async () => {
      req.params.id = '2';
      req.body = { rating: 4 };
      dao.updateEvent.mockResolvedValue(null);

      await controller.updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should handle errors', async () => {
      req.params.id = '1';
      req.body = { rating: 5 };
      dao.updateEvent.mockRejectedValue(new Error('DB error'));

      await controller.updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating Event' });
    });
  });

  // DELETE
  describe('deleteEvent', () => {
    it('should delete event', async () => {
      req.params.id = '1';
      dao.deleteEvent.mockResolvedValue();

      await controller.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      req.params.id = '1';
      dao.deleteEvent.mockRejectedValue(new Error('DB error'));

      await controller.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting Event' });
    });
  });

  // GET BY MONTH
  describe('getByMonth', () => {
    it('should return events for month', async () => {
      req.params = { month: '05', year: '2025' };
      const events = [{ id: 1 }];

      dao.getByMonth.mockResolvedValue(events);

      await controller.getByMonth(req, res);

      expect(dao.getByMonth).toHaveBeenCalledWith('05', '2025');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(events);
    });

    it('should handle errors', async () => {
      req.params = { month: '05', year: '2025' };
      dao.getByMonth.mockRejectedValue(new Error('DB error'));

      await controller.getByMonth(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving Events by month' });
    });
  });
});
