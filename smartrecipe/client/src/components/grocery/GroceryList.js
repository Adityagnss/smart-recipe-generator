import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Button, ListGroup, InputGroup, Row, Col, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faListCheck, 
  faPlus, 
  faTrash, 
  faSearch, 
  faCheck, 
  faFileDownload,
  faSort,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import './GroceryList.css';
import AuthContext from '../../context/auth/authContext';
import api from '../../utils/api';

const GroceryList = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  
  const [groceryItems, setGroceryItems] = useState([]);
  const [groceryListId, setGroceryListId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChecked, setFilterChecked] = useState('all'); // 'all', 'checked', 'unchecked'

  // Fetch user's grocery items when component mounts
  useEffect(() => {
    const fetchGroceryItems = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/grocery');
        
        // If user has a grocery list, use it, otherwise create a new one
        if (res.data && res.data.length > 0) {
          setGroceryItems(res.data[0].items || []);
          // Store the grocery list ID for API calls
          setGroceryListId(res.data[0]._id);
        } else {
          // Create a new grocery list for the user
          const newList = await api.post('/api/grocery', {
            name: 'My Grocery List',
            items: []
          });
          setGroceryItems(newList.data.items || []);
          // Store the grocery list ID for API calls
          setGroceryListId(newList.data._id);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching grocery items:', err);
        toast.error('Failed to load your grocery list');
        setLoading(false);
      }
    };

    if (user) {
      fetchGroceryItems();
    }
  }, [user]);

  const handleAddItem = async () => {
    if (newItem.name.trim() === '') {
      toast.error('Please enter an item name');
      return;
    }
    
    const itemToAdd = {
      name: newItem.name,
      quantity: newItem.quantity || '',
      checked: false
    };
    
    try {
      const res = await api.post('/api/grocery/add-item/'+groceryListId, itemToAdd);
      setGroceryItems(res.data.items);
      setNewItem({ name: '', quantity: '' });
      toast.success('Item added to your grocery list');
    } catch (err) {
      console.error('Error adding item:', err);
      toast.error('Failed to add item to your grocery list');
    }
  };
  
  const handleRemoveItem = async (id) => {
    try {
      const res = await api.delete(`/api/grocery/remove-item/${groceryListId}/${id}`);
      setGroceryItems(res.data.items);
      toast.success('Item removed from your grocery list');
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Failed to remove item from your grocery list');
    }
  };
  
  const handleToggleChecked = async (id) => {
    try {
      const res = await api.put(`/api/grocery/toggle-item/${groceryListId}/${id}`);
      setGroceryItems(res.data.items);
    } catch (err) {
      console.error('Error toggling item:', err);
      toast.error('Failed to update item status');
    }
  };
  
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };
  
  const handleDownloadList = (format) => {
    // In a real app, this would generate and download a file
    toast.success(`Grocery list downloaded as ${format}`);
  };
  
  // Filter and search items
  const filteredItems = groceryItems
    .filter(item => {
      if (filterChecked === 'checked') return item.checked;
      if (filterChecked === 'unchecked') return !item.checked;
      return true;
    })
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  return (
    <div className="grocery-list-container">
      <h2 className="mb-4">
        <FontAwesomeIcon icon={faListCheck} className="me-2" />
        My Grocery List
      </h2>
      <small className="text-muted d-block mb-4">Ready to shop smart!</small>
      
      <Row>
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="search-container">
                  <InputGroup>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </div>
                
                <div className="filter-buttons">
                  <Dropdown className="me-2">
                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                      <FontAwesomeIcon icon={faFilter} className="me-1" />
                      Filter
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item 
                        active={filterChecked === 'all'}
                        onClick={() => setFilterChecked('all')}
                      >
                        Show All
                      </Dropdown.Item>
                      <Dropdown.Item 
                        active={filterChecked === 'checked'}
                        onClick={() => setFilterChecked('checked')}
                      >
                        Show Checked
                      </Dropdown.Item>
                      <Dropdown.Item 
                        active={filterChecked === 'unchecked'}
                        onClick={() => setFilterChecked('unchecked')}
                      >
                        Show Unchecked
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                      <FontAwesomeIcon icon={faFileDownload} className="me-1" />
                      Export
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleDownloadList('PDF')}>
                        Download as PDF
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDownloadList('Text')}>
                        Download as Text
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              
              <ListGroup variant="flush" className="grocery-items">
                {loading ? (
                  <ListGroup.Item className="text-center py-4">
                    <p className="mb-0 text-muted">Loading your grocery list...</p>
                  </ListGroup.Item>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <ListGroup.Item 
                      key={item._id}
                      className={`d-flex justify-content-between align-items-center ${item.checked ? 'checked' : ''}`}
                    >
                      <div className="item-check-name">
                        <Form.Check
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleToggleChecked(item._id)}
                          label={item.name}
                          className="item-checkbox"
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="item-quantity me-3">{item.quantity}</span>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-center py-4">
                    <p className="mb-0 text-muted">No items found</p>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Add New Item</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Item Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={handleNewItemChange}
                    placeholder="Enter item name"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Quantity (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="quantity"
                    value={newItem.quantity}
                    onChange={handleNewItemChange}
                    placeholder="e.g. 2 cups, 500g"
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={handleAddItem}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add Item
                </Button>
              </Form>
              
              <hr />
              
              <div className="list-summary">
                <h5 className="mb-3">List Summary</h5>
                <p className="mb-2">
                  <strong>Total Items:</strong> {groceryItems.length}
                </p>
                <p className="mb-2">
                  <strong>Items Checked:</strong> {groceryItems.filter(item => item.checked).length}
                </p>
                <p className="mb-0">
                  <strong>Items Remaining:</strong> {groceryItems.filter(item => !item.checked).length}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GroceryList;
