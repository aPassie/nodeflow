const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validateTaskInput } = require('../middleware/validate');
const taskController = require('../controllers/taskController');

router.get('/', auth, taskController.getAllTasks);
router.get('/dashboard', auth, taskController.getDashboardData);
router.get('/:id', auth, taskController.getTaskById);
router.post('/', auth, validateTaskInput, taskController.createTask);
router.put('/:id', auth, taskController.updateTask);
router.patch('/:id/status', auth, taskController.updateTaskStatus);
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;
