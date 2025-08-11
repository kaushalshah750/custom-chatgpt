// client/src/components/PersonalizeModal.jsx
import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const PersonalizeModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuthStore();
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [instructions, setInstructions] = useState(user.customInstructions || '');
  const [isEnabled, setIsEnabled] = useState(user.enableCustomInstructions ?? true);
  
  const handleSave = async () => {
    await updateProfile({
      displayName,
      customInstructions: instructions,
      enableCustomInstructions: isEnabled
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 text-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Customize ChatGPT</h2>
        <p className="text-sm text-gray-400 mb-6">Introduce yourself to get better, more personalized responses.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">What should ChatGPT call you?</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">What would you like ChatGPT to know about you to provide better responses?</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows="6" className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Enable for new chats</span>
            <button onClick={() => setIsEnabled(!isEnabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">Save</button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizeModal;