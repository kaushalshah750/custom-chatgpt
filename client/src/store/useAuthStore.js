// client/src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api'; // Import api service

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (userData) => set({ user: userData, token: userData.token }),
      logout: () => set({ user: null, token: null }),
      
      // --- NEW ACTION TO UPDATE PROFILE ---
      updateProfile: async (profileData) => {
        try {
          const { data: updatedUser } = await api.patch('/users/profile', profileData);
          set((state) => ({
            user: { ...state.user, ...updatedUser },
          }));
          return { success: true };
        } catch (error) {
          console.error("Failed to update profile:", error);
          return { success: false, error };
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);