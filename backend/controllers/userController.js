const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    let query = {};
    
    // Admin sees users in their organization
    if (req.user.role === 'admin') {
      query = { organization: req.user._id.toString() };
    } else {
      // Regular users see other users in same organization
      query = { organization: req.user.organization };
    }
    
    const users = await User.find(query).select('-password');
    
    // Include the admin if user is viewing
    if (req.user.role === 'user') {
      const admin = await User.findById(req.user.organization).select('-password');
      if (admin) {
        users.unshift(admin); // Add admin at the beginning
      }
    }
    
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Only admins can delete users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete users' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the user belongs to the admin's organization
    if (user.organization !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete users from your organization' });
    }

    // Cannot delete admins
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
