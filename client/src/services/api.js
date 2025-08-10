import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend URL
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');

    if (authStorage) {
      // 2. Parse the JSON string to get the Zustand state object
      const authState = JSON.parse(authStorage);
      
      // 3. Check if the token exists within the state
      if (authState.state && authState.state.token) {
        // 4. Set the Authorization header
        config.headers.Authorization = `Bearer ${authState.state.token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;