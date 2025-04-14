const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  ingredients: [{
    type: String
  }],
  steps: [{
    type: String
  }],
  calories: {
    type: Number
  },
  cookTime: {
    type: String
  },
  servings: {
    type: Number
  },
  imageUrl: {
    type: String
  },
  isGenerated: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
