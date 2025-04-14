const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GroceryList = require('../models/GroceryList');

// @route   GET api/grocery
// @desc    Get user's grocery lists
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const groceryLists = await GroceryList.find({ user: req.user.id }).sort({ date: -1 });
    res.json(groceryLists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/grocery
// @desc    Create a new grocery list
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, items } = req.body;

  try {
    const newGroceryList = new GroceryList({
      name,
      items,
      user: req.user.id
    });

    const groceryList = await newGroceryList.save();
    res.json(groceryList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/grocery/:id
// @desc    Update grocery list
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, items } = req.body;

  try {
    let groceryList = await GroceryList.findById(req.params.id);

    if (!groceryList) {
      return res.status(404).json({ msg: 'Grocery list not found' });
    }

    // Check user owns the grocery list
    if (groceryList.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update
    if (name) groceryList.name = name;
    if (items) groceryList.items = items;

    await groceryList.save();
    
    res.json(groceryList);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Grocery list not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/grocery/:id
// @desc    Delete grocery list
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const groceryList = await GroceryList.findById(req.params.id);

    if (!groceryList) {
      return res.status(404).json({ msg: 'Grocery list not found' });
    }

    // Check user owns the grocery list
    if (groceryList.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await groceryList.remove();
    
    res.json({ msg: 'Grocery list removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Grocery list not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/grocery/add-item/:id
// @desc    Add an item to a grocery list
// @access  Private
router.post('/add-item/:id', auth, async (req, res) => {
  const { name, quantity } = req.body;

  try {
    const groceryList = await GroceryList.findById(req.params.id);

    if (!groceryList) {
      return res.status(404).json({ msg: 'Grocery list not found' });
    }

    // Check user owns the grocery list
    if (groceryList.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    groceryList.items.push({ name, quantity, checked: false });
    await groceryList.save();
    
    res.json(groceryList);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Grocery list not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/grocery/toggle-item/:id/:item_id
// @desc    Toggle checked status of an item
// @access  Private
router.put('/toggle-item/:id/:item_id', auth, async (req, res) => {
  try {
    const groceryList = await GroceryList.findById(req.params.id);

    if (!groceryList) {
      return res.status(404).json({ msg: 'Grocery list not found' });
    }

    // Check user owns the grocery list
    if (groceryList.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Find the item
    const item = groceryList.items.id(req.params.item_id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Toggle checked status
    item.checked = !item.checked;
    await groceryList.save();
    
    res.json(groceryList);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Grocery list or item not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/grocery/remove-item/:id/:item_id
// @desc    Remove an item from a grocery list
// @access  Private
router.delete('/remove-item/:id/:item_id', auth, async (req, res) => {
  try {
    const groceryList = await GroceryList.findById(req.params.id);

    if (!groceryList) {
      return res.status(404).json({ msg: 'Grocery list not found' });
    }

    // Check user owns the grocery list
    if (groceryList.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Remove the item
    groceryList.items.id(req.params.item_id).remove();
    await groceryList.save();
    
    res.json(groceryList);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Grocery list or item not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
