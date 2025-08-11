// client/src/components/ChatWindow.jsx
import React, { useRef, useEffect } from 'react'; // Removed useState
import { useChatStore } from '../store/useChatStore';
import Message from './Message';
import ChatSettings from './ChatSettings';
import ChatInput from './ChatInput'; // <-- Import the new component
import { FaCog } from 'react-icons/fa';

const ChatWindow = () => {
  // We get sendMessage directly from the store now. No local state for input.
  const { chats, messages, activeChatId, sendMessage, isLoading } = useChatStore();
  const [showSettings, setShowSettings] = React.useState(false);
  const messagesEndRef = useRef(null);
  
  const activeChat = chats.find(c => c._id === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  // The handleSend and input state logic is GONE from this component.

  if (!activeChatId || !activeChat) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Select or create a new chat</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{activeChat.title}</h2>
        <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <FaCog />
        </button>
      </div>

      {showSettings && <ChatSettings chat={activeChat} onClose={() => setShowSettings(false)} />}
      
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <Message 
            key={msg._id || index} 
            message={msg}
            isLastMessage={index === messages.length - 1}
            isStreaming={isLoading}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* RENDER THE NEW, ISOLATED INPUT COMPONENT */}
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;