import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Badge, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faCamera, faHeart, faSave, faList, faClock, faUsers, faFire } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { toast } from 'react-toastify';
import './RecipeGenerator.css';

// Common ingredients for the multi-select dropdown
const ingredientOptions = [
  { value: 'chicken', label: 'Chicken' },
  { value: 'beef', label: 'Beef' },
  { value: 'pork', label: 'Pork' },
  { value: 'fish', label: 'Fish' },
  { value: 'rice', label: 'Rice' },
  { value: 'pasta', label: 'Pasta' },
  { value: 'potato', label: 'Potato' },
  { value: 'tomato', label: 'Tomato' },
  { value: 'onion', label: 'Onion' },
  { value: 'garlic', label: 'Garlic' },
  { value: 'carrot', label: 'Carrot' },
  { value: 'bell pepper', label: 'Bell Pepper' },
  { value: 'spinach', label: 'Spinach' },
  { value: 'broccoli', label: 'Broccoli' },
  { value: 'cheese', label: 'Cheese' },
  { value: 'egg', label: 'Egg' },
  { value: 'milk', label: 'Milk' },
  { value: 'butter', label: 'Butter' },
  { value: 'olive oil', label: 'Olive Oil' },
];

const RecipeGenerator = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRecipe = () => {
    // Validate input
    if (selectedIngredients.length === 0 && !uploadedImage) {
      toast.error('Please select ingredients or upload an image');
      return;
    }

    setIsGenerating(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock response
      const mockRecipe = {
        title: 'Garlic Butter Chicken with Roasted Vegetables',
        description: 'A delicious and easy weeknight dinner that combines juicy chicken with flavorful vegetables.',
        ingredients: [
          { name: 'Chicken breasts', quantity: '4', unit: 'pieces' },
          { name: 'Garlic', quantity: '4', unit: 'cloves' },
          { name: 'Butter', quantity: '3', unit: 'tbsp' },
          { name: 'Olive oil', quantity: '2', unit: 'tbsp' },
          { name: 'Bell peppers', quantity: '2', unit: 'medium' },
          { name: 'Carrots', quantity: '2', unit: 'large' },
          { name: 'Onion', quantity: '1', unit: 'medium' },
          { name: 'Salt', quantity: '1', unit: 'tsp' },
          { name: 'Black pepper', quantity: '1/2', unit: 'tsp' },
          { name: 'Thyme', quantity: '1', unit: 'tsp' },
        ],
        steps: [
          'Preheat oven to 425°F (220°C).',
          'Season chicken breasts with salt and pepper on both sides.',
          'In a small bowl, mix the softened butter with minced garlic and thyme.',
          'Heat olive oil in an oven-safe skillet over medium-high heat.',
          'Add the chicken breasts and sear for 3-4 minutes on each side until golden brown.',
          'Spread the garlic butter mixture on top of each chicken breast.',
          'Arrange chopped vegetables around the chicken in the skillet.',
          'Season vegetables with salt and pepper, then drizzle with a bit of olive oil.',
          'Transfer the skillet to the preheated oven and bake for 20-25 minutes or until chicken is cooked through.',
          'Let rest for 5 minutes before serving.'
        ],
        calories: 420,
        cookTime: '35 minutes',
        servings: 4,
        imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
      };

      setGeneratedRecipe(mockRecipe);
      setIsGenerating(false);
    }, 2000);
  };

  const saveRecipe = () => {
    toast.success('Recipe saved successfully!');
  };

  const likeRecipe = () => {
    toast.success('Recipe liked!');
  };

  const generateGroceryList = () => {
    toast.success('Grocery list generated!');
  };

  return (
    <div className="recipe-generator-container">
      <h2 className="mb-4">
        <FontAwesomeIcon icon={faUtensils} className="me-2" />
        Recipe Generator
      </h2>
      
      <Row>
        <Col lg={generatedRecipe ? 6 : 12}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Create Your Recipe</h4>
              
              <Form.Group className="mb-4">
                <Form.Label>Select Ingredients</Form.Label>
                <Select
                  isMulti
                  name="ingredients"
                  options={ingredientOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Search or select ingredients..."
                  value={selectedIngredients}
                  onChange={setSelectedIngredients}
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Upload Dish Image</Form.Label>
                <InputGroup>
                  <Form.Control 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <Button variant="outline-secondary">
                    <FontAwesomeIcon icon={faCamera} />
                  </Button>
                </InputGroup>
                {uploadedImage && (
                  <div className="mt-3 text-center">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="img-thumbnail" 
                      style={{ maxHeight: '200px' }} 
                    />
                  </div>
                )}
              </Form.Group>
              
              <div className="d-grid">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={generateRecipe}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Recipe'}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        {generatedRecipe && (
          <Col lg={6} className="mt-3 mt-lg-0">
            <Card className="shadow-sm">
              <Card.Img 
                variant="top" 
                src={generatedRecipe.imageUrl} 
                alt={generatedRecipe.title}
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h3 className="mb-1">{generatedRecipe.title}</h3>
                    <p className="text-muted">{generatedRecipe.description}</p>
                  </div>
                  <div className="recipe-actions">
                    <Button variant="outline-danger" size="sm" onClick={likeRecipe}>
                      <FontAwesomeIcon icon={faHeart} className="me-1" /> Like
                    </Button>
                    <Button variant="outline-primary" size="sm" className="ms-2" onClick={saveRecipe}>
                      <FontAwesomeIcon icon={faSave} className="me-1" /> Save
                    </Button>
                  </div>
                </div>
                
                <div className="recipe-details mb-4">
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faFire} className="text-danger" />
                    <span>{generatedRecipe.calories} calories</span>
                  </div>
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faClock} className="text-info" />
                    <span>{generatedRecipe.cookTime}</span>
                  </div>
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faUsers} className="text-success" />
                    <span>{generatedRecipe.servings} servings</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5>Ingredients</h5>
                  <ul className="ingredients-list">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        <span className="ingredient-name">{ingredient.name}</span>
                        <span className="ingredient-amount">{ingredient.quantity} {ingredient.unit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h5>Instructions</h5>
                  <ol className="instructions-list">
                    {generatedRecipe.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="d-grid">
                  <Button 
                    variant="success"
                    onClick={generateGroceryList}
                  >
                    <FontAwesomeIcon icon={faList} className="me-2" />
                    Generate Grocery List
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default RecipeGenerator;
