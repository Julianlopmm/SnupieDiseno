import React, { useState, useEffect} from 'react';
import './ConsultaCanjesClientes.css';

function ConsultaCanjesCliente() {
  const [selectedUser, setSelectedUser] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
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


  const canjes = [
    {
      fechaCanje: '2024-11-15',
      numeroCanje: 101,
      producto: { descripcion: 'Medicamento A', puntosRequeridos: 50 },
      solicitudNumero: 301,
      numeroFactura: 'F123',
      farmacia: 'Farmacia Central',
    },
    {
      fechaCanje: '2024-11-10',
      numeroCanje: 100,
      producto: { descripcion: 'Medicamento B', puntosRequeridos: 30 },
      solicitudNumero: 302,
      numeroFactura: 'F124',
      farmacia: 'Farmacia Norte',
    },
  ];

  const stats = {
    acumulados: 200,
    usados: 80,
    disponibles: 120,
  };

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
          <option value="1">Juan Pérez</option>
          <option value="2">María López</option>
          <option value="3">Carlos Rodríguez</option>
        </select>
      </div>

      {selectedUser && (
        <>
          <div className="exchange-stats">
            <h3>Resumen Global</h3>
            <p><strong>Puntos acumulados:</strong> {stats.acumulados}</p>
            <p><strong>Puntos usados:</strong> {stats.usados}</p>
            <p><strong>Puntos disponibles:</strong> {stats.disponibles}</p>
          </div>

          <div className="exchange-list">
            <h3>Listado de Canjes</h3>

            {/* Ejemplo 1 */}
            <div className="exchange-card">
              <p><strong>Fecha del canje:</strong> {canjes[0].fechaCanje}</p>
              <p><strong>Número de canje:</strong> {canjes[0].numeroCanje}</p>
              <p><strong>Producto:</strong> {canjes[0].producto.descripcion} ({canjes[0].producto.puntosRequeridos} puntos)</p>
              <p><strong>Solicitud:</strong> {canjes[0].solicitudNumero}</p>
              <p><strong>Factura:</strong> {canjes[0].numeroFactura}</p>
              <p><strong>Farmacia:</strong> {canjes[0].farmacia}</p>
            </div>

            {/* Ejemplo 2 */}
            <div className="exchange-card">
              <p><strong>Fecha del canje:</strong> {canjes[1].fechaCanje}</p>
              <p><strong>Número de canje:</strong> {canjes[1].numeroCanje}</p>
              <p><strong>Producto:</strong> {canjes[1].producto.descripcion} ({canjes[1].producto.puntosRequeridos} puntos)</p>
              <p><strong>Solicitud:</strong> {canjes[1].solicitudNumero}</p>
              <p><strong>Factura:</strong> {canjes[1].numeroFactura}</p>
              <p><strong>Farmacia:</strong> {canjes[1].farmacia}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ConsultaCanjesCliente;
