const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Simple in-memory rate limiting
const userRequestCounts = {};
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Helper function to check if a user has exceeded rate limit
const isRateLimited = (userId) => {
  const now = Date.now();
  
  // Initialize user's request history if it doesn't exist
  if (!userRequestCounts[userId]) {
    userRequestCounts[userId] = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW
    };
  }
  
  // Reset count if the window has passed
  if (now > userRequestCounts[userId].resetTime) {
    userRequestCounts[userId] = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW
    };
  }
  
  // Check if user has exceeded rate limit
  if (userRequestCounts[userId].count >= RATE_LIMIT) {
    return true;
  }
  
  // Increment count
  userRequestCounts[userId].count++;
  return false;
};

// Enhanced AI-like responses for cooking questions
const getEnhancedResponse = (message) => {
  const input = message.toLowerCase();
  
  // Recipe request
  if (input.includes('recipe') && (input.includes('make') || input.includes('how') || input.includes('create'))) {
    if (input.includes('pasta') || input.includes('spaghetti')) {
      return `# Classic Spaghetti Bolognese Recipe

**Ingredients:**
- 1 lb (500g) ground beef
- 1 large onion, finely chopped
- 2 garlic cloves, minced
- 2 carrots, finely diced
- 2 celery stalks, finely diced
- 1 can (14 oz) crushed tomatoes
- 2 tbsp tomato paste
- 1 cup beef stock
- 1 tsp dried oregano
- 1 tsp dried basil
- Salt and pepper to taste
- 1 lb (500g) spaghetti
- Grated Parmesan cheese for serving

**Instructions:**
1. Heat olive oil in a large pan over medium heat. Add onions and sauté until translucent.
2. Add garlic and cook for another minute until fragrant.
3. Add ground beef and cook until browned, breaking it up with a wooden spoon.
4. Add carrots and celery, cooking for 5 minutes until softened.
5. Stir in tomato paste, crushed tomatoes, beef stock, and herbs.
6. Season with salt and pepper, then simmer for at least 30 minutes (longer for better flavor).
7. Meanwhile, cook spaghetti according to package instructions.
8. Serve sauce over pasta with grated Parmesan cheese.

This classic dish is perfect for family dinners and the sauce can be made ahead of time for even better flavor!`;
    }
    
    if (input.includes('chicken')) {
      return `# Herb Roasted Chicken Recipe

**Ingredients:**
- 1 whole chicken (about 4-5 lbs)
- 3 tbsp olive oil
- 4 garlic cloves, minced
- 2 tbsp fresh rosemary, chopped
- 2 tbsp fresh thyme, chopped
- 1 lemon, zested and quartered
- 1 tbsp salt
- 1 tsp black pepper
- 1 onion, quartered
- 2 carrots, roughly chopped
- 2 celery stalks, roughly chopped

**Instructions:**
1. Preheat oven to 425°F (220°C).
2. Mix olive oil, garlic, herbs, lemon zest, salt, and pepper in a small bowl.
3. Pat chicken dry with paper towels.
4. Rub herb mixture all over the chicken, including under the skin.
5. Stuff the cavity with lemon quarters and some of the onion.
6. Place remaining onion, carrots, and celery in a roasting pan and place chicken on top.
7. Roast for 1 hour and 20 minutes, or until juices run clear and internal temperature reaches 165°F (74°C).
8. Let rest for 10-15 minutes before carving.
9. Serve with roasted vegetables and pan juices.

This roast chicken is perfect for Sunday dinners and makes excellent leftovers for sandwiches and salads!`;
    }
    
    if (input.includes('vegetarian') || input.includes('vegan')) {
      return `# Hearty Vegetable Curry Recipe

**Ingredients:**
- 2 tbsp vegetable oil
- 1 large onion, diced
- 3 garlic cloves, minced
- 1 tbsp fresh ginger, grated
- 2 tbsp curry powder
- 1 tsp ground cumin
- 1 tsp ground coriander
- 1/4 tsp cayenne pepper (adjust to taste)
- 1 can (14 oz) diced tomatoes
- 1 can (14 oz) coconut milk
- 1 cup vegetable broth
- 1 sweet potato, peeled and cubed
- 1 cauliflower, cut into florets
- 1 red bell pepper, diced
- 1 can (15 oz) chickpeas, drained and rinsed
- 2 cups fresh spinach
- Salt to taste
- Fresh cilantro for garnish
- Cooked rice for serving

**Instructions:**
1. Heat oil in a large pot over medium heat. Add onion and cook until softened.
2. Add garlic and ginger, cook for 1 minute until fragrant.
3. Add all spices and stir for 30 seconds to toast them.
4. Add diced tomatoes, coconut milk, and vegetable broth. Stir well.
5. Add sweet potato, cauliflower, and bell pepper. Bring to a simmer.
6. Cover and cook for 15 minutes until vegetables are tender.
7. Add chickpeas and cook for another 5 minutes.
8. Stir in spinach until wilted.
9. Season with salt to taste.
10. Serve over rice and garnish with fresh cilantro.

This curry is packed with nutrients and flavor. It's perfect for meal prep as it tastes even better the next day!`;
    }
    
    return `I'd be happy to help you create a recipe! To provide you with the best recipe, could you tell me:

1. What specific dish or ingredients are you interested in?
2. Any dietary restrictions or preferences?
3. How much time do you have for preparation?

Once you provide these details, I can share a detailed recipe with ingredients and step-by-step instructions tailored to your needs.`;
  }
  
  // Cooking technique
  if (input.includes('how') && (input.includes('cook') || input.includes('bake') || input.includes('grill'))) {
    if (input.includes('steak')) {
      return `# How to Cook the Perfect Steak

**For a 1-inch thick steak:**

**Preparation:**
1. Remove steak from refrigerator 30-60 minutes before cooking to bring to room temperature.
2. Pat dry with paper towels to remove excess moisture.
3. Season generously with salt and pepper on both sides.

**Stovetop-to-Oven Method (Recommended):**
1. Preheat oven to 400°F (200°C).
2. Heat a cast-iron skillet over high heat until very hot.
3. Add 1 tbsp of high-heat oil (like grapeseed or avocado).
4. Sear steak for 2-3 minutes on each side until well browned.
5. Add butter, garlic, and herbs (optional) to the pan.
6. Transfer skillet to oven and cook for:
   - 4-5 minutes for medium-rare (internal temp: 130-135°F)
   - 5-7 minutes for medium (internal temp: 135-145°F)
   - 8-10 minutes for well-done (internal temp: 150-155°F)
7. Remove from oven and let rest for 5-10 minutes before slicing.

**Tips for Success:**
- Use a meat thermometer for perfect doneness
- Let the steak rest to retain juices
- Slice against the grain for maximum tenderness

Enjoy your perfectly cooked steak!`;
    }
    
    if (input.includes('rice')) {
      return `# How to Cook Perfect Fluffy Rice

**Basic White Rice Recipe:**

**Ingredients:**
- 1 cup long-grain white rice
- 1¾ cups water
- ½ tsp salt
- 1 tsp butter or oil (optional)

**Stovetop Method:**
1. Rinse rice in cold water until water runs clear (this removes excess starch).
2. In a medium saucepan, bring water, salt, and butter/oil (if using) to a boil.
3. Add rice, stir once, and return to a boil.
4. Reduce heat to low, cover with a tight-fitting lid, and simmer for 18 minutes.
5. Remove from heat (don't lift the lid) and let stand, covered, for 5 minutes.
6. Fluff with a fork before serving.

**Rice Cooker Method:**
1. Rinse rice until water runs clear.
2. Add rice, water, salt, and butter/oil to the rice cooker.
3. Turn on the rice cooker and let it do its magic.
4. Once done, let it sit for 5 minutes before fluffing.

**Troubleshooting:**
- If rice is too firm: Add 2 tbsp water and cook covered for 5 more minutes.
- If rice is too wet: Remove lid and cook on low heat to evaporate excess moisture.

**Variations:**
- For more flavor, cook rice in broth instead of water.
- Add herbs, spices, or a bay leaf to the cooking water.
- For coconut rice, replace half the water with coconut milk.

Perfect rice is all about the right ratio of water to rice and proper cooking time!`;
    }
    
    return `I'd be happy to explain how to cook that! Could you please specify which food or dish you'd like to learn about? I can provide detailed instructions including:

- Preparation techniques
- Cooking temperatures and times
- Tips for best results
- Troubleshooting common issues

Just let me know what you'd like to cook, and I'll provide step-by-step instructions!`;
  }
  
  // Ingredient substitution
  if (input.includes('substitute') || (input.includes('replace') && input.includes('ingredient'))) {
    return `# Common Ingredient Substitutions

Here are some helpful substitutions for common ingredients:

**Dairy Substitutions:**
- **Buttermilk:** 1 cup milk + 1 tbsp lemon juice or vinegar (let stand 5-10 minutes)
- **Sour Cream:** Greek yogurt in equal amounts
- **Heavy Cream (for cooking):** 3/4 cup milk + 1/4 cup melted butter
- **Milk:** Almond, soy, oat, or coconut milk in equal amounts

**Baking Substitutions:**
- **All-Purpose Flour (1 cup):** 1 cup + 2 tbsp cake flour OR 1/2 cup whole wheat + 1/2 cup all-purpose
- **Baking Powder (1 tsp):** 1/4 tsp baking soda + 1/2 tsp cream of tartar
- **Brown Sugar (1 cup):** 1 cup white sugar + 1-2 tbsp molasses
- **Eggs (1):** 1/4 cup applesauce OR 1 tbsp ground flaxseed + 3 tbsp water

**Oil & Fat Substitutions:**
- **Butter:** Olive oil, coconut oil, or applesauce (in baking)
- **Vegetable Oil:** Applesauce (in baking) or melted butter

**Herb & Spice Substitutions:**
- **Fresh Herbs:** 1 tbsp fresh = 1 tsp dried
- **Allspice:** Equal parts cinnamon, nutmeg, and cloves
- **Italian Seasoning:** Mix of basil, oregano, rosemary, and thyme

Remember that substitutions may slightly alter the flavor or texture of your dish, but they'll help you complete your recipe when you're missing an ingredient!`;
  }
  
  // Nutrition information
  if (input.includes('nutrition') || input.includes('healthy') || input.includes('calories')) {
    return `# Nutrition Information for Common Foods

**Protein Sources (per 3.5 oz/100g):**
- Chicken Breast: 165 calories, 31g protein, 3.6g fat
- Salmon: 206 calories, 22g protein, 13g fat (healthy omega-3s)
- Eggs (1 large): 72 calories, 6g protein, 5g fat
- Tofu: 76 calories, 8g protein, 4.5g fat
- Lentils: 116 calories, 9g protein, 0.4g fat, 20g carbs, 8g fiber

**Vegetables (per 1 cup):**
- Broccoli: 31 calories, 2.5g protein, 6g carbs, 2.4g fiber
- Spinach: 7 calories, 0.9g protein, 1.1g carbs, 0.7g fiber
- Sweet Potato: 114 calories, 2g protein, 27g carbs, 4g fiber
- Kale: 33 calories, 2.2g protein, 6.7g carbs, 1.3g fiber

**Grains (per 1 cup cooked):**
- Brown Rice: 216 calories, 5g protein, 45g carbs, 3.5g fiber
- Quinoa: 222 calories, 8g protein, 39g carbs, 5g fiber
- Oats: 166 calories, 6g protein, 28g carbs, 4g fiber

**Healthy Eating Tips:**
1. Fill half your plate with vegetables and fruits
2. Choose whole grains over refined grains
3. Include lean protein with each meal
4. Incorporate healthy fats like avocados, nuts, and olive oil
5. Stay hydrated by drinking plenty of water
6. Limit added sugars and highly processed foods

Would you like more specific nutrition information about certain foods or dietary patterns?`;
  }
  
  // General cooking tips
  if (input.includes('tips') || input.includes('advice')) {
    return `# Essential Cooking Tips for Home Chefs

**Kitchen Preparation:**
1. **Mise en Place:** Prepare and measure all ingredients before you start cooking
2. **Sharp Knives:** Keep knives sharp for safety and efficiency
3. **Read Recipes:** Read recipes completely before starting

**Cooking Techniques:**
1. **Meat Resting:** Always rest meat after cooking (5-10 minutes for steaks, 15-20 for roasts)
2. **Salt Timing:** Season meat before cooking; vegetables during cooking
3. **Pan Temperature:** Preheat pans properly before adding food
4. **Overcrowding:** Don't overcrowd pans - cook in batches if needed

**Flavor Boosters:**
1. **Acid Balance:** Add a splash of vinegar or citrus to brighten flavors
2. **Herbs Timing:** Add hardy herbs (rosemary, thyme) early; delicate herbs (basil, cilantro) at the end
3. **Umami Depth:** Use soy sauce, mushrooms, or tomato paste to add depth
4. **Fond Utilization:** Deglaze pans to use the flavorful browned bits

**Baking Tips:**
1. **Room Temperature:** Bring eggs and dairy to room temperature before baking
2. **Measure Precisely:** Use measuring cups for liquids and scales for flour
3. **Oven Check:** Verify your oven temperature with an oven thermometer

**Kitchen Wisdom:**
1. **Taste As You Go:** Adjust seasonings throughout cooking
2. **Recipe Flexibility:** Treat recipes as guidelines, not strict rules
3. **Failed Dishes:** Learn from mistakes; every chef has them!

What specific cooking area would you like more tips on?`;
  }
  
  // Fallback for other food-related questions
  return `Thank you for your question about "${message}". 

As your Smart Recipe assistant, I can help with:
- Detailed recipes with ingredients and instructions
- Cooking techniques and methods
- Ingredient substitutions and information
- Nutrition facts and healthy eating tips
- Kitchen tips and troubleshooting

Could you provide more details about what you're looking for? I'm here to help make your cooking experience better!`;
};

// @route   POST api/chatbot
// @desc    Get enhanced cooking responses
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    
    if (!message) {
      return res.status(400).json({ msg: 'Message is required' });
    }
    
    // Check rate limiting
    if (isRateLimited(userId)) {
      return res.status(429).json({ 
        msg: 'Rate limit exceeded. Please try again in a minute.',
        fallback: true
      });
    }

    // Get enhanced response
    const botResponse = getEnhancedResponse(message);
    
    // Add a small delay to simulate AI processing
    setTimeout(() => {
      res.json({ response: botResponse });
    }, 1000);
    
  } catch (err) {
    console.error('Chatbot API error:', err);
    res.status(500).json({ 
      msg: 'Server error processing your request',
      error: err.message,
      fallback: true
    });
  }
});

module.exports = router;
