// client/src/components/ChatSettings.jsx
import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';

const ChatSettings = ({ chat, onClose }) => {
  const updateChatSettings = useChatStore((state) => state.updateChatSettings);
  const [model, setModel] = useState(chat.model);
  const [temperature, setTemperature] = useState(chat.temperature);
  const [systemPrompt, setSystemPrompt] = useState(chat.systemPrompt);
  
  const handleSave = () => {
    updateChatSettings(chat._id, { model, temperature, systemPrompt });
    onClose();
  };

  return (
    <div className="absolute top-14 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-96 z-10">
      <h3 className="font-bold text-lg mb-4">Chat Settings</h3>
      
      <div className="mb-4">
        <label htmlFor="model" className="block text-sm font-medium mb-1">Model</label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full p-2 border rounded bg-transparent"
        >
          <option value="gpt-5">GPT-5</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="temp" className="block text-sm font-medium mb-1">Temperature: {temperature}</label>
        <input
          id="temp"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="systemPrompt" className="block text-sm font-medium mb-1">System Prompt</label>
        <textarea
          id="systemPrompt"
          rows="4"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="w-full p-2 border rounded bg-transparent resize-y"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">Save</button>
      </div>
    </div>
  );
};

export default ChatSettings;