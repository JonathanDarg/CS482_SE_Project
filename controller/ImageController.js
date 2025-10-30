const multer = require("multer");
const Image = require("../model/Image");

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Upload image
exports.uploadImage = [
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No image file uploaded" });

      const newImage = new Image({
        name: req.file.originalname,
        image: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      });

      await newImage.save();
      res.status(201).json({ message: "Image uploaded successfully", image: newImage });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload image" });
    }
  },
];

// Get all images
exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ _id: -1 }); // newest first
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

// Get single image by ID
exports.getImageById = async (req, res) => {
  try {
    const { imgId } = req.query;
    const image = await Image.findById(imgId);
    if (!image) return res.status(404).json({ error: "Image not found" });

    res.set("Content-Type", image.image.contentType);
    res.send(image.image.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};

// Delete an image by ID
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Image.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Image not found" });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete image" });
  }
};
