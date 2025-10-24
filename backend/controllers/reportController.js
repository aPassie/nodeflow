const Task = require('../models/Task');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

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

exports.downloadPDF = async (req, res) => {
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
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks-report.pdf');
    
    doc.pipe(res);

    // Title
    doc.fontSize(20).text('Tasks Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Tasks
    tasks.forEach((task, index) => {
      if (index > 0) doc.moveDown();
      
      doc.fontSize(14).text(`${index + 1}. ${task.title}`, { underline: true });
      doc.fontSize(10);
      doc.text(`Priority: ${task.priority.toUpperCase()}`);
      doc.text(`Status: ${task.status}`);
      doc.text(`Due Date: ${new Date(task.dueDate).toLocaleDateString()}`);
      doc.text(`Assigned To: ${task.assignedTo.map(u => u.name).join(', ')}`);
      doc.text(`Created By: ${task.createdBy.name}`);
      
      if (task.todoList.length > 0) {
        const completed = task.todoList.filter(t => t.completed).length;
        doc.text(`Progress: ${completed}/${task.todoList.length} todos completed`);
      }
      
      // Add page break if needed
      if (doc.y > 700) doc.addPage();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.downloadExcel = async (req, res) => {
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
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tasks Report');

    // Define columns
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Priority', key: 'priority', width: 10 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Due Date', key: 'dueDate', width: 15 },
      { header: 'Assigned To', key: 'assignedTo', width: 30 },
      { header: 'Created By', key: 'createdBy', width: 20 },
      { header: 'Progress', key: 'progress', width: 15 }
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }
    };

    // Add data
    tasks.forEach(task => {
      const completed = task.todoList.filter(t => t.completed).length;
      const total = task.todoList.length;
      
      worksheet.addRow({
        title: task.title,
        description: task.description,
        priority: task.priority.toUpperCase(),
        status: task.status,
        dueDate: new Date(task.dueDate).toLocaleDateString(),
        assignedTo: task.assignedTo.map(u => u.name).join(', '),
        createdBy: task.createdBy.name,
        progress: total > 0 ? `${completed}/${total}` : 'N/A'
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks-report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
