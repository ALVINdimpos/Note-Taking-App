// Purpose: User controller
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { validateEmail, validatePassword } = require('../utils/validation');
const logger = require('../utils/logger/index');
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
    logger.error(`Retrieving User: User with ID ${id} not found`);
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
    logger.error(`Deleting User: User with ID ${id} not found`);
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
    logger.error(`Updating User: User with ID ${id} not found`);
    return res.status(404).json({ ok: false, message: 'User not found' });
  }

  // email validation
  if (!validateEmail(email)) {
    logger.error(
      `Updating User: Invalid email address: ${email}, should follow the following partner xxx@xxx.xxx `
    );
    return res.status(400).json({
      ok: false,
      message: 'Invalid credentials',
      info: 'The email should follow the following partner xxx@xxx.xxx',
    });
  }

  // Create an object with the fields you want to update
  const updatedFields = {};
  if (firstName) updatedFields.firstName = firstName;
  if (lastName) updatedFields.lastName = lastName;
  if (email) updatedFields.email = email;
  // Check if the password is provided before updating it
  if (password) {
    if (!validatePassword(password)) {
      logger.error(
        `Updating User: Invalid password: ${password}, must be at least 8 characters long and contain at least one capital letter and one digit`
      );
      return res.status(400).json({
        ok: false,
        message: 'Invalid credentials',
        info: 'Password must be at least 8 characters long and contain at least one capital letter and one digit',
      });
    }
    updatedFields.password = await bcrypt.hash(password, 10);
  }
  if (roleId) updatedFields.roleId = roleId;

  await user.update(updatedFields);
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
