const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    const basename = path.basename(originalName, ext);
    // Replace spaces and special chars, append timestamp
    const safeName = basename.replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${safeName}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max per file
});

// @desc    Upload multiple product images
// @route   POST /api/upload/bulk
// @access  Private/Admin
router.post('/bulk', upload.array('images', 2000), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    
    const uploadedImages = req.files.map(file => {
      // Create a URL path to the file
      const imageUrl = `${baseUrl}/uploads/products/${file.filename}`;
      return {
        originalName: file.originalname,
        filename: file.filename,
        url: imageUrl,
      };
    });

    res.status(200).json({
      message: `${req.files.length} images uploaded successfully`,
      images: uploadedImages
    });
  } catch (error) {
    console.error('Error during bulk upload:', error);
    res.status(500).json({ message: 'Error uploading images' });
  }
});

// @desc    Serve local file by absolute path
// @route   GET /api/upload/local-image
// @access  Public
router.get('/local-image', (req, res) => {
  try {
    let imagePath = req.query.path;
    if (!imagePath) {
      return res.status(400).send('Path is required');
    }
    
    // Remove file:/// if present
    if (imagePath.startsWith('file:///')) {
      imagePath = imagePath.replace('file:///', '');
    }
    // Clean up windows path encoding if any
    imagePath = decodeURIComponent(imagePath);

    // Strip hidden characters like U+202A often inserted by Windows "Copy as path"
    imagePath = imagePath.replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, '').trim();

    if (fs.existsSync(imagePath)) {
      res.sendFile(path.resolve(imagePath));
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error serving local image:', error);
    res.status(500).send('Error serving image');
  }
});

module.exports = router;
