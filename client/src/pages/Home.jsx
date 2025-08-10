// client/src/pages/Home.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

function Home() {
  // Simple dark mode toggle logic
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <Sidebar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <main className="flex-1 flex flex-col">
        <ChatWindow />
      </main>
    </div>
  );
}

export default Home;