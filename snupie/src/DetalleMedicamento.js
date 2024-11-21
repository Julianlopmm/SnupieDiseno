import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DetalleMedicamento.css';

function DetalleMedicamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const { medicamento: initialMedicamento } = location.state || {}; // Recibe el medicamento desde la navegación

  const [medicamento, setMedicamento] = useState(initialMedicamento || null);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch para cargar los registros de solicitudes con la estrategia ascendente
  const fetchSolicitudesAscendente = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api-snupie-diseno-1017614000153.us-central1.run.app/solicitudesCriterio/${id}?criterio=ascendente`
      );
      if (!response.ok) {
        throw new Error('Error al obtener las solicitudes del medicamento');
      }
      const data = await response.json();
      setRegistros(data); // Actualiza los registros con los datos obtenidos
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los registros al montar la pantalla
  useEffect(() => {
    if (medicamento) {
      fetchSolicitudesAscendente(medicamento.id);
    }
  }, [medicamento]);

  if (loading) {
    return <p>Cargando detalles del medicamento...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!medicamento) {
    return <p>No hay datos disponibles para este medicamento.</p>;
  }

  return (
    <div className="detalle-container">
      <h1 className="title">Detalle del Medicamento</h1>
      <div className="medication-detail">
        <img
          src={medicamento.urlImagen || 'https://via.placeholder.com/150'}
          alt={medicamento.nombre}
          className="med-image"
        />
        <h2>{medicamento.nombre}</h2>
        <p><strong>Descripción:</strong> {medicamento.descripcion || 'Sin descripción disponible'}</p>
        <p><strong>Puntos por ejemplar:</strong> {medicamento.puntosPorCompra || 0}</p>
        <p><strong>Puntos requeridos para un canje:</strong> {medicamento.puntosParaCanje || 0}</p>
        <p><strong>Puntos acumulados:</strong> {medicamento.puntosAcumulados || 0}</p>
        <p><strong>Puntos disponibles:</strong> {medicamento.puntosDisponibles || 0}</p>

        <button
          className="redeem-button"
          disabled={medicamento.puntosDisponibles < medicamento.puntosParaCanje}
        >
          {medicamento.puntosDisponibles >= medicamento.puntosParaCanje
            ? 'Aplicar Canje'
            : 'No Canjeable'}
        </button>
      </div>

      <h3>Registros cronológicos:</h3>
      <div className="records-list">
        {registros.length > 0 ? (
          registros.map((registro, index) => (
            <div key={index} className="record-card">
              <p><strong>Fecha Factura:</strong> {registro.fecha || 'N/A'}</p>
              <p><strong>Número Factura:</strong> {registro.numeroFactura || 'N/A'}</p>
              <p><strong>Farmacia:</strong> {registro.farmacia?.nombre || 'N/A'}</p>
              <p><strong>Número de Canje:</strong> {registro.canje ? registro.canje.id : 'Disponible'}</p>
            </div>
          ))
        ) : (
          <p>No hay registros disponibles.</p>
        )}
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        Volver
      </button>
    </div>
  );
}

export default DetalleMedicamento;
