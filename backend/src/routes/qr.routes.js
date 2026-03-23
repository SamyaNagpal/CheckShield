const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeQr } = require('../services/ml.service');

// Equivalent of: temp_file_path = f"temp_{file.filename}"
// multer saves the file to /uploads/ with its original name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `temp_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/analyze-qr', upload.single('file'), async (req, res) => {
  const tempPath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'No file uploaded' });
    }

    // Forward file to Python ML service
    const result = await analyzeQr(tempPath, req.file.originalname);

    // Equivalent of: os.remove(temp_file_path)
    fs.unlinkSync(tempPath);

    return res.json(result);

  } catch (err) {
    // Clean up temp file even on error
    if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    return res.status(500).json({ detail: err.message });
  }
});

module.exports = router;