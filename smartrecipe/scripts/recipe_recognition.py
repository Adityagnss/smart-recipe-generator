#!/usr/bin/env python3
"""
Recipe Recognition Script

This script uses a simplified approach to suggest recipes based on food images.
"""

import os
import sys
import json
import random
from PIL import Image

# Check if image path is provided
if len(sys.argv) != 2:
    print(json.dumps({"error": "Image path not provided"}))
    sys.exit(1)

image_path = sys.argv[1]

# Check if image exists
if not os.path.exists(image_path):
    print(json.dumps({"error": f"Image not found at {image_path}"}))
    sys.exit(1)

try:
    # Open the image to verify it's valid
    img = Image.open(image_path)
    img_format = img.format
    img_size = img.size
    
    # Define common Indian food categories
    food_categories = [
        "curry", "biryani", "tandoori", "masala", "paneer", 
        "dal", "chutney", "naan", "roti", "paratha", 
        "samosa", "pakora", "tikka", "korma", "vindaloo",
        "dosa", "idli", "vada", "chaat", "raita",
        "lassi", "kulfi", "gulab jamun", "jalebi", "halwa"
    ]
    
    # Define common Indian dishes
    indian_dishes = [
        "butter chicken", "chicken tikka masala", "biryani", "samosa", 
        "naan", "dosa", "idli", "palak paneer", "chana masala", 
        "aloo gobi", "tandoori chicken", "rogan josh", "dal makhani",
        "gulab jamun", "jalebi", "lassi", "masala chai", "pav bhaji",
        "chole bhature", "rajma", "malai kofta", "bhindi masala",
        "vegetable korma", "chicken vindaloo", "fish curry",
        "mutter paneer", "baingan bharta", "dhokla", "kachori",
        "gajar ka halwa", "rasmalai", "kheer", "rasgulla"
    ]
    
    # Get a random selection of dishes
    # In a real implementation, this would use image recognition
    # For now, we'll simulate recognition by selecting random dishes
    # that would be relevant to the image
    
    # Use image properties to seed the random generator for consistent results
    random.seed(sum(img_size) + len(img_format))
    
    # Select 5-10 "recognized" dishes
    num_dishes = random.randint(5, 10)
    recognized_dishes = random.sample(indian_dishes, num_dishes)
    
    # Print the result as JSON
    print(json.dumps(recognized_dishes))
    
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
