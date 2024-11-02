import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Maneja el resultado de la respuesta, por ejemplo, guarda el token o datos del usuario
        console.log('Login exitoso:', data);
        navigate('/menu-principal');
      } else {
        console.error('Error en el login:', response.statusText);
        alert('Login fallido, revisa tus credenciales.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Error de red, intenta de nuevo.');
    }
  };

  return (
    <div className="auth-container">
      <h1 className="title">Snupie</h1>
      <div className="auth-form">
        <label>Email</label>
        <input 
          type="email" 
          placeholder="Value"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input 
          type="password" 
          placeholder="Value"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          className="login-button"
          onClick={handleLogin}
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
