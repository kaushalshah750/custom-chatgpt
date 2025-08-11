// client/src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // <-- Import useNavigate and useParams
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { FaPlus, FaFolder, FaSun, FaMoon, FaChevronDown, FaChevronRight, FaAdjust, FaComment  } from 'react-icons/fa';
import MoveToFolderModal from './MoveToFolderModal'; // <-- Import the new modal component
import PersonalizeModal from './PersonalizeModal'; // <-- Import the modal

const Sidebar = ({ toggleDarkMode, isDarkMode }) => {
  const navigate = useNavigate(); // <-- Hook for navigation
  const { chatId: activeChatIdFromUrl } = useParams(); // <-- Get active ID from URL

  const { user, logout } = useAuthStore();
  const { chats, folders, activeChatId, setActiveChat, createNewChat, fetchUserData, createFolder, moveChatToFolder } = useChatStore();
  const [openFolders, setOpenFolders] = React.useState({});
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [chatToMoveId, setChatToMoveId] = useState(null);
  const [isPersonalizeModalOpen, setIsPersonalizeModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleSelectChat = (chatId) => {
    navigate(`/c/${chatId}`); // <-- Change URL on chat select
  };

  const handleCreateNewChat = async () => {
    // createNewChat now needs to return the new chat object so we can navigate
    const newChat = await createNewChat(); 
    if (newChat) {
      navigate(`/c/${newChat._id}`);
    }
  };
  
  const openMoveModal = (chatId) => {
    setChatToMoveId(chatId);
    setIsMoveModalOpen(true);
  };
  
  const closeMoveModal = () => {
    setChatToMoveId(null);
    setIsMoveModalOpen(false);
  };

  const handleMoveChat = (folderId) => {
    if (chatToMoveId && folderId) {
      moveChatToFolder(chatToMoveId, folderId);
    }
    closeMoveModal(); // Close the modal after moving
  };

  const createANewChat = () => {
    createNewChat();
  };

  const handleNewFolder = () => {
    const name = prompt("Enter new folder name:");
    if (name) {
      createFolder(name);
    }
  };
   
  const toggleFolder = (folderId) => {
    setOpenFolders(prev => ({...prev, [folderId]: !prev[folderId]}));
  };

  const unfiledChats = chats.filter(chat => !chat.folderId);

  return (
    <div className="w-72 bg-gray-100 dark:bg-gray-900 p-4 flex flex-col">
      <PersonalizeModal 
        isOpen={isPersonalizeModalOpen} 
        onClose={() => setIsPersonalizeModalOpen(false)} 
      />
      <MoveToFolderModal 
        isOpen={isMoveModalOpen}
        onClose={closeMoveModal}
        folders={folders}
        onMove={handleMoveChat}
      />

<div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">My ChatGPT</h1>
        <div>

        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <FaAdjust />
        </button>
        <button onClick={handleCreateNewChat} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <FaComment />
        </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={handleNewFolder} className="w-full flex items-center justify-center gap-2 p-2 mb-4 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
          <FaFolder /> New Folder
        </button>

      </div>

      <div className="flex-1 overflow-y-auto">
        {folders.map(folder => (
          // ... (folder rendering logic remains the same)
          <div key={folder._id} className="mb-2">
            <div onClick={() => toggleFolder(folder._id)} className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
              <h2 className="font-semibold text-sm flex items-center gap-2"><FaFolder /> {folder.name}</h2>
              {openFolders[folder._id] ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </div>
            {openFolders[folder._id] && (
              <ul className="ml-4 border-l border-gray-300 dark:border-gray-600">
                {chats.filter(c => c.folderId === folder._id).map(chat => (
                <li key={chat._id} onClick={() => handleSelectChat(chat._id)} className={`p-2 rounded cursor-pointer text-sm truncate ${activeChatIdFromUrl === chat._id ? 'bg-blue-200 dark:bg-blue-800' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                  {chat.title}
                </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        
        <h2 className="font-semibold text-sm mt-4 p-2">Chats</h2>
        <ul>
          {chats.filter(chat => !chat.folderId).map(chat => (
            <li key={chat._id} onClick={() => handleSelectChat(chat._id)} className={`group p-2 rounded cursor-pointer text-sm truncate flex justify-between items-center ${activeChatIdFromUrl === chat._id ? 'bg-blue-200 dark:bg-blue-800' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              <span>{chat.title}</span>
              {/* --- UPDATE THE "MOVE" BUTTON ONCLICK --- */}
              <button onClick={(e) => { e.stopPropagation(); openMoveModal(chat._id); }} className="opacity-0 group-hover:opacity-100 text-xs p-1 rounded bg-gray-300 dark:bg-gray-600 ml-2">
                Move
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto">
        <div className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" onClick={() => setIsPersonalizeModalOpen(true)}>
          <span className="font-semibold">{user?.displayName || user?.email}</span>
          <p className="text-xs text-gray-500">Customize GPT</p>
        </div>
        <button onClick={logout} className="w-full text-left p-2 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 mt-2">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;