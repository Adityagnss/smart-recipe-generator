import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/auth/authContext';

const ForgotPassword = () => {
  const authContext = useContext(AuthContext);
  const { forgotPassword } = authContext;

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onChange = e => setEmail(e.target.value);

  const onSubmit = async e => {
    e.preventDefault();
    
    if (email === '') {
      toast.error('Please enter your email address');
    } else {
      const result = await forgotPassword(email);
      if (result.success) {
        toast.success(result.msg);
        setIsSubmitted(true);
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
                  <h2 className="fw-bold">Forgot Password</h2>
                  <p className="text-muted">Enter your email to reset your password</p>
                </div>
                
                {!isSubmitted ? (
                  <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label>Email Address</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FontAwesomeIcon icon={faEnvelope} />
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

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 py-2 mb-3"
                      style={{ backgroundColor: '#4a8c70', borderColor: '#4a8c70' }}
                    >
                      Reset Password
                    </Button>
                  </Form>
                ) : (
                  <div className="text-center py-4">
                    <div className="mb-4">
                      <FontAwesomeIcon icon={faEnvelope} size="3x" className="text-success" />
                    </div>
                    <h5>Email Sent</h5>
                    <p className="text-muted">
                      We've sent a password reset link to your email. Please check your inbox.
                    </p>
                  </div>
                )}

                <div className="text-center mt-4">
                  <p className="mb-0">
                    <Link to="/" className="text-decoration-none fw-semibold">
                      Back to Login
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

export default ForgotPassword;
