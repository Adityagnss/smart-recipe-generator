const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Memory = require('../models/Memory');

// @route   GET api/memories
// @desc    Get all user's flavor memories
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const memories = await Memory.find({ user: req.user.id }).sort({ date: -1 });
    res.json(memories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/memories
// @desc    Create a new flavor memory
// @access  Private
router.post('/', auth, async (req, res) => {
  const { dishName, description } = req.body;

  try {
    const newMemory = new Memory({
      dishName,
      description,
      user: req.user.id
    });

    const memory = await newMemory.save();
    res.json(memory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/memories/:id
// @desc    Update a flavor memory
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { dishName, description } = req.body;

  try {
    let memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ msg: 'Memory not found' });
    }

    // Check user owns the memory
    if (memory.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update
    if (dishName) memory.dishName = dishName;
    if (description) memory.description = description;

    await memory.save();
    
    res.json(memory);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Memory not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/memories/:id
// @desc    Delete a flavor memory
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ msg: 'Memory not found' });
    }

    // Check user owns the memory
    if (memory.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await memory.remove();
    
    res.json({ msg: 'Memory removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Memory not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
