const express = require('express');

const {
  login,
  signup,
  forgotPassword,
  resetPassword,
  changePassword,
} = require('../controllers/Auth.controller');
const signupValidation = require('../middlewares/signupValidation');
const router = express.Router();

// auth related routes
router.post('/signup', signupValidation, signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/change-password', changePassword);

module.exports = router;
