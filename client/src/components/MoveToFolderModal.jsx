// client/src/components/MoveToFolderModal.jsx
import React from 'react';
import { FaFolder } from 'react-icons/fa';

const MoveToFolderModal = ({ isOpen, onClose, folders, onMove }) => {
  if (!isOpen) {
    return null;
  }

  // This function prevents the modal from closing when you click inside it
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center transition-opacity"
    >
      {/* Modal Content */}
      <div
        onClick={handleModalContentClick}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Move Chat to Folder</h3>
        
        <div className="max-h-60 overflow-y-auto pr-2">
          {folders.length > 0 ? (
            <ul className="space-y-2">
              {folders.map(folder => (
                <li key={folder._id}>
                  <button
                    onClick={() => onMove(folder._id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FaFolder className="text-blue-500" />
                    <span>{folder.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No folders created yet. Create a folder from the sidebar first.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveToFolderModal;