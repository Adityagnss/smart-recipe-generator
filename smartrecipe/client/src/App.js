import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

// Dashboard Components
import Dashboard from './components/dashboard/Dashboard';
import RecipeGenerator from './components/recipe-generator/RecipeGenerator';
import GroceryList from './components/grocery/GroceryList';
import FlavorMemories from './components/memories/FlavorMemories';
import CommunityRecipes from './components/community/CommunityRecipes';
import SavedRecipes from './components/recipes/SavedRecipes';

// Context and Auth
import AuthState from './context/auth/AuthState';
import setAuthToken from './utils/setAuthToken';

// Check for token
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated when component mounts
    if (localStorage.token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Protected route component
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  return (
    <AuthState>
      <div className="App">
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard setIsAuthenticated={setIsAuthenticated} />
              </PrivateRoute>
            } 
          >
            <Route index element={<RecipeGenerator />} />
            <Route path="recipe-generator" element={<RecipeGenerator />} />
            <Route path="grocery-list" element={<GroceryList />} />
            <Route path="flavor-memories" element={<FlavorMemories />} />
            <Route path="community-recipes" element={<CommunityRecipes />} />
            <Route path="saved-recipes" element={<SavedRecipes />} />
          </Route>
        </Routes>
      </div>
    </AuthState>
  );
};

export default App;
