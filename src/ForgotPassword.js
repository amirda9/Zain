import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function ForgotPassword({ onSignInClick }) {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your forgot password logic here
    console.log('Password reset link sent to', email);
    navigate('/home');
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Send Reset Link</button>
      </form>
      <div className="auth-links">
        <p onClick={onSignInClick}>Back to Sign In</p>
      </div>
    </div>
  );
}

export default ForgotPassword;
