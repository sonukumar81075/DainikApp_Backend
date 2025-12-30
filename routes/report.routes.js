const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport
} = require('../controllers/report.controller');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.post('/', upload.single('image'), createReport);
router.get('/', getReports);
router.get('/:id', getReportById);
router.put('/:id', upload.single('image'), updateReport);
router.delete('/:id', deleteReport);

module.exports = router;

