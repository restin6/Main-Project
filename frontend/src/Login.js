import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // This imports your new style!

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username: username,
        password: password
      });
      localStorage.setItem('userToken', response.data.token);
      alert("Login Successful! Welcome to the Staff Portal.");
    } catch (error) {
      alert("Unauthorized: Please check your Staff Credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Staff Portal</h2>
        <p>Exam Duty Distribution System</p>
        
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Username / Staff ID" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <button type="submit" className="login-button">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;