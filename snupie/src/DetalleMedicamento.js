import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DetalleMedicamento.css';

function DetalleMedicamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const { medicamento: initialMedicamento, userId } = location.state || {}; // Recibe el medicamento y userId desde la navegación

  const [medicamento, setMedicamento] = useState(initialMedicamento || null);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch para cargar los registros de solicitudes del medicamento para el usuario seleccionado
  const fetchSolicitudesUsuario = async (medicamentoId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api-snupie-diseno-1017614000153.us-central1.run.app/solicitudesCriterio/${medicamentoId}?criterio=ascendente&userId=${userId}`
      );
      if (!response.ok) {
        throw new Error('Error al obtener las solicitudes del medicamento para el usuario');
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
    if (medicamento && userId) {
      fetchSolicitudesUsuario(medicamento.id, userId);
    }
  }, [medicamento, userId]);

  if (loading) {
    return <p>Cargando detalles del medicamento...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!medicamento) {
    return <p>No hay datos disponibles para este medicamento.</p>;
  }

  const handleCanje = () => {
    // Aquí puedes manejar la acción de canje del medicamento
    console.log('Canje realizado');
    navigate( '/canje-medicamento', {
      state: { medicamento, userId }, // Pasamos el medicamento y userId al navegar
    })

  };

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
          // disabled={medicamento.puntosDisponibles < medicamento.puntosParaCanje}
          onClick={handleCanje}
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
              <p><strong>Número Factura:</strong> {registro.numSolicitud || 'N/A'}</p>
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
