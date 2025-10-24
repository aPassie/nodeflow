const Task = require('../models/Task');
const User = require('../models/User');

exports.downloadUserTasksReport = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    const reportData = users.map(user => {
      const userTasks = tasks.filter(task => 
        task.assignedTo.some(assignedUser => assignedUser._id.toString() === user._id.toString())
      );

      return {
        userName: user.name,
        email: user.email,
        totalTasks: userTasks.length,
        completedTasks: userTasks.filter(t => t.status === 'completed').length,
        inProgressTasks: userTasks.filter(t => t.status === 'in-progress').length,
        pendingTasks: userTasks.filter(t => t.status === 'pending').length
      };
    });

    res.json({ reportData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.downloadDetailedTaskReport = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    const reportData = tasks.map(task => ({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo.map(u => u.name).join(', '),
      createdBy: task.createdBy.name,
      createdAt: task.createdAt,
      completionPercentage: task.todoList.length > 0 
        ? Math.round((task.todoList.filter(todo => todo.completed).length / task.todoList.length) * 100)
        : 0
    }));

    res.json({ reportData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
