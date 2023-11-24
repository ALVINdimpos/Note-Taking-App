const { Note } = require('../models');
const { check, validationResult } = require('express-validator');

const createValidation = [
  check('title').notEmpty().withMessage('Title is required'),
  check('content').notEmpty().withMessage('Content is required'),
  check('userId').notEmpty().withMessage('User ID is required'),
];
const create = async (req, res) => {
  try {
    // Validate the request
    await Promise.all(createValidation.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, userId } = req.body;
    const note = await Note.create({
      title,
      content,
      userId,
    });

    return res.status(201).json({
      ok: true,
      message: 'Note successfully added',
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const findAll = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: {
        userId: req.userId,
      },
    });
    return res.status(200).json({
      ok: true,
      message: 'Notes retrieved successfully',
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByPk(id, {
      where: {
        userId: req.userId,
      },
    });

    if (!note) {
      return res.status(404).json({
        ok: false,
        message: 'Note not found',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Note retrieved successfully',
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await Note.findByPk(id, {
      where: {
        userId: req.userId,
      },
    });

    if (!note) {
      return res.status(404).json({
        ok: false,
        message: 'Note not found',
      });
    }

    // Update note
    note.title = title;
    note.content = content;
    await note.save();

    return res.status(200).json({
      ok: true,
      message: 'Note updated successfully',
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByPk(id, {
      where: {
        userId: req.userId,
      },
    });

    if (!note) {
      return res.status(404).json({
        ok: false,
        message: 'Note not found',
      });
    }

    // Remove note
    await note.destroy();

    return res.status(200).json({
      ok: true,
      message: 'Note deleted successfully',
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeAll = async (req, res) => {
  try {
    // Remove all notes
    await Note.destroy({
      where: {
        userId: req.userId,
      },
      truncate: true,
    });

    return res.status(200).json({
      ok: true,
      message: 'All notes deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
  removeAll,
};
