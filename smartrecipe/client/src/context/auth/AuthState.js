import React, { useState } from 'react';
import AuthContext from './authContext';
import setAuthToken from '../../utils/setAuthToken';
import api from '../../utils/api';

const AuthState = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load User
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await api.get('/api/auth');
      setUser(res.data);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      setError(err.response?.data?.msg || 'Server Error');
    }
  };

  // Register User
  const register = async (formData) => {
    try {
      const res = await api.post('/api/users', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      await loadUser();
      return { success: true };
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      setError(err.response?.data?.msg || 'Server Error');
      return { success: false, error: err.response?.data?.msg || 'Server Error' };
    }
  };

  // Login User
  const login = async (formData) => {
    try {
      const res = await api.post('/api/auth', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      await loadUser();
      return { success: true };
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      setError(err.response?.data?.msg || 'Server Error');
      return { success: false, error: err.response?.data?.msg || 'Server Error' };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      return { success: true, msg: res.data.msg };
    } catch (err) {
      setError(err.response?.data?.msg || 'Server Error');
      return { success: false, error: err.response?.data?.msg || 'Server Error' };
    }
  };

  // Clear Errors
  const clearErrors = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        error,
        register,
        loadUser,
        login,
        logout,
        forgotPassword,
        clearErrors
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
