const mongoose = require("mongoose");
const ImageDao = require("../model/ImageDao");

// Mock Mongoose
jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");

  // instance method
  const mockSave = jest.fn();

  // static methods
  const mockFind = jest.fn();
  const mockFindById = jest.fn();
  const mockFindByIdAndDelete = jest.fn();

  // mock constructor
  const mockModel = jest.fn(() => ({ save: mockSave }));

  // attach static methods to constructor
  mockModel.find = mockFind;
  mockModel.findById = mockFindById;
  mockModel.findByIdAndDelete = mockFindByIdAndDelete;

  return {
    ...actualMongoose,
    model: jest.fn(() => mockModel),
    Schema: actualMongoose.Schema,
    Types: actualMongoose.Types,
  };
});

describe("ImageDao", () => {
  const buffer = Buffer.from("abc");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // createImage
  it("should create and save a new image", async () => {
    const savedImage = { name: "Test Image", image: { data: buffer, contentType: "image/png" } };
    mongoose.model().mockImplementation(() => ({ save: jest.fn().mockResolvedValue(savedImage) }));

    const result = await ImageDao.createImage("Test Image", buffer, "image/png");

    expect(result).toEqual(savedImage);
  });

  it("should throw error if createImage fails", async () => {
    const error = new Error("DB error");
    mongoose.model().mockImplementation(() => ({ save: jest.fn().mockRejectedValue(error) }));

    await expect(ImageDao.createImage("Fail Image", buffer, "image/png")).rejects.toThrow("DB error");
  });

  // getAllImages
  it("should get all images", async () => {
    const images = [{ name: "A" }, { name: "B" }];
    mongoose.model().find.mockReturnValue({ sort: jest.fn().mockResolvedValue(images) });

    const result = await ImageDao.getAllImages();

    expect(result).toEqual(images);
  });

  it("should throw error if getAllImages fails", async () => {
    const error = new Error("DB error");
    mongoose.model().find.mockReturnValue({ sort: jest.fn().mockRejectedValue(error) });

    await expect(ImageDao.getAllImages()).rejects.toThrow("DB error");
  });

  // getImageById
  it("should get an image by ID", async () => {
    const image = { name: "C" };
    mongoose.model().findById.mockResolvedValue(image);

    const result = await ImageDao.getImageById("123");

    expect(result).toEqual(image);
    expect(mongoose.model().findById).toHaveBeenCalledWith("123");
  });

  it("should throw error if getImageById fails", async () => {
    const error = new Error("DB error");
    mongoose.model().findById.mockRejectedValue(error);

    await expect(ImageDao.getImageById("123")).rejects.toThrow("DB error");
  });

  // deleteImage
  it("should delete an image by ID", async () => {
    const deleted = { name: "ToDelete" };
    mongoose.model().findByIdAndDelete.mockResolvedValue(deleted);

    const result = await ImageDao.deleteImage("123");

    expect(result).toEqual(deleted);
    expect(mongoose.model().findByIdAndDelete).toHaveBeenCalledWith("123");
  });

  it("should throw error if deleteImage fails", async () => {
    const error = new Error("DB error");
    mongoose.model().findByIdAndDelete.mockRejectedValue(error);

    await expect(ImageDao.deleteImage("123")).rejects.toThrow("DB error");
  });
});
