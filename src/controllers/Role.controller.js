const { Role } = require('../models');
const { User } = require('../models');
const logger = require('../utils/logger/index');

const createRole = async (req, res) => {
  const { name } = req.body;
  const role = await Role.create({ name });
  res
    .status(201)
    .json({ ok: true, message: 'Role created successfully', data: role });
};
const getAllRoles = async (req, res) => {
  const roles = await Role.findAll();
  res
    .status(200)
    .json({ ok: true, message: 'Roles retrieved successfully', data: roles });
};
const updateRole = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const role = await Role.findByPk(id);

  if (!role) {
    logger.error(`Updating Role: Role with ID ${id} not found`);
    return res.status(404).json({ ok: false, message: 'Role not found' });
  }

  role.name = name;
  await role.save();

  res
    .status(200)
    .json({ ok: true, message: 'Role updated successfully', data: role });
};
const deleteRole = async (req, res) => {
  const { id } = req.params;
  const role = await Role.findByPk(id);

  if (!role) {
    logger.error(`Deleting Role: Role with ID ${id} not found`);
    return res.status(404).json({ ok: false, message: 'Role not found' });
  }

  await role.destroy();

  res.status(200).json({ ok: true, message: 'Role deleted successfully' });
};
// Controller function to assign a role to a user
const assignUserRole = async (req, res) => {
  const { userId } = req.params;
  const { roleId } = req.body;

  // Find the user by ID
  const user = await User.findByPk(userId);

  if (!user) {
    logger.error(`Assigning Role: User with ID ${userId} not found`);
    return res.status(404).json({ ok: false, message: 'User not found' });
  }

  // Find the role by ID
  const role = await Role.findByPk(roleId);

  if (!role) {
    logger.error(`Assigning Role: Role with ID ${roleId} not found`);
    return res.status(404).json({ ok: false, message: 'Role not found' });
  }

  // Assign the role to the user
  user.roleId = roleId;
  await user.save();

  res.status(200).json({
    ok: true,
    message: 'Role assigned to user successfully',
    data: user,
  });
};
module.exports = {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
  assignUserRole,
};
