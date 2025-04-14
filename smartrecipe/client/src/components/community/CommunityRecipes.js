import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Row, Col, Form, InputGroup, Modal, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faSearch, 
  faPlus, 
  faHeart, 
  faComment, 
  faUpload,
  faUser,
  faClock,
  faUtensils
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import './CommunityRecipes.css';
import AuthContext from '../../context/auth/authContext';
import api from '../../utils/api';

const CommunityRecipes = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  
  const [communityRecipes, setCommunityRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    ingredients: '',
    steps: '',
    imageUrl: '',
    isPublic: true
  });

  // Fetch community recipes when component mounts
  useEffect(() => {
    const fetchCommunityRecipes = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/recipes/community');
        
        // Get user's likes to determine which recipes the user has already liked
        if (user) {
          const userLikesRes = await api.get('/api/users/likes');
          const userLikes = userLikesRes.data || [];
          
          // Mark recipes that the user has already liked
          const recipesWithLikeStatus = res.data.map(recipe => ({
            ...recipe,
            hasUserLiked: recipe.likes.some(like => like === user.id)
          }));
          
          setCommunityRecipes(recipesWithLikeStatus);
        } else {
          setCommunityRecipes(res.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching community recipes:', err);
        toast.error('Failed to load community recipes');
        setLoading(false);
      }
    };

    fetchCommunityRecipes();
  }, [user]);

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const handleLikeRecipe = async (id) => {
    try {
      if (!user) {
        toast.error('Please log in to like recipes');
        return;
      }
      
      const recipe = communityRecipes.find(r => r._id === id);
      
      if (recipe.hasUserLiked) {
        // Unlike the recipe
        await api.put(`/api/recipes/unlike/${id}`);
        
        setCommunityRecipes(communityRecipes.map(r => 
          r._id === id 
            ? { 
                ...r, 
                likes: r.likes.filter(like => like !== user.id),
                hasUserLiked: false
              } 
            : r
        ));
        
        if (selectedRecipe && selectedRecipe._id === id) {
          setSelectedRecipe({
            ...selectedRecipe,
            likes: selectedRecipe.likes.filter(like => like !== user.id),
            hasUserLiked: false
          });
        }
        
        toast.success('Recipe unliked');
      } else {
        // Like the recipe
        await api.put(`/api/recipes/like/${id}`);
        
        setCommunityRecipes(communityRecipes.map(r => 
          r._id === id 
            ? { 
                ...r, 
                likes: [...r.likes, user.id],
                hasUserLiked: true
              } 
            : r
        ));
        
        if (selectedRecipe && selectedRecipe._id === id) {
          setSelectedRecipe({
            ...selectedRecipe,
            likes: [...selectedRecipe.likes, user.id],
            hasUserLiked: true
          });
        }
        
        toast.success('Recipe liked');
      }
    } catch (err) {
      console.error('Error liking/unliking recipe:', err);
      toast.error('Failed to like/unlike recipe');
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      toast.error('Please enter a comment');
      return;
    }

    if (!user) {
      toast.error('Please log in to comment');
      return;
    }

    try {
      const res = await api.post(`/api/recipes/comment/${selectedRecipe._id}`, {
        text: newComment
      });
      
      // Update the selected recipe with the new comment
      setSelectedRecipe({
        ...selectedRecipe,
        comments: res.data
      });
      
      // Update the recipe in the community recipes list
      setCommunityRecipes(communityRecipes.map(recipe => 
        recipe._id === selectedRecipe._id 
          ? { ...recipe, comments: res.data } 
          : recipe
      ));
      
      setNewComment('');
      toast.success('Comment added');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
    }
  };

  const handleUploadRecipe = async () => {
    // Validate inputs
    if (newRecipe.title.trim() === '') {
      toast.error('Please enter a recipe title');
      return;
    }
    
    if (newRecipe.description.trim() === '') {
      toast.error('Please enter a recipe description');
      return;
    }
    
    if (newRecipe.ingredients.trim() === '') {
      toast.error('Please enter recipe ingredients');
      return;
    }
    
    if (newRecipe.steps.trim() === '') {
      toast.error('Please enter recipe steps');
      return;
    }

    try {
      // Format ingredients and steps as arrays
      const formattedRecipe = {
        ...newRecipe,
        ingredients: newRecipe.ingredients.split('\n').filter(ing => ing.trim() !== ''),
        steps: newRecipe.steps.split('\n').filter(step => step.trim() !== '')
      };
      
      const res = await api.post('/api/recipes', formattedRecipe);
      
      // Add the new recipe to the community recipes list if it's public
      if (formattedRecipe.isPublic) {
        setCommunityRecipes([
          {
            ...res.data,
            hasUserLiked: false
          },
          ...communityRecipes
        ]);
      }
      
      // Reset form and close modal
      setNewRecipe({
        title: '',
        description: '',
        ingredients: '',
        steps: '',
        imageUrl: '',
        isPublic: true
      });
      
      setShowUploadModal(false);
      toast.success('Recipe uploaded successfully');
    } catch (err) {
      console.error('Error uploading recipe:', err);
      toast.error('Failed to upload recipe');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRecipe({
      ...newRecipe,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Filter recipes based on search term
  const filteredRecipes = communityRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="community-recipes-container">
      <h2 className="mb-4">
        <FontAwesomeIcon icon={faUsers} className="me-2" />
        Community Recipes
      </h2>
      <small className="text-muted d-block mb-4">Discover and share recipes with the community</small>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="search-container">
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => setShowUploadModal(true)}
        >
          <FontAwesomeIcon icon={faUpload} className="me-2" />
          Share Recipe
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <p className="text-muted">Loading community recipes...</p>
        </div>
      ) : filteredRecipes.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredRecipes.map(recipe => (
            <Col key={recipe._id}>
              <Card className="h-100 recipe-card shadow-sm">
                <div className="recipe-image-container">
                  <Card.Img 
                    variant="top" 
                    src={recipe.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={recipe.title}
                    className="recipe-image"
                  />
                </div>
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text className="recipe-description">
                    {recipe.description.length > 100 
                      ? `${recipe.description.substring(0, 100)}...` 
                      : recipe.description}
                  </Card.Text>
                  
                  <div className="recipe-meta">
                    <div className="recipe-author">
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      <span>{recipe.user && recipe.user.name ? recipe.user.name : 'User'}</span>
                    </div>
                    <div className="recipe-date">
                      <FontAwesomeIcon icon={faClock} className="me-1" />
                      <span>{new Date(recipe.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="recipe-stats">
                      <span className="me-3">
                        <FontAwesomeIcon 
                          icon={faHeart} 
                          className={`me-1 ${recipe.hasUserLiked ? 'text-danger' : 'text-muted'}`} 
                        />
                        {recipe.likes ? recipe.likes.length : 0}
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faComment} className="me-1 text-muted" />
                        {recipe.comments ? recipe.comments.length : 0}
                      </span>
                    </div>
                    <div className="recipe-actions">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewRecipe(recipe)}
                      >
                        View Recipe
                      </Button>
                    </div>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted">No recipes found. Try a different search term or be the first to share a recipe!</p>
        </div>
      )}
      
      {/* Recipe Detail Modal */}
      <Modal 
        show={showRecipeModal} 
        onHide={() => setShowRecipeModal(false)}
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
                <img 
                  src={selectedRecipe.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'} 
                  alt={selectedRecipe.title} 
                  className="img-fluid rounded"
                />
              </div>
              
              <div className="recipe-modal-info mb-3">
                <div className="author">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  <span>{selectedRecipe.user && selectedRecipe.user.name ? selectedRecipe.user.name : 'User'}</span>
                </div>
                <div className="date">
                  <FontAwesomeIcon icon={faClock} className="me-1" />
                  <span>{new Date(selectedRecipe.date).toLocaleDateString()}</span>
                </div>
                <div className="likes">
                  <FontAwesomeIcon 
                    icon={faHeart} 
                    className={`me-1 ${selectedRecipe.hasUserLiked ? 'text-danger' : 'text-muted'}`} 
                  />
                  <span>{selectedRecipe.likes ? selectedRecipe.likes.length : 0} likes</span>
                </div>
              </div>
              
              <p className="recipe-modal-description mb-4">{selectedRecipe.description}</p>
              
              <div className="recipe-modal-content mb-4">
                <h5>
                  <FontAwesomeIcon icon={faUtensils} className="me-2" />
                  Ingredients
                </h5>
                <ul className="ingredients-list">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div className="recipe-modal-content mb-4">
                <h5>Instructions</h5>
                <ol className="steps-list">
                  {selectedRecipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              
              <div className="recipe-modal-comments">
                <h5>Comments ({selectedRecipe.comments ? selectedRecipe.comments.length : 0})</h5>
                <div className="comments-section">
                  {selectedRecipe.comments && selectedRecipe.comments.length > 0 ? (
                    selectedRecipe.comments.map(comment => (
                      <div key={comment._id} className="comment-item">
                        <div className="comment-author">
                          <FontAwesomeIcon icon={faUser} className="me-1" />
                          <span>{comment.user && comment.user.name ? comment.user.name : 'User'}</span>
                        </div>
                        <div className="comment-text">{comment.text}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No comments yet. Be the first to comment!</p>
                  )}
                </div>
                
                <div className="add-comment-section mt-3">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="mb-2"
                  />
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={handleAddComment}
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowRecipeModal(false)}>
                Close
              </Button>
              <Button 
                variant={selectedRecipe.hasUserLiked ? "outline-danger" : "danger"}
                onClick={() => handleLikeRecipe(selectedRecipe._id)}
              >
                <FontAwesomeIcon icon={faHeart} className="me-1" />
                {selectedRecipe.hasUserLiked ? 'Unlike' : 'Like'}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
      
      {/* Upload Recipe Modal */}
      <Modal 
        show={showUploadModal} 
        onHide={() => setShowUploadModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Share Your Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Recipe Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newRecipe.title}
                onChange={handleInputChange}
                placeholder="Enter recipe title"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newRecipe.description}
                onChange={handleInputChange}
                placeholder="Describe your recipe"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Ingredients (one per line)</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="ingredients"
                value={newRecipe.ingredients}
                onChange={handleInputChange}
                placeholder="500g chicken breast&#10;2 tbsp olive oil&#10;3 cloves garlic"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Steps (one per line)</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="steps"
                value={newRecipe.steps}
                onChange={handleInputChange}
                placeholder="Preheat oven to 350°F&#10;Mix ingredients in a bowl&#10;Bake for 30 minutes"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Image URL (optional)</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={newRecipe.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/your-image.jpg"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Share with community"
                name="isPublic"
                checked={newRecipe.isPublic}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUploadRecipe}>
            Upload Recipe
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommunityRecipes;
