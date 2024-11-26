import React, { useState, useEffect } from 'react';
import './ConsultaCanjesClientes.css';

function ConsultaCanjesCliente() {
  const [selectedUser, setSelectedUser] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [canjes, setCanjes] = useState([]);
  const [stats, setStats] = useState(null);

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

  // Hook para obtener los canjes al seleccionar un usuario
  useEffect(() => {
    const fetchCanjes = async () => {
      if (!selectedUser) return;

      try {
        const response = await fetch(`https://api-snupie-diseno-1017614000153.us-central1.run.app/canjesUsuario/${selectedUser}`);
        if (!response.ok) {
          throw new Error('Error al obtener los canjes');
        }
        const data = await response.json();
        setCanjes(data);
      } catch (error) {
        console.error('Error al obtener los canjes:', error);
      }
    };

    fetchCanjes();
  }, [selectedUser]);

  // Hook para obtener y calcular los puntos globales del usuario seleccionado
  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedUser) return;

      try {
        const response = await fetch(`https://api-snupie-diseno-1017614000153.us-central1.run.app/puntos/${selectedUser}`);
        if (!response.ok) {
          throw new Error('Error al obtener los puntos del usuario');
        }
        const data = await response.json();

        // Calcular los puntos globales
        const puntosGlobales = data.puntos.reduce(
          (totales, item) => ({
            acumulados: totales.acumulados + item.puntosAcumulados,
            disponibles: totales.disponibles + item.puntosDisponibles,
            canjeados: totales.canjeados + item.puntosCanjeados,
          }),
          { acumulados: 0, disponibles: 0, canjeados: 0 }
        );

        setStats(puntosGlobales);
      } catch (error) {
        console.error('Error al obtener los puntos del usuario:', error);
      }
    };

    fetchStats();
  }, [selectedUser]);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  return (
    <div className="exchange-container">
      <h1 className="title">Snupie</h1>
      <h2 className="subtitle">Consulta de Canjes de Cliente</h2>

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
        <>
          {stats && (
            <div className="exchange-stats">
              <h3>Resumen Global</h3>
              <p><strong>Puntos acumulados:</strong> {stats.acumulados}</p>
              <p><strong>Puntos usados:</strong> {stats.canjeados}</p>
              <p><strong>Puntos disponibles:</strong> {stats.disponibles}</p>
            </div>
          )}

          <div className="exchange-list">
            <h3>Listado de Canjes</h3>
            {canjes.length > 0 ? (
              canjes.map((canje) => (
                <div key={canje.id} className="exchange-card">
                  <p>
                    <strong>Fecha del canje:</strong> {new Date(canje.fecha).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Número de canje:</strong> {canje.id}
                  </p>
                  <p>
                    <strong>Producto:</strong> {canje.medicamento.nombre} ({canje.medicamento.puntosParaCanje} puntos)
                  </p>
                  <p>
                    <strong>Cantidad:</strong> {canje.cantidad}
                  </p>
                  <p>
                    <strong>Farmacia:</strong> {canje.farmacia.nombre}
                  </p>
                </div>
              ))
            ) : (
              <p>No hay canjes disponibles para este usuario.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ConsultaCanjesCliente;
