const { Role } = require('../models');
const { User } = require('../models');
const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const role = await Role.create({ name });
    res
      .status(201)
      .json({ ok: true, message: 'Role created successfully', data: role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res
      .status(200)
      .json({ ok: true, message: 'Roles retrieved successfully', data: roles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateRole = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ ok: false, message: 'Role not found' });
    }

    role.name = name;
    await role.save();

    res
      .status(200)
      .json({ ok: true, message: 'Role updated successfully', data: role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ ok: false, message: 'Role not found' });
    }

    await role.destroy();

    res.status(200).json({ ok: true, message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Controller function to assign a role to a user
const assignUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;

    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    // Find the role by ID
    const role = await Role.findByPk(roleId);

    if (!role) {
      return res.status(404).json({ ok: false, message: 'Role not found' });
    }

    // Assign the role to the user
    user.roleId = roleId;
    await user.save();

    res
      .status(200)
      .json({
        ok: true,
        message: 'Role assigned to user successfully',
        data: user,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
  assignUserRole,
};
