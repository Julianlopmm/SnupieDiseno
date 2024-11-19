import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPrincipal.css'; // Asegúrate de tener un archivo CSS para estilos

function MenuPrincipal() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const role = parseInt(localStorage.getItem('rol'), 10); // Convertir a número

  // Definir la lógica para desactivar botones según el rol
  const isSolicitudDisabled = role !== 1 && role !== 3;
  const isMedicamentoDisabled = role !== 1;
  const isRevisarDisabled = role !== 1 && role !== 2;
  const isConsultarEstadoDisabled = role !== 1 && role !== 3;

  return (
    <div className="main-menu-container">
      <h1 className="title">Snupie</h1>
      <h2 className="subtitle">Sistema de Puntos</h2>
      <div className="buttons-container">
        <button 
          className="menu-button" 
          onClick={() => handleNavigation('/registrarSolicitud')} 
          disabled={isSolicitudDisabled}
        >
          Registrar Solicitud
        </button>
        <button 
          className="menu-button" 
          onClick={() => handleNavigation('/asignarMedicamento')} 
          disabled={isMedicamentoDisabled}
        >
          Configurar Medicamentos
        </button>
        <button 
          className="menu-button" 
          onClick={() => handleNavigation('/revisarSolicitudes')} 
          disabled={isRevisarDisabled}
        >
          Revisar Solicitudes
        </button>
        <button 
          className="menu-button" 
          onClick={() => handleNavigation('/consultarEstadoCliente')} 
          disabled={isConsultarEstadoDisabled}
        >
          Consultar Estado Cliente
        </button>
      </div>
    </div>
  );
}

export default MenuPrincipal;
