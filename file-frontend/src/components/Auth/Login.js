// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './Auth.css'; // Import Auth styles
import Notification from '../Notification/Notification';
import '../Notification/Notification.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Failed to login', type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;