const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const { validateSignupInput } = require('../middleware/validate');
const authController = require('../controllers/authController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/signup', validateSignupInput, authController.signup);
router.post('/login', authController.login);
router.get('/me', auth, authController.getUserInfo);
router.post('/upload-profile-image', auth, upload.single('image'), authController.uploadProfileImage);

module.exports = router;
