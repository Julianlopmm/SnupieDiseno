import React from 'react';
import './Auth.css'; // Asegúrate de tener un archivo CSS para estilos

function Login() {
  return (
    <div className="auth-container">
      <h1 className="title">Snupie</h1>
      <div className="auth-form">
        <label>Email</label>
        <input type="email" placeholder="Value" />

        <label>Password</label>
        <input type="password" placeholder="Value" />

        <button className="login-button">Log In</button>
        <button className="signup-button">Sign Up</button>
      </div>
    </div>
  );
}

export default Login;
