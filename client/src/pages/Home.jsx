// client/src/pages/Home.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { useChatStore } from '../store/useChatStore';

function Home() {
  const { chatId } = useParams(); // Get the chatId from the URL
  const navigate = useNavigate();
  const { chats, setActiveChat, fetchUserData } = useChatStore();

  useEffect(() => {
    // If there's a chatId in the URL, make it the active chat
    if (chatId) {
      setActiveChat(chatId);
    } else {
      // If we are at the base URL "/", we need to decide where to go.
      // Let's fetch the chats and redirect to the most recent one.
      const fetchAndRedirect = async () => {
        await fetchUserData(); // Ensure chats are loaded
        const mostRecentChat = useChatStore.getState().chats[0];
        if (mostRecentChat) {
          navigate(`/c/${mostRecentChat._id}`, { replace: true });
        }
      };
      fetchAndRedirect();
    }
  }, [chatId, setActiveChat, navigate, fetchUserData]);

  // Dark mode logic remains the same
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <Sidebar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <main className="flex-1 flex flex-col">
        {/* ChatWindow no longer needs props passed to it, it gets state from the store */}
        <ChatWindow /> 
      </main>
    </div>
  );
}

export default Home;