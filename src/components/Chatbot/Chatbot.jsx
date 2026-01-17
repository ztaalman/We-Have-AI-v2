import { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../../utils/geminiApi';
import './Chatbot.css';

const Chatbot = ({ onNavigate }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      isLocalResponse: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Use scrollIntoView with a specific configuration to prevent page scrolling
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setError('');

    try {
      // Get response from AI API
      await generateResponse(inputValue);
    } catch (err) {
      console.error('Error getting response:', err);
      setError('Failed to get a response. Please try again.');
      setIsTyping(false);
    }
  };

  const generateResponse = async (userInput) => {
    try {
      // First check for specific app-related queries to provide custom responses
      const input = userInput.toLowerCase();
      let botResponse = '';
      let isLocalResponse = false;

      if (input.includes('3d print') || input.includes('printing') || input.includes('cad')) {
        botResponse = "For 3D printing advice, I recommend checking out our CAD Analyzer tool. It can help optimize your models for better print results!";
        isLocalResponse = true;
      } else if (input.includes('game') || input.includes('play') || input.includes('tesla') || input.includes('jump')) {
        botResponse = "Looking for some fun? Try our TeslaJump game! Use the arrow keys to drive your Tesla Model 3 and see how high you can score.";
        isLocalResponse = true;
      } else if (input.includes('about this app') || input.includes('what can you do')) {
        botResponse = "I'm an AI assistant in zLab that can answer your questions, provide information, and help you navigate our tools. We have a CAD Analyzer for 3D printing optimization and a TeslaJump game for entertainment!";
        isLocalResponse = true;
      } else if (input.includes('hello') || input.includes('hi there') || input.includes('hey')) {
        botResponse = "Hello! I'm your AI assistant in zLab. How can I help you today?";
        isLocalResponse = true;
      } else if (input.includes('help')) {
        botResponse = "I can help you with information about 3D printing, our TeslaJump game, or answer general questions. What would you like to know?";
        isLocalResponse = true;
      } else if (input.includes('time') || input.includes('date') || input.includes('day')) {
        botResponse = `The current time is ${new Date().toLocaleTimeString()} and the date is ${new Date().toLocaleDateString()}.`;
        isLocalResponse = true;
      } else if (input.includes('thank')) {
        botResponse = "You're welcome! Let me know if you need anything else.";
        isLocalResponse = true;
      } else if (input.includes('bye') || input.includes('goodbye')) {
        botResponse = "Goodbye! Feel free to come back if you have more questions.";
        isLocalResponse = true;
      } else {
        // For general queries, use the AI API
        // Pass the current input AND the conversation history
        setIsLoading(true);

        try {
          console.log('Sending request to AI API...');

          // Pass messages state effectively serves as history
          botResponse = await getGeminiResponse(userInput, messages);

          console.log('Received response from AI API:', botResponse.substring(0, 50) + '...');

          // Check if the response is an error message or a local response from our API utility
          if (botResponse.includes("(Note:") || botResponse.includes("I couldn.t process that request") ||
            botResponse.includes("I'm having trouble with my authorization") ||
            botResponse.includes("I've reached my quota limit") ||
            botResponse.includes("The AI service is currently experiencing issues") ||
            botResponse.includes("The request timed out") ||
            botResponse.includes("I couldn't connect to the AI service") ||
            botResponse.includes("Sorry, I encountered an error") ||
            botResponse.includes("I'm currently having trouble connecting") ||
            botResponse.includes("I need to connect to my knowledge base") ||
            botResponse.includes("API key is missing") ||
            botResponse.includes("I encountered an issue")) {

            console.log('Received error or local response from API');
            // If we got an error message or local response from the API utility, mark as local
            isLocalResponse = true;
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
          // If API fails, use a fallback response system
          botResponse = getFallbackResponse(userInput);
          isLocalResponse = true;
        } finally {
          setIsLoading(false);
        }
      }

      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        isLocalResponse: isLocalResponse
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);

      // Fallback response in case of API failure
      const fallbackMessage = {
        id: messages.length + 2,
        text: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prevMessages => [...prevMessages, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Fallback response system when API is unavailable
  const getFallbackResponse = (input) => {
    const lowerInput = input.toLowerCase();

    // Simple keyword matching for common questions
    if (lowerInput.includes('weather') || lowerInput.includes('temperature') || lowerInput.includes('forecast')) {
      return "I'm sorry, I can't access real-time weather information at the moment. Please try again later.";
    } else if (lowerInput.includes('who are you') || lowerInput.includes('your name')) {
      return "I'm the zLab AI assistant, here to help you with information about our tools and features.";
    } else if (lowerInput.includes('how do you work') || lowerInput.includes('how were you made')) {
      return "I'm powered by AI technology and designed to assist users with the zLab application features.";
    } else {
      return "I'm currently operating in offline mode with limited capabilities. I can still help with basic information about our CAD Analyzer tool and TeslaJump game. For more complex questions, please try again later when our connection is restored.";
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      {/* Back Button */}
      <button className="return-button" onClick={() => onNavigate('hub')}>
        &lt; RETURN TO HUB
      </button>

      <div className="chatbot-header">
        <h1>AI CHATBOT CORE</h1>
        <p>SYSTEM ONLINE // FULLY INTEGRATED // ASK ANYTHING</p>
      </div>

      <div className="chat-window">
        <div className="messages-container">
          {messages.map(message => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.isError ? 'error-message' : ''}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="timestamp">
                  {formatTime(message.timestamp)}
                  {message.sender === 'bot' && (
                    message.isLocalResponse
                      ? <span className="local-badge">LOCAL</span>
                      : <span className="api-badge">NET</span>
                  )}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message bot-message">
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          {error && (
            <div className="message error-message">
              <div className="message-content">
                <p>{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} style={{ height: '1px', margin: 0, padding: 0 }} />
        </div>

        <form className="input-area" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="ENTER COMMAND OR QUERY..."
            disabled={isTyping}
          />
          <button type="submit" disabled={!inputValue.trim() || isTyping}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>

      {/* Hidden Info Panel styling handled in CSS */}
      <div className="chatbot-info">
        <p>System Ready</p>
      </div>
    </div>
  );
};

export default Chatbot;