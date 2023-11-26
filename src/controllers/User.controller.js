const { Role } = require('../models');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { validateEmail, validatePassword } = require('../utils/validation');

// gett all users and theier roles

const getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res
    .status(200)
    .json({ ok: true, message: 'Users retrieved successfully', data: users });
};
// gett single user and theier roles

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ ok: false, message: 'User not found' });
  }

  res
    .status(200)
    .json({ ok: true, message: 'User retrieved successfully', data: user });
};
// delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ ok: false, message: 'User not found' });
  }

  await user.destroy();

  res.status(200).json({ ok: true, message: 'User deleted successfully' });
};
// update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, roleId } = req.body;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ ok: false, message: 'User not found' });
  }

  // email validation
  if (!validateEmail(email)) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid credentials',
      info: 'The email should follow the following partner',
    });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid credentials',
      info: 'Password must be at least 8 characters long and contain at least one capital letter and one digit',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.password = hashedPassword;
  user.roleId = roleId;
  await user.save();
  res
    .status(200)
    .json({ ok: true, message: 'User updated successfully', data: user });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
};
