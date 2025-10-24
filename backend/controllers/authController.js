const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, inviteCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    };

    // If user is signing up as regular user, require invite code
    if (userData.role === 'user') {
      if (!inviteCode) {
        return res.status(400).json({ message: 'Invite code required for user registration' });
      }

      // Find admin by invite code
      const admin = await User.findByInviteCode(inviteCode.toUpperCase());
      if (!admin) {
        return res.status(400).json({ message: 'Invalid invite code' });
      }

      // Link user to admin's organization
      userData.organization = admin._id.toString();
    }

    const user = new User(userData);

    // If admin, generate invite code
    if (user.role === 'admin') {
      user.generateInviteCode();
    }

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        inviteCode: user.inviteCode, // Return invite code for admins
        organization: user.organization
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        inviteCode: user.inviteCode,
        organization: user.organization
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    await User.findByIdAndUpdate(req.user._id, { profileImage: imageUrl });

    res.json({
      message: 'Profile image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
