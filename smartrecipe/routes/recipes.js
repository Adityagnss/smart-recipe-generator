const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

// @route   GET api/recipes/community
// @desc    Get public recipes for community
// @access  Public
router.get('/community', async (req, res) => {
  try {
    const recipes = await Recipe.find({ isPublic: true })
      .sort({ date: -1 })
      .populate('user', ['name'])
      .populate('comments.user', ['name']);
    
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/recipes/user
// @desc    Get all user's recipes
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id }).sort({ date: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/recipes/saved
// @desc    Get user's saved recipes
// @access  Private
router.get('/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedRecipes');
    res.json(user.savedRecipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/recipes
// @desc    Create a recipe
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      ingredients, 
      steps, 
      calories, 
      cookTime, 
      servings, 
      imageUrl, 
      isGenerated,
      isPublic 
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ msg: 'Title is required' });
    }
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ msg: 'Ingredients are required' });
    }
    
    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ msg: 'Steps are required' });
    }

    const newRecipe = new Recipe({
      title,
      description: description || '',
      ingredients,
      steps,
      calories: calories || null,
      cookTime: cookTime || '',
      servings: servings || null,
      imageUrl: imageUrl || '',
      isGenerated: isGenerated || false,
      isPublic: isPublic !== undefined ? isPublic : true,
      user: req.user.id,
      likes: [],
      comments: []
    });

    const recipe = await newRecipe.save();
    
    // Populate user information before returning
    await recipe.populate('user', ['name']);
    
    res.json(recipe);
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/recipes/generate
// @desc    Generate a recipe with AI (placeholder)
// @access  Private
router.post('/generate', auth, async (req, res) => {
  const { ingredients, imageUrl } = req.body;

  // This would be where you integrate with an AI service
  // For now, return a placeholder recipe
  try {
    const generatedRecipe = {
      title: 'AI Generated Recipe',
      description: 'A delicious recipe generated based on your inputs',
      ingredients: ingredients ? ingredients.map(ing => ({ name: ing, quantity: '1', unit: 'unit' })) 
                              : [{ name: 'Sample Ingredient', quantity: '1', unit: 'unit' }],
      steps: ['Step 1: Prepare ingredients', 'Step 2: Cook according to preferences', 'Step 3: Enjoy!'],
      calories: 350,
      cookTime: '30 mins',
      servings: 2,
      imageUrl: imageUrl || 'https://via.placeholder.com/350',
      isGenerated: true
    };

    res.json(generatedRecipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/recipes/save/:id
// @desc    Save a recipe to user's collection
// @access  Private
router.put('/save/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if already saved
    if (user.savedRecipes.includes(req.params.id)) {
      return res.status(400).json({ msg: 'Recipe already saved' });
    }

    user.savedRecipes.push(req.params.id);
    await user.save();

    res.json(user.savedRecipes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/recipes/like/:id
// @desc    Like a recipe
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    // Check if recipe exists
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Check if already liked
    if (recipe.likes.some(like => like.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Recipe already liked' });
    }

    recipe.likes.unshift(req.user.id);
    await recipe.save();

    res.json(recipe.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/recipes/unlike/:id
// @desc    Unlike a recipe
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    // Check if recipe exists
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Check if not yet liked
    if (!recipe.likes.some(like => like.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Recipe has not yet been liked' });
    }

    // Remove like
    recipe.likes = recipe.likes.filter(like => like.toString() !== req.user.id);
    await recipe.save();

    res.json(recipe.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/recipes/comment/:id
// @desc    Comment on a recipe
// @access  Private
router.post('/comment/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    // Check if recipe exists
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    const newComment = {
      text: req.body.text,
      user: req.user.id
    };

    recipe.comments.unshift(newComment);
    await recipe.save();

    // Populate user information for all comments before returning
    await Recipe.populate(recipe, {
      path: 'comments.user',
      select: 'name'
    });

    res.json(recipe.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
