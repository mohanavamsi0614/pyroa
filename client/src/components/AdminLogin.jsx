import { useState } from 'react';
import "../App.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  // Handle login
  const handleLogin = async () => {
    try {
      let loginData = { email, password };
      
      if (!email.includes('@')) {
        loginData = { username: email, password };
      }

      const response = await axios.post('http://localhost:5009/api/users/login', loginData);
      const { token, role } = response.data;

      setRole(role);
      localStorage.setItem('token', token);

      // Navigate based on role
      if (role === 'admin') {
        nav('/admin');
      } else if (role === 'user') {
        nav('/user');
      }
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <input
        type="text"
        placeholder="Email"
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button" onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
