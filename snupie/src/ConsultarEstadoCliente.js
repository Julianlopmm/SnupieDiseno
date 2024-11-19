import React, { useState } from 'react';
import './ConsultarEstadoCliente.css'; // Asegúrate de tener un archivo CSS para estilos

function ConsultarEstadoCliente() {
  // Datos de ejemplo
  const usuarios = [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "María López" },
  ];

  const medicamentosPorUsuario = {
    1: [
      {
        id: 1,
        nombre: "Paracetamol",
        urlImagen: "https://via.placeholder.com/150",
        descripcion: "Medicamento para el alivio del dolor y la fiebre.",
        puntosAcumulados: 100,
        puntosUsados: 40,
        puntosDisponibles: 60,
      },
      {
        id: 3,
        nombre: "Amoxicilina",
        urlImagen: "https://via.placeholder.com/150",
        descripcion: "Antibiótico de amplio espectro.",
        puntosAcumulados: 120,
        puntosUsados: 50,
        puntosDisponibles: 70,
      },
    ],
    2: [
      {
        id: 2,
        nombre: "Ibuprofeno",
        urlImagen: "https://via.placeholder.com/150",
        descripcion: "Anti-inflamatorio y analgésico.",
        puntosAcumulados: 200,
        puntosUsados: 80,
        puntosDisponibles: 120,
      },
    ],
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);

  const handleUserChange = (event) => {
    const userId = parseInt(event.target.value, 10);
    setSelectedUser(userId);
    setMedicamentos(medicamentosPorUsuario[userId] || []);
  };

  // Calcular datos globales
  const totalMedicamentos = medicamentos.length;
  const totalPuntosAcumulados = medicamentos.reduce((sum, med) => sum + med.puntosAcumulados, 0);
  const totalPuntosUsados = medicamentos.reduce((sum, med) => sum + med.puntosUsados, 0);
  const totalPuntosDisponibles = medicamentos.reduce((sum, med) => sum + med.puntosDisponibles, 0);

  return (
    <div className="status-container">
      <h1 className="title">Snupie</h1>
      <h2 className="subtitle">Estado del Cliente</h2>
      <div className="user-selector">
        <label htmlFor="user-select">Seleccione un cliente:</label>
        <select id="user-select" onChange={handleUserChange} value={selectedUser || ""}>
          <option value="" disabled>
            -- Seleccionar --
          </option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombre}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <div className="global-stats">
          <h3>Resumen Global</h3>
          <p><strong>Total de medicamentos adquiridos y aprobados:</strong> {totalMedicamentos}</p>
          <p><strong>Cantidad de puntos globales acumulados:</strong> {totalPuntosAcumulados}</p>
          <p><strong>Cantidad de puntos globales usados en canjes:</strong> {totalPuntosUsados}</p>
          <p><strong>Cantidad de puntos globales disponibles:</strong> {totalPuntosDisponibles}</p>
        </div>
      )}

      <div className="medication-list">
        {medicamentos.length > 0 ? (
          medicamentos.map((medicamento) => (
            <div key={medicamento.id} className="medication-card">
              <h3 className="medication-name">{medicamento.nombre}</h3>
              <img
                src={medicamento.urlImagen}
                alt={medicamento.nombre}
                className="med-image"
              />
              <p><strong>Descripción:</strong> {medicamento.descripcion}</p>
              <p><strong>Puntos acumulados:</strong> {medicamento.puntosAcumulados}</p>
              <p><strong>Puntos usados en canjes:</strong> {medicamento.puntosUsados}</p>
              <p><strong>Puntos disponibles:</strong> {medicamento.puntosDisponibles}</p>
            </div>
          ))
        ) : (
          selectedUser && <p>No hay medicamentos asociados a este cliente.</p>
        )}
      </div>
    </div>
  );
}

export default ConsultarEstadoCliente;
