const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  name: { type: String },
  image: {
    data: Buffer,
    contentType: String,
  },
  is_minor: { type: Boolean, default: false }, 
});

const ImageModel = mongoose.model("Image", ImageSchema);

// Create and save a new image
exports.createImage = async (name, fileBuffer, mimeType, is_minor = false) => {
  try {
    const newImage = new ImageModel({
      name,
      image: {
        data: fileBuffer,
        contentType: mimeType,
      },
      is_minor,
    });
    const savedImage = await newImage.save();
    return savedImage;
  } catch (err) {
    console.error("Error creating image:", err);
    throw err;
  }
};

// Get all images (sorted by newest first)
exports.getAllImages = async () => {
  try {
    const images = await ImageModel.find().sort({ _id: -1 });
    return images;
  } catch (err) {
    console.error("Error fetching images:", err);
    throw err;
  }
};

// Get an image by its ID
exports.getImageById = async (id) => {
  try {
    const image = await ImageModel.findById(id);
    return image;
  } catch (err) {
    console.error("Error fetching image by ID:", err);
    throw err;
  }
};

// Delete an image by its ID
exports.deleteImage = async (id) => {
  try {
    const deletedImage = await ImageModel.findByIdAndDelete(id);
    return deletedImage;
  } catch (err) {
    console.error("Error deleting image:", err);
    throw err;
  }
};
