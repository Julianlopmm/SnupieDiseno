import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Prepara el cuerpo de la solicitud
      const requestBody = { email, contrasena };
  
      // Imprime el cuerpo de la solicitud en la consola
      console.log('Cuerpo de la solicitud:', JSON.stringify(requestBody));
  
      // Realiza la solicitud
      const response = await fetch('https://api-snupie-diseno-1017614000153.us-central1.run.app/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Login exitoso:', data);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('rol', data.rol.id);
        navigate('/menu-principal');
      } else {
        console.error('Error en el login:', response.statusText, response.error);
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
          value={contrasena}
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
