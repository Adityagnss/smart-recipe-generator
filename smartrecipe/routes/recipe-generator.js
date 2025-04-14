const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const cheerio = require('cheerio');
const auth = require('../middleware/auth');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// RecipeLens server URL
const RECIPE_LENS_URL = 'http://127.0.0.1:8000/';

// Path to the Python script (as fallback)
const pythonScriptPath = path.join(__dirname, '../scripts/recipe_recognition.py');

// Path to the recipes JSON file
const recipesJsonPath = path.join(__dirname, '../data/recipes.json');

// Load recipes data
let recipesData = [];
try {
  recipesData = JSON.parse(fs.readFileSync(recipesJsonPath, 'utf8'));
} catch (err) {
  console.error('Error loading recipes data:', err);
  // Create an empty array if the file doesn't exist
  recipesData = [];
}

// Helper function to get CSRF token and cookies from RecipeLens
async function getCSRFToken() {
  try {
    const response = await axios.get(RECIPE_LENS_URL);
    const $ = cheerio.load(response.data);
    const csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
    
    // Get cookies from response
    const cookies = response.headers['set-cookie'];
    let cookieString = '';
    if (cookies) {
      cookieString = cookies.map(cookie => cookie.split(';')[0]).join('; ');
    }
    
    return { csrfToken, cookieString };
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return { csrfToken: null, cookieString: '' };
  }
}

// Helper function to extract recipe names from RecipeLens HTML
function extractRecipeNames(html) {
  const $ = cheerio.load(html);
  const recipeNames = [];
  
  // Look for recipe names in the recipe list
  $('.recipe-list li').each((i, element) => {
    const name = $(element).text().trim();
    if (name) recipeNames.push(name);
  });
  
  // If no recipes found in list, try to find them in the recipe cards
  if (recipeNames.length === 0) {
    $('.recipe-card h5').each((i, element) => {
      const name = $(element).text().trim();
      if (name) recipeNames.push(name);
    });
  }
  
  // If still no recipes found, try to find any text that might be a recipe name
  if (recipeNames.length === 0) {
    // Look for potential recipe names in the response
    const text = $('body').text();
    const potentialRecipes = text.match(/possible matches.*?Ingredients/s);
    
    if (potentialRecipes) {
      const lines = potentialRecipes[0].split('\n');
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && 
            !trimmedLine.includes('possible matches') && 
            !trimmedLine.includes('Ingredients')) {
          recipeNames.push(trimmedLine);
        }
      }
    }
  }
  
  return recipeNames;
}

// @route   POST api/recipe-generator/upload
// @desc    Upload an image and get recipe suggestions from RecipeLens
// @access  Private
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No image file uploaded' });
    }

    const imagePath = req.file.path;
    
    // Try to use RecipeLens server first
    try {
      // Get CSRF token and cookies
      const { csrfToken, cookieString } = await getCSRFToken();
      
      if (!csrfToken) {
        throw new Error('Could not get CSRF token from RecipeLens server');
      }
      
      // Create form data to send to RecipeLens
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));
      formData.append('csrfmiddlewaretoken', csrfToken);
      
      // Send request to RecipeLens server
      const response = await axios.post(RECIPE_LENS_URL, formData, {
        headers: {
          ...formData.getHeaders(),
          'Cookie': cookieString,
          'Referer': RECIPE_LENS_URL,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      
      // First try to extract recipe names
      const recipeNames = extractRecipeNames(response.data);
      console.log('Extracted recipe names:', recipeNames);
      
      // Find matching recipes in our database
      const recipes = [];
      
      if (recipeNames.length > 0) {
        for (const recipeName of recipeNames) {
          const matches = recipesData.filter(r => 
            r.name.toLowerCase().includes(recipeName.toLowerCase()) ||
            recipeName.toLowerCase().includes(r.name.toLowerCase())
          );
          
          matches.forEach(match => {
            if (!recipes.some(r => r.name === match.name)) {
              recipes.push(match);
            }
          });
          
          if (recipes.length >= 10) break;
        }
      }
      
      // Clean up the uploaded file
      fs.unlinkSync(imagePath);
      
      // If no recipes found, use our fallback Python script
      if (recipes.length === 0) {
        throw new Error('No recipes found in RecipeLens response');
      }
      
      // Return the recipes
      return res.json({ recipes });
      
    } catch (err) {
      console.error('Error connecting to RecipeLens:', err);
      
      // Fall back to our Python script if RecipeLens server fails
      console.log('Falling back to local Python script...');
      
      const { spawn } = require('child_process');
      const python = spawn('python3', [pythonScriptPath, imagePath]);
      
      let dataFromPython = '';
      let errorFromPython = '';
      
      python.stdout.on('data', (data) => {
        dataFromPython += data.toString();
      });
      
      python.stderr.on('data', (data) => {
        errorFromPython += data.toString();
      });
      
      python.on('close', (code) => {
        // Clean up the uploaded file
        fs.unlinkSync(imagePath);
        
        if (code !== 0) {
          console.error('Python script error:', errorFromPython);
          return res.status(500).json({ 
            msg: 'Error processing image',
            error: errorFromPython
          });
        }
        
        try {
          const recognizedRecipes = JSON.parse(dataFromPython);
          
          // Find matching recipes in our database
          const matchedRecipes = [];
          
          for (const recipeName of recognizedRecipes) {
            const matches = recipesData.filter(r => 
              r.name.toLowerCase().includes(recipeName.toLowerCase()) ||
              recipeName.toLowerCase().includes(r.name.toLowerCase())
            );
            
            matches.forEach(match => {
              if (!matchedRecipes.some(r => r.name === match.name)) {
                matchedRecipes.push(match);
              }
            });
            
            if (matchedRecipes.length >= 10) break;
          }
          
          // If no matches found, return a subset of recipes
          if (matchedRecipes.length === 0) {
            const randomRecipes = recipesData
              .sort(() => 0.5 - Math.random())
              .slice(0, 10);
            
            return res.json({
              recipes: randomRecipes
            });
          }
          
          res.json({
            recipes: matchedRecipes
          });
        } catch (err) {
          console.error('Error parsing Python output:', err);
          res.status(500).json({ 
            msg: 'Error parsing recognition results',
            error: err.message
          });
        }
      });
    }
  } catch (err) {
    console.error('Error in recipe generator:', err);
    
    // Clean up the uploaded file if it exists
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      msg: 'Server error',
      error: err.message
    });
  }
});

module.exports = router;
