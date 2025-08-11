// client/src/store/useChatStore.js
import { create } from 'zustand';
import api from '../services/api';
import { fetchEventSource } from '@microsoft/fetch-event-source';

export const useChatStore = create((set, get) => ({
  chats: [],
  folders: [],
  activeChatId: null,
  messages: [],
  isLoading: false, // For typing indicator


  // Add this action inside the create() function
  updateChatSettings: async (chatId, settings) => {
    try {
      const { data: updatedChat } = await api.patch(`/chat/${chatId}/settings`, settings);
      set((state) => ({
        chats: state.chats.map(c => c._id === chatId ? updatedChat : c),
      }));
    } catch (error) {
      console.error("Failed to update chat settings:", error);
    }
  },

  createFolder: async (name) => {
    try {
      const { data: newFolder } = await api.post('/folders', { name });
      set((state) => ({ folders: [...state.folders, newFolder] }));
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  },

  moveChatToFolder: async (chatId, folderId) => {
    try {
      const { data: updatedChat } = await api.patch(`/chat/${chatId}/folder`, { folderId });
      set((state) => ({
        chats: state.chats.map(c => c._id === chatId ? updatedChat : c),
      }));
    } catch (error) {
      console.error("Failed to move chat:", error);
    }
  },

  // Fetch all user data (chats and folders)
  fetchUserData: async () => {
    try {
      const { data } = await api.get('/chat/user-data');
      set({ chats: data.chats, folders: data.folders });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  },

  // Set the active chat and fetch its history
  setActiveChat: async (chatId) => {
    if (!chatId || get().activeChatId === chatId) return; // Prevent re-fetching same chat

    set({ activeChatId: chatId, messages: [], isLoading: true }); // Show loading state
    try {
      const { data } = await api.get(`/chat/history/${chatId}`);
      set({ messages: data });
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Create a new chat
  createNewChat: async () => {
    try {
      const { data: newChat } = await api.post('/chat/new');
      set((state) => ({ chats: [newChat, ...state.chats] }));
      // DON'T call setActiveChat here anymore. Instead, return the chat object.
      return newChat; // <-- RETURN THE NEW CHAT
    } catch (error) {
        console.error("Failed to create new chat", error);
        return null;
    }
  },

  // Send a message
  sendMessage: async (messageContent) => {
    const { activeChatId, messages, chats } = get();
    if (!activeChatId) return;

    // Add user message immediately for better UX
    const userMessage = { _id: Date.now().toString(), role: 'user', content: messageContent, timestamp: new Date().toISOString() };
    // Add a placeholder for the assistant's message
    const assistantPlaceholder = { _id: (Date.now() + 1).toString(), role: 'assistant', content: '', timestamp: new Date().toISOString() };
    
    set({ 
      messages: [...messages, userMessage, assistantPlaceholder],
      isLoading: true 
    });

    const currentChat = chats.find(c => c._id === activeChatId);
    const token = JSON.parse(localStorage.getItem('auth-storage')).state.token;

    await fetchEventSource(`http://localhost:5001/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        chatId: activeChatId,
        messageContent,
        model: currentChat.model,
        temperature: currentChat.temperature,
        systemPrompt: currentChat.systemPrompt,
      }),
      
      onmessage(event) {
        const parsedData = JSON.parse(event.data);

        // Handle different event types from the server
        switch (parsedData.type) {
          case 'chatUpdate':
            // The title was updated on the backend
            set(state => ({
              chats: state.chats.map(c => c._id === parsedData.data._id ? parsedData.data : c)
            }));
            break;

          case 'content':
            // Append the new content chunk to the assistant's message
            set(state => ({
              messages: state.messages.map(msg => 
                msg._id === assistantPlaceholder._id 
                  ? { ...msg, content: msg.content + parsedData.data }
                  : msg
              )
            }));
            break;
            
          case 'done':
            // The stream is finished
            set({ isLoading: false });
            // At this point, you could optionally refetch the last message to get its final DB _id
            break;

          case 'error':
            // Handle server-side errors
            console.error("Stream error:", parsedData.data);
            set(state => ({
              messages: state.messages.map(msg => 
                msg._id === assistantPlaceholder._id 
                  ? { ...msg, content: "Sorry, an error occurred." }
                  : msg
              ),
              isLoading: false
            }));
            break;
        }
      },
      
      onerror(err) {
        console.error("Fetch Event Source error:", err);
        set({ isLoading: false });
        // Make sure to re-throw the error so it can be caught by the user
        throw err;
      }
    });
  },
}));