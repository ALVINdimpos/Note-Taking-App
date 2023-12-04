const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { Role } = require('../models');
const Sequelize = require('sequelize');
const logger = require('../utils/logger/index');
const sendPasswordResetEmail = require('../utils/sendPasswordResetEmail');
const { check, validationResult } = require('express-validator');
const { validateEmail, validatePassword } = require('../utils/validation');
const loginValidation = [
  check('email').isEmail().withMessage('Invalid email address'),
  check('password').notEmpty().withMessage('Password is required'),
];
const signup = async (req, res) => {
  // Validate request body fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(`Adding User: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ ok: false, errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;
  // email validation
  if (!validateEmail(email)) {
    logger.error(
      `Adding User: Invalid email address: ${email}, should follow the following partner xxx@xxx.xxx`
    );
    return res.status(400).json({
      ok: false,
      message: 'Invalid credentials',
      info: 'The email should follow the following partner xxx@xxx.xxx',
    });
  }

  if (!validatePassword(password)) {
    logger.error(
      `Adding User: Invalid password: ${password}, must be at least 4 characters long and contain at least one capital letter and one digit`
    );
    return res.status(400).json({
      ok: false,
      message: 'Invalid credentials',
      info: 'Password must be at least 4 characters long and contain at least one capital letter and one digit',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if the user with the provided email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    logger.error(`Adding User: User with this email: ${email} already exists.`);
    return res.status(409).json({
      ok: false,
      message: `User with this email: ${email} already exists.`,
    });
  }
  // Create the user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    ok: true,
    message: 'User successfully added',
    data: user,
  });
};
const login = async (req, res) => {
  // Validate the request
  await Promise.all(loginValidation.map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(`Login User: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    logger.error(`Login User: User with this email: ${email} not found`);
    return res.status(404).json({ error: 'User not found' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    logger.error(
      `Login User: User with this email: ${email} entered a wrong password`
    );
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      roleId: user.roleId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

  res.cookie('authorization', token, {
    maxAge: 24 * 60 * 60 * 1000, // Cookie expires after one day
    httpOnly: true,
    domain: 'localhost', // Set to your domain
    path: '/',
  });

  res.status(200).json({
    ok: true,
    message: 'User logged in successfully',
    userFistName: user.firstName,
    userLastName: user.lastName,
    userRole: user.roleId,
    token,
  });
};
// Controller for initiating the password reset process
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Find the user by email
  const user = await User.findOne({ where: { email } });

  if (!user) {
    logger.error(`Forgot Password: User with this email: ${email} not found`);
    return res.status(404).json({
      error: 'User not found',
    });
  }

  // Generate a unique token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Associate the token with the user and set an expiration time
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save();

  // Send an email to the user with a link containing the reset token
  sendPasswordResetEmail(user.email, resetToken);

  res.status(200).json({ message: 'Password reset email sent' });
};
// Controller for resetting the password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Find the user by the reset token
  const user = await User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [Sequelize.Op.gte]: Date.now() },
    },
  });

  if (!user) {
    logger.error(`Reset Password: Invalid or expired reset token: ${token}`);
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  // Set the new password and clear the reset token
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
};
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { userId } = req;

  // Find the user by their ID
  const user = await User.findByPk(userId);

  if (!user) {
    logger.error(`Change Password: User with ID ${userId} not found`);
    return res.status(404).json({ error: 'User not found' });
  }

  // Compare the provided current password with the user's hashed password
  const isSame = await bcrypt.compare(currentPassword, user.password);

  if (!isSame) {
    logger.error(
      `Change Password: User with ID ${userId} entered a wrong current password`
    );
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  // Hash the new password and update it in the database
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ message: 'Password changed successfully' });
};
// delete all users at once
const deleteAllUsers = async (req, res) => {
  await User.destroy({
    where: {},
    truncate: false,
  });
  res.status(200).json({ message: 'All users deleted successfully' });
};
module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteAllUsers,
};
