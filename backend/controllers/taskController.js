const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;
    let query = {};

    // Filter by organization
    if (req.user.role === 'admin') {
      // Admin sees all tasks they created
      query.createdBy = req.user._id;
    } else if (req.user.role === 'user') {
      // User sees tasks assigned to them from their organization
      query.assignedTo = req.user._id;
      // Also filter by organization's admin
      const adminId = req.user.organization;
      query.createdBy = adminId;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email profileImage')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email profileImage')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, attachments, todoList } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      attachments: attachments || [],
      todoList: todoList || []
    });

    await task.save();
    await task.populate('assignedTo', 'name email profileImage');
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo, attachments, todoList } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (assignedTo) task.assignedTo = assignedTo;
    if (attachments) task.attachments = attachments;
    if (todoList) task.todoList = todoList;

    await task.save();
    await task.populate('assignedTo', 'name email profileImage');
    await task.populate('createdBy', 'name email');

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status, todoList } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (todoList) task.todoList = todoList;
    if (status) task.status = status;

    await task.save();
    await task.populate('assignedTo', 'name email profileImage');
    await task.populate('createdBy', 'name email');

    res.json({
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    let query = {};
    
    // Filter by organization
    if (req.user.role === 'admin') {
      query.createdBy = req.user._id;
    } else if (req.user.role === 'user') {
      query.assignedTo = req.user._id;
      query.createdBy = req.user.organization;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email profileImage')
      .populate('createdBy', 'name email');

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;

    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;

    const recentTasks = tasks.slice(0, 5);

    res.json({
      summary: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks
      },
      priorityDistribution: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority
      },
      statusDistribution: {
        completed: completedTasks,
        inProgress: inProgressTasks,
        pending: pendingTasks
      },
      recentTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
