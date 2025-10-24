const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

router.get('/user-tasks', auth, reportController.downloadUserTasksReport);
router.get('/detailed-tasks', auth, reportController.downloadDetailedTaskReport);

module.exports = router;
