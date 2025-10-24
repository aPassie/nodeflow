const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

router.get('/pdf', auth, reportController.downloadPDF);
router.get('/excel', auth, reportController.downloadExcel);

module.exports = router;
