import React from 'react';
import './Auth.css'; // Asegúrate de tener un archivo CSS para estilos

function SignUp() {
  return (
    <div className="auth-container">
      <h1 className="title">Snupie</h1>
      <div className="auth-form">
        <label>Nombre</label>
        <input type="text" placeholder="Value" />

        <label>Correo electronico</label>
        <input type="email" placeholder="Value" />

        <label>Contraseña</label>
        <input type="password" placeholder="Value" />

        <label>Confirmar contraseña</label>
        <input type="password" placeholder="Value" />

        <button className="register-button">Registrar</button>
      </div>
    </div>
  );
}

export default SignUp;
