import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <h1 className="title">Snupie</h1>
      <div className="auth-form">
        <label>Email</label>
        <input type="email" placeholder="Value" />

        <label>Password</label>
        <input type="password" placeholder="Value" />

        <button 
          className="login-button"
          onClick={() => navigate('/menu-principal')}
        >Log In</button>
        <button 
          className="signup-button"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;
