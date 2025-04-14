import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faClock, faUtensils, faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './SavedRecipes.css';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // For demonstration purposes - in real app this would come from API
  const demoSavedRecipes = [
    {
      _id: '1',
      title: 'Classic Chocolate Chip Cookies',
      description: 'Soft and chewy chocolate chip cookies that are golden brown and crispy on the outside.',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
      cookTime: 25,
      servings: 24,
      calories: 150,
      ingredients: [
        '2 1/4 cups all-purpose flour',
        '1 tsp baking soda',
        '1 tsp salt',
        '1 cup unsalted butter, softened',
        '3/4 cup granulated sugar',
        '3/4 cup packed brown sugar',
        '2 large eggs',
        '2 tsp vanilla extract',
        '2 cups semi-sweet chocolate chips'
      ],
      instructions: [
        'Preheat the oven to 375°F (190°C).',
        'In a small bowl, mix flour, baking soda, and salt.',
        'In a large mixing bowl, cream butter and sugars until light and fluffy.',
        'Beat in eggs one at a time, then stir in vanilla.',
        'Gradually blend in the dry ingredients.',
        'Stir in chocolate chips.',
        'Drop by rounded tablespoon onto ungreased baking sheets.',
        'Bake for 9 to 11 minutes or until golden brown.',
        'Let stand for 2 minutes, then remove to cool on wire racks.'
      ],
      date: '2025-04-08T14:30:00Z'
    },
    {
      _id: '2',
      title: 'Mediterranean Quinoa Salad',
      description: 'A refreshing salad with protein-packed quinoa, vegetables, and Mediterranean flavors.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
      cookTime: 30,
      servings: 6,
      calories: 220,
      ingredients: [
        '1 cup quinoa, rinsed',
        '2 cups water or vegetable broth',
        '1 cucumber, diced',
        '1 pint cherry tomatoes, halved',
        '1 red bell pepper, diced',
        '1/2 red onion, finely diced',
        '1/2 cup kalamata olives, pitted and sliced',
        '1/2 cup feta cheese, crumbled',
        '1/4 cup fresh parsley, chopped',
        '3 tbsp olive oil',
        '2 tbsp lemon juice',
        '1 tbsp red wine vinegar',
        '2 cloves garlic, minced',
        '1 tsp dried oregano',
        'Salt and pepper to taste'
      ],
      instructions: [
        'In a medium saucepan, bring quinoa and water to a boil.',
        'Reduce heat to low, cover, and simmer for 15 minutes.',
        'Remove from heat and let stand for 5 minutes, then fluff with a fork and let cool.',
        'In a large bowl, combine cooled quinoa, cucumber, tomatoes, bell pepper, red onion, olives, feta, and parsley.',
        'In a small bowl, whisk together olive oil, lemon juice, red wine vinegar, garlic, oregano, salt, and pepper.',
        'Pour dressing over salad and toss gently to combine.',
        'Refrigerate for at least 30 minutes before serving to allow flavors to meld.'
      ],
      date: '2025-04-05T18:20:00Z'
    },
    {
      _id: '3',
      title: 'Creamy Mushroom Risotto',
      description: 'A luxurious Italian rice dish cooked slowly with broth and finished with parmesan.',
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
      cookTime: 45,
      servings: 4,
      calories: 380,
      ingredients: [
        '1 1/2 cups arborio rice',
        '4 cups vegetable or chicken broth, warmed',
        '1/2 cup dry white wine',
        '8 oz mushrooms, sliced',
        '1 medium onion, finely diced',
        '2 cloves garlic, minced',
        '3 tbsp butter, divided',
        '2 tbsp olive oil',
        '1/2 cup grated Parmesan cheese',
        '2 tbsp fresh parsley, chopped',
        'Salt and black pepper to taste'
      ],
      instructions: [
        'In a saucepan, warm the broth over low heat.',
        'In a large skillet or pot, heat 1 tbsp butter and olive oil over medium heat.',
        'Add mushrooms and cook until golden brown, about 5 minutes. Remove and set aside.',
        'In the same pan, add the remaining butter, onion, and garlic. Cook until onion is translucent.',
        'Add rice and stir to coat with butter, cooking for 1-2 minutes until slightly toasted.',
        'Pour in wine and stir until absorbed.',
        'Add 1 cup of warm broth, stirring frequently until absorbed.',
        'Continue adding broth, 1/2 cup at a time, stirring and allowing each addition to be absorbed before adding more.',
        'After about 20-25 minutes, the rice should be al dente and the risotto creamy.',
        'Stir in the mushrooms, Parmesan, and parsley. Season with salt and pepper.',
        'Remove from heat and let stand for 2 minutes before serving.'
      ],
      date: '2025-04-01T19:45:00Z'
    }
  ];

  useEffect(() => {
    // In a real app, this would be an API call like:
    // const fetchSavedRecipes = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await axios.get('/api/recipes/saved');
    //     setSavedRecipes(res.data);
    //     setLoading(false);
    //   } catch (err) {
    //     console.error('Error fetching saved recipes:', err);
    //     setLoading(false);
    //   }
    // };
    // fetchSavedRecipes();

    // For demonstration, we'll use the demo data
    setTimeout(() => {
      setSavedRecipes(demoSavedRecipes);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRemoveRecipe = (id) => {
    // In a real app:
    // const removeRecipe = async (id) => {
    //   try {
    //     await axios.delete(`/api/recipes/saved/${id}`);
    //     setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== id));
    //   } catch (err) {
    //     console.error('Error removing recipe:', err);
    //   }
    // };
    // removeRecipe(id);

    // For demonstration:
    setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== id));
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className="saved-recipes-container">
      <h2 className="text-center mb-4">Your Saved Recipes</h2>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : savedRecipes.length === 0 ? (
        <div className="text-center py-5">
          <h4>You haven't saved any recipes yet.</h4>
          <p className="text-muted">Explore the Recipe Generator or Community Recipes to find dishes you love!</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {savedRecipes.map(recipe => (
            <Col key={recipe._id}>
              <Card className="h-100 recipe-card shadow-sm">
                <div 
                  className="recipe-image"
                  style={{ backgroundImage: `url(${recipe.image})` }}
                  onClick={() => handleViewRecipe(recipe)}
                />
                <Card.Body>
                  <Card.Title 
                    className="recipe-title"
                    onClick={() => handleViewRecipe(recipe)}
                  >
                    {recipe.title}
                  </Card.Title>
                  <Card.Text className="recipe-description">
                    {recipe.description}
                  </Card.Text>
                  <div className="recipe-stats">
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faClock} className="me-1 text-muted" />
                      <small className="text-muted">{recipe.cookTime} min</small>
                      <span className="mx-2">•</span>
                      <FontAwesomeIcon icon={faFireFlameCurved} className="me-1 text-muted" />
                      <small className="text-muted">{recipe.calories} cal</small>
                    </div>
                    <div>
                      <small className="text-muted">Saved on {formatDate(recipe.date)}</small>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0">
                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewRecipe(recipe)}
                    >
                      View Recipe
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleRemoveRecipe(recipe._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Recipe Detail Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        {selectedRecipe && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedRecipe.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="recipe-modal-image mb-3">
                <img src={selectedRecipe.image} alt={selectedRecipe.title} className="img-fluid rounded" />
              </div>
              
              <div className="recipe-modal-info mb-3">
                <div>
                  <FontAwesomeIcon icon={faClock} className="me-2" />
                  Cook Time: {selectedRecipe.cookTime} minutes
                </div>
                <div>
                  <FontAwesomeIcon icon={faUtensils} className="me-2" />
                  Servings: {selectedRecipe.servings}
                </div>
                <div>
                  <FontAwesomeIcon icon={faFireFlameCurved} className="me-2" />
                  Calories: {selectedRecipe.calories} per serving
                </div>
              </div>
              
              <p className="recipe-modal-description mb-4">{selectedRecipe.description}</p>
              
              <h5>Ingredients</h5>
              <ul className="ingredients-list">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              
              <h5 className="mt-4">Instructions</h5>
              <ol className="steps-list">
                {selectedRecipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="danger" onClick={() => {
                handleRemoveRecipe(selectedRecipe._id);
                setShowModal(false);
              }}>
                Remove from Saved
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default SavedRecipes;
