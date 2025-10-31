// tests/ImageController.test.js
const controller = require('../controller/ImageController');

jest.mock('../model/ImageDao', () => ({
  createImage: jest.fn(),
  getAllImages: jest.fn(),
  getImageById: jest.fn(),
  deleteImage: jest.fn(),
}));

const dao = require('../model/ImageDao');

describe('ImageController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, file: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      set: jest.fn(),
      end: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // ---- UPLOAD IMAGE ----
  describe('uploadImage', () => {
    it('should upload an image successfully', async () => {
      const fakeImage = { name: 'Test Image', image: { data: Buffer.from('abc'), contentType: 'image/png' } };
      req.file = { originalname: 'Test Image', buffer: Buffer.from('abc'), mimetype: 'image/png' };

      dao.createImage.mockResolvedValue(fakeImage);

      // Call the async middleware function (second in array)
      await controller.uploadImage[1](req, res);

      expect(dao.createImage).toHaveBeenCalledWith('Test Image', Buffer.from('abc'), 'image/png');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Image uploaded successfully',
        image: fakeImage,
      });
    });

    it('should return 400 if no file uploaded', async () => {
      req.file = null;

      await controller.uploadImage[1](req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No image file uploaded' });
    });

    it('should handle errors during upload', async () => {
      req.file = { originalname: 'Test Image', buffer: Buffer.from('abc'), mimetype: 'image/png' };
      dao.createImage.mockRejectedValue(new Error('DB error'));

      await controller.uploadImage[1](req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to upload image' });
    });
  });

  // ---- GET ALL IMAGES ----
  describe('getImages', () => {
    it('should return all images', async () => {
      const images = [{ name: 'A' }, { name: 'B' }];
      dao.getAllImages.mockResolvedValue(images);

      await controller.getImages(req, res);

      expect(dao.getAllImages).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(images);
    });

    it('should handle errors fetching images', async () => {
      dao.getAllImages.mockRejectedValue(new Error('DB error'));

      await controller.getImages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch images' });
    });
  });

  // ---- GET IMAGE BY ID ----
  describe('getImageById', () => {
    it('should return an image by ID', async () => {
      req.params.id = '123';
      const image = { image: { data: Buffer.from('abc'), contentType: 'image/png' } };
      dao.getImageById.mockResolvedValue(image);

      await controller.getImageById(req, res);

      expect(dao.getImageById).toHaveBeenCalledWith('123');
      expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/png');
      expect(res.send).toHaveBeenCalledWith(Buffer.from('abc'));
    });

    it('should return 404 if image not found', async () => {
      req.params.id = '999';
      dao.getImageById.mockResolvedValue(null);

      await controller.getImageById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Image not found' });
    });

    it('should handle errors fetching image', async () => {
      req.params.id = '123';
      dao.getImageById.mockRejectedValue(new Error('DB error'));

      await controller.getImageById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch image' });
    });
  });

  // ---- DELETE IMAGE ----
  describe('deleteImage', () => {
    it('should delete an image successfully', async () => {
      req.params.id = '123';
      dao.deleteImage.mockResolvedValue({ _id: '123', name: 'A' });

      await controller.deleteImage(req, res);

      expect(dao.deleteImage).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Image deleted successfully' });
    });

    it('should return 404 if image to delete not found', async () => {
      req.params.id = '999';
      dao.deleteImage.mockResolvedValue(null);

      await controller.deleteImage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Image not found' });
    });

    it('should handle errors deleting image', async () => {
      req.params.id = '123';
      dao.deleteImage.mockRejectedValue(new Error('DB error'));

      await controller.deleteImage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete image' });
    });
  });
});
