const validateTaskInput = (req, res, next) => {
  const { title, description, dueDate } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: 'Title is required' });
  }
  
  if (!description || description.trim().length === 0) {
    return res.status(400).json({ message: 'Description is required' });
  }
  
  if (!dueDate) {
    return res.status(400).json({ message: 'Due date is required' });
  }
  
  const date = new Date(dueDate);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ message: 'Invalid due date format' });
  }
  
  next();
};

const validateSignupInput = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Name is required' });
  }
  
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  next();
};

module.exports = { validateTaskInput, validateSignupInput };
