// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { email, password });
      register(data);
      navigate('/');
    } catch (error) {
      console.error('Register failed:', error);
      alert('Register failed. Check console.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full p-2 mb-4 border rounded" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full p-2 mb-4 border rounded" />
        <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">Register</button>
      </form>
    </div>
  );
};

export default Register;