// client/src/components/ChatInput.jsx
import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSend} className="flex items-center gap-4">
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
  );
};

export default ChatInput;