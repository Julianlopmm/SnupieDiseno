import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DetalleMedicamento.css';

function DetalleMedicamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const { medicamento } = location.state || {}; // Recibe el medicamento desde la navegación

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
        {medicamento.registros && medicamento.registros.length > 0 ? (
          medicamento.registros.map((registro, index) => (
            <div key={index} className="record-card">
              <p><strong>Fecha Factura:</strong> {registro.fechaFactura || 'N/A'}</p>
              <p><strong>Número Factura:</strong> {registro.numeroFactura || 'N/A'}</p>
              <p><strong>Farmacia:</strong> {registro.farmacia || 'N/A'}</p>
              <p><strong>Número de Canje:</strong> {registro.numeroCanje || 'Disponible'}</p>
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
