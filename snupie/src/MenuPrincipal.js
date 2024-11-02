import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPrincipal.css'; // Asegúrate de tener un archivo CSS para estilos

function MenuPrincipal() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="main-menu-container">
      <h1 className="title">Snupie</h1>
      <h2 className="subtitle">Sistema de Puntos</h2>
      <div className="buttons-container">
        <button className="menu-button" onClick={() => handleNavigation('/registrarSolicitud')}>
          Registrar Solicitud
        </button>
        <button className="menu-button" onClick={() => handleNavigation('/asignarMedicamento')}>
          Configurar Medicamentos
        </button>
        <button className="menu-button" onClick={() => handleNavigation('/revisarSolicitudes')}>
          Revisar Solicitudes
        </button>
      </div>
    </div>
  );
}

export default MenuPrincipal;
