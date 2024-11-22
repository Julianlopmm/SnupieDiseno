import React, { useState, useEffect } from 'react';
import './ConsultarEstadoCliente.css';
import { useNavigate } from 'react-router-dom';

function ConsultarEstadoCliente() {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);

  // Hook para obtener los usuarios al cargar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('https://api-snupie-diseno-1017614000153.us-central1.run.app/usuarios');
        if (!response.ok) {
          throw new Error('Error al obtener la lista de usuarios');
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);


  const navigate = useNavigate();

// Función para manejar el clic en "Ver detalle"
const handleVerDetalle = (medicamento) => {
  navigate('/detalle-medicamento', {
    state: { medicamento, userId: selectedUser }, // Pasamos el userId al navegar
  });
};

  // Obtener los medicamentos del usuario seleccionado
  const fetchMedicamentosUsuario = async (userId) => {
    try {
      const response = await fetch(`https://api-snupie-diseno-1017614000153.us-central1.run.app/medicamentosUsuario/${userId}`);
      if (!response.ok) {
        throw new Error('Error al obtener los medicamentos del usuario');
      }
      const data = await response.json();

      // Ordenar medicamentos por puntos disponibles y descripción
      const sortedData = data.sort((a, b) => {
        if (a.puntosDisponibles === b.puntosDisponibles) {
          return a.descripcion.localeCompare(b.descripcion);
        }
        return a.puntosDisponibles - b.puntosDisponibles;
      });

      setMedicamentos(sortedData);
    } catch (error) {
      console.error('Error al obtener medicamentos del usuario:', error);
    }
  };

  // Manejar el cambio de usuario
  const handleUserChange = (event) => {
    const userId = parseInt(event.target.value, 10);
    setSelectedUser(userId);
    fetchMedicamentosUsuario(userId); // Cargar medicamentos del usuario seleccionado
  };




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
          <p><strong>Total de medicamentos adquiridos y aprobados:</strong> {medicamentos.length}</p>
          <p><strong>Cantidad de puntos globales acumulados:</strong> {medicamentos.reduce((sum, med) => sum + (med.puntosAcumulados || 0), 0)}</p>
          <p><strong>Cantidad de puntos globales usados en canjes:</strong> {medicamentos.reduce((sum, med) => sum + (med.puntosUsados || 0), 0)}</p>
          <p><strong>Cantidad de puntos globales disponibles:</strong> {medicamentos.reduce((sum, med) => sum + (med.puntosDisponibles || 0), 0)}</p>
        </div>
      )}

      <div className="medication-list">
        {medicamentos.length > 0 ? (
          medicamentos.map((medicamento) => (
            <div key={medicamento.id} className="medication-card">
              <h3 className="medication-name">{medicamento.nombre}</h3>
              <img
                src={medicamento.urlImagen || 'https://via.placeholder.com/150'}
                alt={medicamento.nombre}
                className="med-image"
              />
              <p><strong>Descripción:</strong> {medicamento.descripcion || 'Sin descripción disponible'}</p>
              <p><strong>Puntos acumulados:</strong> {medicamento.puntosAcumulados || 0}</p>
              <p><strong>Puntos usados en canjes:</strong> {medicamento.puntosUsados || 0}</p>
              <p><strong>Puntos disponibles:</strong> {medicamento.puntosDisponibles || 0}</p>
              <button
                className="detail-button"
                onClick={() => handleVerDetalle(medicamento)}
              >
                Ver detalle
              </button>
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
