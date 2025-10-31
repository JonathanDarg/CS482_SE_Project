const multer = require("multer");
const ImageDao = require("../model/ImageDao");

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Upload image
exports.uploadImage = [
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      const newImage = await ImageDao.createImage(
        req.file.originalname,
        req.file.buffer,
        req.file.mimetype
      );

      res.status(201).json({
        message: "Image uploaded successfully",
        image: newImage,
      });
    } catch (err) {
      console.error("Error uploading image:", err);
      res.status(500).json({ error: "Failed to upload image" });
    }
  },
];

// Get all images
exports.getImages = async (req, res) => {
  try {
    const images = await ImageDao.getAllImages();
    res.status(200).json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

// Get single image by ID
exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await ImageDao.getImageById(id);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set("Content-Type", image.image.contentType);
    res.send(image.image.data);
  } catch (err) {
    console.error("Error fetching image by ID:", err);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};

// Delete an image by ID
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ImageDao.deleteImage(id);

    if (!deleted) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
};
