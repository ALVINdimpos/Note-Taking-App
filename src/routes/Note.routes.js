const express = require('express');

const {
  create,
  findAll,
  findOne,
  update,
  remove,
  removeAll,
} = require('../controllers/Note.controller');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();

// note related routes
router.post('/', isLoggedIn, create);
router.get('/', isLoggedIn, findAll);
router.get('/:id', isLoggedIn, findOne);
router.put('/:id', isLoggedIn, update);
router.delete('/:id', isLoggedIn, remove);
router.delete('/', isLoggedIn, removeAll);

module.exports = router;
