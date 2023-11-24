const express = require('express');

const {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
  assignUserRole,
} = require('../controllers/Role.controller');
const router = express.Router();

// role related routes
router.post('/', createRole);
router.get('/', getAllRoles);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);
router.post('/users/:userId/assign-role', assignUserRole);

module.exports = router;
