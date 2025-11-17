const controller = require('./EventController');
const dao = require('../model/EventDao');

// Mock the DAO methods
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

  // ---- CREATE Event ----
  describe('createEvent', () => {
    it('should create a new Event and return 201 with teams', async () => {
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

      expect(dao.createEvent).toHaveBeenCalledWith(fakeEvent);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeEvent);
    });

    it('should handle DAO errors', async () => {
      dao.createEvent.mockRejectedValue(new Error('DB error'));

      await controller.createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating Event' });
    });
  });

  // ---- GET ALL Events ----
  describe('getAllEvents', () => {
    it('should return all Events with teams', async () => {
      const Events = [
        { id: 1, homeTeam: { name: 'Lions' }, awayTeam: { name: 'Tigers' } },
        { id: 2, homeTeam: { name: 'Eagles' }, awayTeam: { name: 'Sharks' } }
      ];
      dao.getAllEvents.mockResolvedValue(Events);

      await controller.getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(Events);
    });

    it('should handle DAO errors', async () => {
      dao.getAllEvents.mockRejectedValue(new Error('DB error'));
      await controller.getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving Events' });
    });
  });

  // ---- GET ONE Event ----
  describe('getEvent', () => {
    it('should return one Event by id with teams', async () => {
      req.params.id = '1';
      const Event = {
        id: '1',
        location: 'Park',
        homeTeam: { name: 'Lions' },
        awayTeam: { name: 'Tigers' }
      };
      dao.readOneEvent.mockResolvedValue(Event);

      await controller.getEvent(req, res);

      expect(dao.readOneEvent).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(Event);
    });

    it('should return 404 if Event not found', async () => {
      req.params.id = '99';
      dao.readOneEvent.mockResolvedValue(null);

      await controller.getEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should handle DAO errors', async () => {
      dao.readOneEvent.mockRejectedValue(new Error('DB error'));
      await controller.getEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving Event' });
    });
  });

  // ---- UPDATE Event ----
  describe('updateEvent', () => {
    it('should update a Event with teams', async () => {
      req.params.id = '1';
      req.body = {
        rating: 4,
        homeTeam: { name: 'Lions' },
        awayTeam: { name: 'Tigers' }
      };
      const updated = {
        id: '1',
        rating: 4,
        homeTeam: { name: 'Lions' },
        awayTeam: { name: 'Tigers' }
      };
      dao.updateEvent.mockResolvedValue(updated);

      await controller.updateEvent(req, res);

      expect(dao.updateEvent).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should return 404 if Event not found', async () => {
      dao.updateEvent.mockResolvedValue(null);
      await controller.updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should handle DAO errors', async () => {
      dao.updateEvent.mockRejectedValue(new Error('DB error'));
      await controller.updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating Event' });
    });
  });

  // ---- DELETE Event ----
  describe('deleteEvent', () => {
    it('should delete a Event and return 204', async () => {
      req.params.id = '1';
      dao.deleteEvent.mockResolvedValue();

      await controller.deleteEvent(req, res);

      expect(dao.deleteEvent).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should handle DAO errors', async () => {
      dao.deleteEvent.mockRejectedValue(new Error('DB error'));
      await controller.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting Event' });
    });
  });

  // ---- GET BY MONTH ----
  describe('getByMonth', () => {
    it('should return Events for a given month and year', async () => {
      req.params = { month: '05', year: '2025' };
      const Events = [
        { id: 1, homeTeam: { name: 'Lions' }, awayTeam: { name: 'Tigers' } },
        { id: 2, homeTeam: { name: 'Eagles' }, awayTeam: { name: 'Sharks' } }
      ];
      dao.getByMonth.mockResolvedValue(Events);

      await controller.getByMonth(req, res);

      expect(dao.getByMonth).toHaveBeenCalledWith('05', '2025');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(Events);
    });

    it('should handle DAO errors', async () => {
      dao.getByMonth.mockRejectedValue(new Error('DB error'));
      await controller.getByMonth(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving Events by month' });
    });
  });
});
