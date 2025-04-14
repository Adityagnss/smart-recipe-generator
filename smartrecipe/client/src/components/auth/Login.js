import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/auth/authContext';

const Login = ({ setIsAuthenticated }) => {
  const authContext = useContext(AuthContext);
  const { login, isAuthenticated, error, clearErrors } = authContext;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
      setIsAuthenticated(true);
    }

    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [isAuthenticated, error, navigate, clearErrors, setIsAuthenticated]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    if (email === '' || password === '') {
      toast.error('Please fill in all fields');
    } else {
      const result = await login({ email, password });
      if (result.success) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="auth-form-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Welcome Back</h2>
                  <p className="text-muted">Sign in to your Smart Recipe account</p>
                </div>
                
                <Form onSubmit={onSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between">
                      <Form.Label>Password</Form.Label>
                      <Link to="/forgot-password" className="text-decoration-none small">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-2 mb-3"
                    style={{ backgroundColor: '#4a8c70', borderColor: '#4a8c70' }}
                  >
                    Login
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none fw-semibold">
                      Create an Account
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
