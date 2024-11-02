import React, { useState } from 'react';
import './Auth.css'; // Asegúrate de tener un archivo CSS para estilos

function SignUp() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  const handleSubmit = async () => {
    if (contrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const usuarioData = {
      nombre,
      email: correo,
      contrasena: contrasena,
      rol: 3 
    };
    

    try {
      const response = await fetch('http://localhost:8080/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el usuario');
      }

      const nuevoUsuario = await response.json();
      console.log('Usuario registrado:', nuevoUsuario);
      alert('Usuario registrado correctamente');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Hubo un error al registrar el usuario');
    }
  };

  return (
    <div className="auth-container">
      <h1 className="title">Snupie</h1>
      <div className="auth-form">
        <label>Nombre</label>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />

        <label>Correo electronico</label>
        <input type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} />

        <label>Contraseña</label>
        <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />

        <label>Confirmar contraseña</label>
        <input type="password" placeholder="Confirmar contraseña" value={confirmarContrasena} onChange={(e) => setConfirmarContrasena(e.target.value)} />

        <button className="register-button" onClick={handleSubmit}>Registrar</button>
      </div>
    </div>
  );
}

export default SignUp;
