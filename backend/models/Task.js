const mongoose = require('mongoose');

const todoItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attachments: [{
    name: String,
    url: String
  }],
  todoList: [todoItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  if (this.todoList && this.todoList.length > 0) {
    const completedTodos = this.todoList.filter(todo => todo.completed).length;
    const totalTodos = this.todoList.length;
    
    if (completedTodos === totalTodos) {
      this.status = 'completed';
    } else if (completedTodos > 0) {
      this.status = 'in-progress';
    }
  }
  
  next();
});

module.exports = mongoose.model('Task', taskSchema);
