import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEdit, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import './FlavorMemories.css';
import AuthContext from '../../context/auth/authContext';
import api from '../../utils/api';

const FlavorMemories = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newMemory, setNewMemory] = useState({
    dishName: '',
    description: ''
  });
  
  const [editingMemory, setEditingMemory] = useState(null);
  
  // Fetch user's flavor memories when component mounts
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/memories');
        setMemories(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching memories:', err);
        toast.error('Failed to load your flavor memories');
        setLoading(false);
      }
    };

    if (user) {
      fetchMemories();
    }
  }, [user]);
  
  const handleAddMemory = async () => {
    if (newMemory.description.trim() === '') {
      toast.error('Please enter a description for your memory');
      return;
    }
    
    try {
      const res = await api.post('/api/memories', {
        dishName: newMemory.dishName,
        description: newMemory.description
      });
      
      setMemories([res.data, ...memories]);
      setNewMemory({ dishName: '', description: '' });
      toast.success('Memory saved successfully!');
    } catch (err) {
      console.error('Error adding memory:', err);
      toast.error('Failed to save your memory');
    }
  };
  
  const handleDeleteMemory = async (id) => {
    try {
      await api.delete(`/api/memories/${id}`);
      setMemories(memories.filter(memory => memory._id !== id));
      toast.success('Memory deleted');
    } catch (err) {
      console.error('Error deleting memory:', err);
      toast.error('Failed to delete memory');
    }
  };
  
  const handleEditMemory = (memory) => {
    setEditingMemory({ ...memory });
  };
  
  const handleUpdateMemory = async () => {
    if (editingMemory.description.trim() === '') {
      toast.error('Description cannot be empty');
      return;
    }
    
    try {
      const res = await api.put(`/api/memories/${editingMemory._id}`, {
        dishName: editingMemory.dishName,
        description: editingMemory.description
      });
      
      setMemories(
        memories.map(memory => 
          memory._id === editingMemory._id ? res.data : memory
        )
      );
      
      setEditingMemory(null);
      toast.success('Memory updated successfully!');
    } catch (err) {
      console.error('Error updating memory:', err);
      toast.error('Failed to update memory');
    }
  };
  
  const handleCancelEdit = () => {
    setEditingMemory(null);
  };
  
  const handleInputChange = (e, target) => {
    const { name, value } = e.target;
    
    if (target === 'new') {
      setNewMemory({ ...newMemory, [name]: value });
    } else if (target === 'edit') {
      setEditingMemory({ ...editingMemory, [name]: value });
    }
  };
  
  return (
    <div className="flavor-memories-container">
      <h2 className="mb-4">
        <FontAwesomeIcon icon={faHeart} className="me-2" />
        My Flavor Memories
      </h2>
      <small className="text-muted d-block mb-4">Let nostalgia cook the story</small>
      
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Create New Memory</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Dish Name (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="dishName"
                    value={newMemory.dishName}
                    onChange={(e) => handleInputChange(e, 'new')}
                    placeholder="What dish does this memory remind you of?"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={newMemory.description}
                    onChange={(e) => handleInputChange(e, 'new')}
                    placeholder="Describe the flavors, aromas, and memories associated with this dish..."
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={handleAddMemory}
                >
                  Save Memory
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          {loading ? (
            <div className="text-center py-5">
              <p className="text-muted">Loading your flavor memories...</p>
            </div>
          ) : (
            <div className="memories-grid">
              {memories.length > 0 ? (
                memories.map(memory => (
                  <Card key={memory._id} className="memory-card shadow-sm">
                    {editingMemory && editingMemory._id === memory._id ? (
                      // Edit Mode
                      <Card.Body>
                        <div className="edit-actions">
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={handleUpdateMemory}
                          >
                            <FontAwesomeIcon icon={faSave} />
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        </div>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Dish Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="dishName"
                            value={editingMemory.dishName}
                            onChange={(e) => handleInputChange(e, 'edit')}
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="description"
                            value={editingMemory.description}
                            onChange={(e) => handleInputChange(e, 'edit')}
                          />
                        </Form.Group>
                      </Card.Body>
                    ) : (
                      // View Mode
                      <Card.Body>
                        <div className="memory-actions">
                          <Button 
                            variant="light" 
                            size="sm"
                            onClick={() => handleEditMemory(memory)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button 
                            variant="light" 
                            size="sm"
                            onClick={() => handleDeleteMemory(memory._id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                        
                        <Card.Title>{memory.dishName || 'Untitled Memory'}</Card.Title>
                        <Card.Text className="memory-description">
                          {memory.description}
                        </Card.Text>
                        <small className="text-muted">
                          {new Date(memory.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </small>
                      </Card.Body>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">You haven't created any flavor memories yet. Create your first one!</p>
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default FlavorMemories;
