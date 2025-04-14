import React, { useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUtensils, 
  faListCheck, 
  faHeart, 
  faUsers, 
  faUser, 
  faSignOutAlt,
  faBookmark
} from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/auth/authContext';
import Chatbot from '../chatbot/Chatbot';
import './Dashboard.css';

const Dashboard = ({ setIsAuthenticated }) => {
  const authContext = useContext(AuthContext);
  const { user, logout, loadUser } = authContext;
  const navigate = useNavigate();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('recipe-generator');

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const onLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab === 'home' ? '' : tab}`);
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <Navbar bg="white" expand="lg" className="border-bottom shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} to="/dashboard" className="fw-bold text-primary">
            <FontAwesomeIcon icon={faUtensils} className="me-2" />
            Smart Recipe
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          
          <Navbar.Collapse id="navbar-nav" className="justify-content-end">
            <Nav>
              <div className="position-relative">
                <div 
                  className="user-profile d-flex align-items-center" 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="user-avatar me-2">
                    <FontAwesomeIcon icon={faUser} className="rounded-circle bg-light p-2" />
                  </div>
                  <div className="user-info d-none d-md-block">
                    <div className="fw-semibold">{user?.name || 'User'}</div>
                    <div className="text-muted small">{user?.email || 'user@example.com'}</div>
                  </div>
                </div>
                
                {showUserDropdown && (
                  <div className="user-dropdown shadow rounded bg-white position-absolute end-0 mt-2">
                    <div className="py-2 border-bottom">
                      <div className="dropdown-item" onClick={() => {
                        navigate('/dashboard');
                        setShowUserDropdown(false);
                      }}>
                        <FontAwesomeIcon icon={faUser} className="me-2" />
                        Profile
                      </div>
                      <div className="dropdown-item" onClick={() => {
                        navigate('/dashboard/saved-recipes');
                        setShowUserDropdown(false);
                      }}>
                        <FontAwesomeIcon icon={faBookmark} className="me-2" />
                        Saved Recipes
                      </div>
                    </div>
                    <div className="py-2">
                      <div className="dropdown-item text-danger" onClick={onLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                        Logout
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="dashboard-content d-flex">
        {/* Sidebar Navigation */}
        <div className="sidebar bg-dark text-white">
          <Nav className="flex-column pt-3">
            <Nav.Link 
              className={activeTab === 'recipe-generator' ? 'active' : ''} 
              onClick={() => handleTabClick('recipe-generator')}
            >
              <FontAwesomeIcon icon={faUtensils} className="me-3" />
              <span>Recipe Generator</span>
            </Nav.Link>
            <Nav.Link 
              className={activeTab === 'grocery-list' ? 'active' : ''} 
              onClick={() => handleTabClick('grocery-list')}
            >
              <FontAwesomeIcon icon={faListCheck} className="me-3" />
              <span>Grocery List</span>
            </Nav.Link>
            <Nav.Link 
              className={activeTab === 'flavor-memories' ? 'active' : ''} 
              onClick={() => handleTabClick('flavor-memories')}
            >
              <FontAwesomeIcon icon={faHeart} className="me-3" />
              <span>Flavor Memories</span>
            </Nav.Link>
            <Nav.Link 
              className={activeTab === 'community-recipes' ? 'active' : ''} 
              onClick={() => handleTabClick('community-recipes')}
            >
              <FontAwesomeIcon icon={faUsers} className="me-3" />
              <span>Community Recipes</span>
            </Nav.Link>
          </Nav>
        </div>

        {/* Main Content Area */}
        <div className="main-content bg-light">
          <Container fluid className="py-4">
            <Outlet />
          </Container>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Dashboard;
