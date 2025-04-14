import React, { useState, useRef, useEffect, useContext } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Chatbot.css';
import api from '../../utils/api';
import AuthContext from '../../context/auth/authContext';
import { toast } from 'react-toastify';

const Chatbot = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user } = authContext;
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize or reset messages when chatbot is opened
  useEffect(() => {
    if (isOpen) {
      setMessages([{ 
        id: Date.now(), 
        text: "Hi there! I'm your Smart Recipe assistant powered by Gemini AI. Need help with recipes or cooking tips? I'm here to provide detailed advice!", 
        sender: 'bot' 
      }]);
    } else {
      setMessages([]);
      setNewMessage('');
    }
  }, [isOpen]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    try {
      if (!isAuthenticated) {
        // If not authenticated, use local response
        setTimeout(() => {
          const botResponse = getLocalBotResponse(newMessage);
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: botResponse,
            sender: 'bot'
          }]);
          setIsTyping(false);
        }, 1000);
        return;
      }
      
      // Get response from Gemini through our backend
      const response = await api.post('/api/chatbot', { message: newMessage });
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: response.data.response,
        sender: 'bot'
      }]);
    } catch (err) {
      console.error('Error getting chatbot response:', err);
      
      // Check if this is a rate limit error
      let errorMessage = "I'm having trouble connecting to my knowledge base right now. Let me provide a simpler response.";
      
      if (err.response) {
        if (err.response.status === 429) {
          errorMessage = "I've reached my conversation limit for now. Please try again in a minute or let me give you a simpler response.";
          toast.warning('Chatbot rate limit reached. Please wait a moment before sending more messages.');
        } else {
          toast.error('Chatbot service is experiencing issues');
        }
      } else {
        toast.error('Chatbot service is experiencing issues');
      }
      
      // Fallback to local response
      const localResponse = getLocalBotResponse(newMessage);
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: errorMessage + "\n\n" + localResponse,
        sender: 'bot'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Local fallback responses if API is unavailable
  const getLocalBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return 'Hello! How can I help you with your cooking today?';
    }
    
    if (input.includes('recipe') && (input.includes('generate') || input.includes('create') || input.includes('make'))) {
      return 'To generate a recipe, go to the Recipe Generator tab. You can either select ingredients from the dropdown or upload a photo of a dish you want to recreate!';
    }
    
    if (input.includes('grocery') || input.includes('shopping list')) {
      return 'Your grocery list can be managed in the Grocery List tab. You can add items manually or generate a list automatically from any recipe!';
    }
    
    if (input.includes('save') || input.includes('saved recipe')) {
      return 'To save a recipe, click the Save button on any recipe card. You can access your saved recipes by clicking your profile icon at the top right.';
    }
    
    if (input.includes('calorie') || input.includes('nutrition')) {
      return 'Calorie information is displayed on each recipe. For more detailed nutritional information, click on the recipe to view its full details!';
    }
    
    if (input.includes('contact') || input.includes('help') || input.includes('support')) {
      return 'For additional support, please contact our helpline at support@smartrecipe.com or call us at 1-800-RECIPES.';
    }
    
    if (input.includes('thank')) {
      return "You're welcome! Happy cooking!";
    }
    
    return "I'm not sure I understand. Try asking about recipes, grocery lists, or how to use specific features of the app!";
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h5 className="mb-0">
              <FontAwesomeIcon icon={faRobot} className="me-2" />
              Recipe Assistant
            </h5>
            <Button 
              variant="link" 
              className="p-0 text-white" 
              onClick={toggleChatbot}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.sender}`}
              >
                {message.text.split('\n').map((line, i) => (
                  <p key={i} className="mb-1">{line}</p>
                ))}
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot typing">
                <Spinner animation="grow" size="sm" />
                <Spinner animation="grow" size="sm" className="mx-1" />
                <Spinner animation="grow" size="sm" />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <Form onSubmit={handleSendMessage} className="chatbot-input">
            <Form.Control
              type="text"
              placeholder="Ask me about recipes, cooking tips, or ingredients..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              autoFocus
              disabled={isTyping}
            />
            <Button type="submit" variant="primary" disabled={isTyping}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </Form>
          
          {!isAuthenticated && (
            <div className="chatbot-auth-notice">
              <small>Sign in for Gemini AI-powered detailed responses</small>
            </div>
          )}
        </div>
      )}
      
      <Button 
        className="chatbot-toggle"
        onClick={toggleChatbot}
        title="Need help or a recipe? I'm here to help!"
      >
        <FontAwesomeIcon icon={faRobot} />
      </Button>
    </div>
  );
};

export default Chatbot;
