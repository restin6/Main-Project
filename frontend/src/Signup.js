import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    otp: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/send-otp/', { email: formData.email });
      setOtpSent(true);
      alert("OTP sent to your email!");
    } catch (err) {
      alert("Failed to send OTP. Check your email address.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/signup/', formData);
      alert("Account Verified & Created!");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Signup failed"));
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Staff Registration</h2>
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          
          <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <button type="button" className="otp-button" onClick={sendOtp}>Send OTP</button>

          {otpSent && (
            <input type="text" placeholder="Enter OTP" onChange={(e) => setFormData({...formData, otp: e.target.value})} required />
          )}

          <input type="text" placeholder="Phone Number" onChange={(e) => setFormData({...formData, phone: e.target.value})} required />

          <div className="password-container">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          <button type="submit" className="signup-button">Verify & Register</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;