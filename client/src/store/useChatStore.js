// client/src/store/useChatStore.js
import { create } from 'zustand';
import api from '../services/api';

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
    set({ activeChatId: chatId, messages: [], isLoading: true });
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
      get().setActiveChat(newChat._id);
    } catch (error) {
        console.error("Failed to create new chat", error);
    }
  },

  // Send a message
  sendMessage: async (messageContent) => {
    const { activeChatId, messages } = get();
    if (!activeChatId) return;

    // Add user message immediately for better UX
    const userMessage = { _id: Date.now(), role: 'user', content: messageContent, timestamp: new Date().toISOString() };
    set({ messages: [...messages, userMessage], isLoading: true });

    try {
      // Get current chat settings
      const currentChat = get().chats.find(c => c._id === activeChatId);
      const { data } = await api.post('/chat/message', {
        chatId: activeChatId,
        messageContent,
        model: currentChat.model,
        temperature: currentChat.temperature,
        systemPrompt: currentChat.systemPrompt,
      });

      const { assistantMessage, updatedChat } = data;

      // If the chat was updated (e.g., title changed), update it in the store
      if (updatedChat) {
        set((state) => ({
          chats: state.chats.map(c => c._id === updatedChat._id ? updatedChat : c),
        }));
      }


      // Replace placeholder user message and add assistant response
      set((state) => ({
        messages: [...state.messages.slice(0, -1), { ...userMessage, _id: assistantMessage.timestamp }, assistantMessage], // Use a more stable ID later
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally show an error message in the chat
      set({ isLoading: false });
    }
  },
}));