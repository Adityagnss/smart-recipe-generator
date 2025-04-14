const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recipe = require('../models/Recipe'); // Assuming Recipe model is in '../models/Recipe'
const auth = require('../middleware/auth'); // Assuming auth middleware is in '../middleware/auth'

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/likes
// @desc    Get user's liked recipes
// @access  Private
router.get('/likes', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Find all recipes liked by the user
    const recipes = await Recipe.find({ likes: req.user.id });
    
    // Return just the IDs of liked recipes
    const likedRecipeIds = recipes.map(recipe => recipe._id);
    
    res.json(likedRecipeIds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
