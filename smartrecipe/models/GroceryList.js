const mongoose = require('mongoose');

const GroceryListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: 'My Grocery List'
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: String
    },
    checked: {
      type: Boolean,
      default: false
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GroceryList', GroceryListSchema);
