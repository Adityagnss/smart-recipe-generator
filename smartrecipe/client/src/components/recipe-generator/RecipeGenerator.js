import React, { useState, useRef, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUpload, faWandMagicSparkles, faSave, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/auth/authContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './RecipeGenerator.css';

const RecipeGenerator = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user } = authContext;

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedRecipes([]);
      setError(null);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Trigger camera input click
  const handleCameraClick = () => {
    cameraInputRef.current.click();
  };

  // Generate recipes from the selected image
  const handleGenerateRecipes = async () => {
    if (!selectedImage) {
      toast.error('Please select or take a photo first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      const response = await api.post('/api/recipe-generator/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.recipes) {
        setGeneratedRecipes(response.data.recipes || []);
        
        if (response.data.recipes.length === 0) {
          toast.info('No recipes found for this image. Try another one!');
        } else {
          toast.success('Recipes generated successfully!');
        }
      } else {
        setError(response.data.msg || 'Failed to generate recipes');
        toast.error('Failed to generate recipes');
      }
    } catch (err) {
      console.error('Error generating recipes:', err);
      setError(err.response?.data?.msg || 'Error processing image');
      toast.error('Error processing image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="recipe-lens-container">
      <div className="top-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
          <h1>Recipe Lens</h1>
          <FontAwesomeIcon icon={faWandMagicSparkles} className="sparkle-icon" />
        </div>
      </div>
      
      <div className="main-content">
        <div className="image-upload-area">
          <h2 className="text-center">A food image to recipe converter for Indian Food</h2>
          
          <div className="uploaded-image-display">
            {previewUrl ? (
              <img id="up-image" src={previewUrl} alt="Food preview" />
            ) : (
              <div className="no-image-placeholder">
                <p>Upload an image or take a photo</p>
              </div>
            )}
          </div>
          
          <div className="image-form">
            <Form onSubmit={(e) => {
              e.preventDefault();
              handleGenerateRecipes();
            }}>
              <div className="upload-buttons">
                <Button 
                  className="upload-button" 
                  onClick={handleUploadClick}
                  disabled={isProcessing}
                >
                  <FontAwesomeIcon icon={faUpload} className="me-2" />
                  Upload Image
                </Button>
                
                <Button 
                  className="upload-button" 
                  onClick={handleCameraClick}
                  disabled={isProcessing}
                >
                  <FontAwesomeIcon icon={faCamera} className="me-2" />
                  Take a Picture
                </Button>
                
                <Form.Control
                  type="file"
                  ref={fileInputRef}
                  className="d-none"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
                <Form.Control
                  type="file"
                  ref={cameraInputRef}
                  className="d-none"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                />
              </div>
              
              <Button 
                className="generate-button" 
                type="submit"
                disabled={!selectedImage || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faWandMagicSparkles} className="me-2" />
                    Generate Recipe
                  </>
                )}
              </Button>
            </Form>
          </div>
        </div>
        
        {/* Recipe Results */}
        {generatedRecipes.length > 0 && (
          <div className="results-display-area">
            <h3 className="text-center mt-5">
              Here are some possible matches (might not be 100% accurate)
            </h3>
            
            {generatedRecipes.map((recipe, index) => (
              <div className="recipe-card" key={index}>
                <div className="container-blur">
                  <div className="blur-top"></div>
                  <div className="blur-bottom"></div>
                </div>
                
                <div className="recipe-content">
                  <div className="first-section">
                    <h2 className="recipe-name">{recipe.name}</h2>
                  </div>
                  
                  <div className="recipe-details">
                    <div className="second-section">
                      <h2>Ingredients</h2>
                      <p>
                        {recipe.ingredients}
                        <br />
                        Cooking Time: {recipe.cooking_time}
                      </p>
                    </div>
                    
                    <div className="third-section">
                      <h2>Directions</h2>
                      <p className="ing-dir-display-area">{recipe.directions}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <footer className="bottom-section">
        <div className="container-blur">
          <div className="blur-top"></div>
          <div className="blur-bottom"></div>
        </div>
        <h5>Smart Recipe - Recipe Lens Feature</h5>
      </footer>
    </div>
  );
};

export default RecipeGenerator;
