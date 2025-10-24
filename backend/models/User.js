const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  organization: {
    type: String,
    required: function() {
      return this.role === 'user';
    }
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true // Only admins have invite codes
  },
  profileImage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique invite code for admin
userSchema.methods.generateInviteCode = function() {
  this.inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  return this.inviteCode;
};

// Static method to find admin by invite code
userSchema.statics.findByInviteCode = function(code) {
  return this.findOne({ inviteCode: code, role: 'admin' });
};

module.exports = mongoose.model('User', userSchema);
