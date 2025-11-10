// tests/ImageController.test.js
const controller = require("../controller/ImageController");
const dao = require("../model/ImageDao");

jest.mock("../model/ImageDao", () => ({
  createImage: jest.fn(),
  getAllImages: jest.fn(),
  getImageById: jest.fn(),
  deleteImage: jest.fn(),
}));

describe("ImageController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, file: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      set: jest.fn(),
    };
    jest.clearAllMocks();

    // suppress console.error in tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // --- uploadImage ---
  describe("uploadImage", () => {
    it("should upload an image successfully with is_minor=false", async () => {
      const fakeImage = { name: "Test", image: { data: Buffer.from("abc"), contentType: "image/png" }, is_minor: false };
      req.file = { originalname: "Test", buffer: Buffer.from("abc"), mimetype: "image/png" };
      req.body.is_minor = "false";

      dao.createImage.mockResolvedValue(fakeImage);

      await controller.uploadImage[1](req, res);

      expect(dao.createImage).toHaveBeenCalledWith("Test", Buffer.from("abc"), "image/png", false);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "Image uploaded successfully", image: fakeImage });
    });

    it("should upload an image successfully with is_minor=true", async () => {
      const fakeImage = { name: "Minor", image: { data: Buffer.from("abc"), contentType: "image/png" }, is_minor: true };
      req.file = { originalname: "Minor", buffer: Buffer.from("abc"), mimetype: "image/png" };
      req.body.is_minor = "true";

      dao.createImage.mockResolvedValue(fakeImage);

      await controller.uploadImage[1](req, res);

      expect(dao.createImage).toHaveBeenCalledWith("Minor", Buffer.from("abc"), "image/png", true);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "Image uploaded successfully", image: fakeImage });
    });

    it("should return 400 if no file uploaded", async () => {
      req.file = null;

      await controller.uploadImage[1](req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "No image file uploaded" });
    });

    it("should handle errors during upload", async () => {
      req.file = { originalname: "Fail", buffer: Buffer.from("abc"), mimetype: "image/png" };
      dao.createImage.mockRejectedValue(new Error("DB error"));

      await controller.uploadImage[1](req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to upload image" });
    });
  });

  // --- getImages ---
  describe("getImages", () => {
    it("should return all images", async () => {
      const images = [{ name: "A" }, { name: "B" }];
      dao.getAllImages.mockResolvedValue(images);

      await controller.getImages(req, res);

      expect(dao.getAllImages).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(images);
    });

    it("should handle errors fetching images", async () => {
      dao.getAllImages.mockRejectedValue(new Error("DB error"));

      await controller.getImages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch images" });
    });
  });

  // --- getImageById ---
  describe("getImageById", () => {
    it("should return an image by ID", async () => {
      req.params.id = "123";
      const image = { image: { data: Buffer.from("abc"), contentType: "image/png" } };
      dao.getImageById.mockResolvedValue(image);

      await controller.getImageById(req, res);

      expect(dao.getImageById).toHaveBeenCalledWith("123");
      expect(res.set).toHaveBeenCalledWith("Content-Type", "image/png");
      expect(res.send).toHaveBeenCalledWith(Buffer.from("abc"));
    });

    it("should return 404 if image not found", async () => {
      req.params.id = "999";
      dao.getImageById.mockResolvedValue(null);

      await controller.getImageById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Image not found" });
    });

    it("should handle errors fetching image", async () => {
      req.params.id = "123";
      dao.getImageById.mockRejectedValue(new Error("DB error"));

      await controller.getImageById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch image" });
    });
  });

  // --- deleteImage ---
  describe("deleteImage", () => {
    it("should delete an image successfully", async () => {
      req.params.id = "123";
      dao.deleteImage.mockResolvedValue({ _id: "123", name: "A" });

      await controller.deleteImage(req, res);

      expect(dao.deleteImage).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Image deleted successfully" });
    });

    it("should return 404 if image to delete not found", async () => {
      req.params.id = "999";
      dao.deleteImage.mockResolvedValue(null);

      await controller.deleteImage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Image not found" });
    });

    it("should handle errors deleting image", async () => {
      req.params.id = "123";
      dao.deleteImage.mockRejectedValue(new Error("DB error"));

      await controller.deleteImage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to delete image" });
    });
  });
});
