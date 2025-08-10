// client/src/components/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import Message from './Message';
import ChatSettings from './ChatSettings'; // <-- Import
import { FaPaperPlane, FaCog } from 'react-icons/fa'; // <-- Import FaCog

const TypingIndicator = () => (
  <div className="flex items-center space-x-2">
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
  </div>
);

const ChatWindow = () => {
  const { messages, activeChatId, sendMessage, isLoading, chats } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);

  const activeChat = chats.find(c => c._id === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && activeChatId && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  
  if (!activeChatId || !activeChat) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Select or create a new chat</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-screen relative overflow-x-auto"> {/* <-- Add relative positioning */}
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{activeChat.title}</h2>
        <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <FaCog />
        </button>
      </div>

      {showSettings && <ChatSettings chat={activeChat} onClose={() => setShowSettings(false)} />}
      
      {/* ... (rest of the component, messages list and input form) */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <Message key={msg._id || index} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-lg">
                  <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSend} className="flex items-center gap-4">
            {/* File attachment placeholder */}
            <button type="button" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" title="Attach file (not implemented)">📎</button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSend(e); }}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="1"
            />
            <button type="submit" disabled={isLoading} className="p-3 text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-400">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;