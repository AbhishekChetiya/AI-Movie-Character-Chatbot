import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import api from '../api.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider.jsx';
import { toast } from 'react-toastify';

const ChatBot = () => {
  const { isAuth, setIsAuth } = useAuth();
  const [isWaiting, setIsWaiting] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const toekn = localStorage.getItem('token');
    if (toekn) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
      navigate('/');
    }
  }, []);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your Avenger EndGame Dailouge AI assistant. How can I help you today?",
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isWaiting) return;

    setIsWaiting(true);

    const userMessage = {
      id: Date.now() + 1,
      type: 'user',
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await api.post('/Chat', { message: inputMessage }, { withCredentials: true });
      const botMessage = {
        id: Date.now() + 2,
        type: 'bot',
        content: response.data.message,
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      if (error.status === 403) {
        toast.error("Please Login Again. We are redirecting you to the login page.");

        localStorage.removeItem('token');
        setIsAuth(false);

        setTimeout(() => {
          navigate('/');
        }, 1000); 
      }

      const botMessage = {
        id: Date.now() + 2,
        type: 'bot',
        content: 'Some thing went wrong. Please try again later.',
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsWaiting(false);
      setInputMessage('');
    }
  };


  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-center text-gray-800">Avenger Moive Dialouge AI Assistant</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white shadow-md text-gray-800'
                  }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Send size={20} />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;