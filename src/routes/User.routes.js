const express = require('express');

const {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
} = require('../controllers/User.controller');

const router = express.Router();

// user related routes
router.get('/', getAllUsers);
router.get('/:id', getSingleUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
