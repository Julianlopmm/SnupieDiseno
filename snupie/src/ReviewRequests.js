import React from 'react';
import './ReviewRequests.css'; // Asegúrate de tener un archivo CSS para estilos

function ReviewRequests() {
  const solicitudes = [
    {
      farmacia: 'Farmacia Fischel',
      fechaCanje: '21/9/2024',
      numeroFactura: '111',
      producto: 'Acetaminofén',
      cantidad: 2,
      presentacion: 'Pastilla',
      imagen: 'url-imagen-placeholder',
    },
    {
      farmacia: 'Farmacia La Bomba',
      fechaCanje: '21/9/2024',
      numeroFactura: '112',
      producto: 'Aleve',
      cantidad: 2,
      presentacion: 'Pastilla',
      imagen: 'url-imagen-placeholder',
    },
  ];

  return (
    <div className="review-container">
      <h1 className="title">Snupie</h1>
      <h2 className="subtitle">Revisión de solicitudes</h2>

      <div className="search-bar">
        <input type="text" placeholder="Buscar" />
        <button className="search-button">🔍</button>
      </div>

      {solicitudes.map((solicitud, index) => (
        <div key={index} className="solicitud-card">
          <p><strong>Farmacia:</strong> {solicitud.farmacia}</p>
          <p><strong>Fecha de canje:</strong> {solicitud.fechaCanje}</p>
          <p><strong>Número de factura:</strong> {solicitud.numeroFactura}</p>
          <p><strong>Producto:</strong> {solicitud.producto}</p>
          <p><strong>Cantidad:</strong> {solicitud.cantidad}</p>
          <p><strong>Presentación:</strong> {solicitud.presentacion}</p>
          <p><strong>Imagen de factura:</strong></p>
          <div className="image-placeholder">📷</div>

          <div className="buttons">
            <button className="reject-button">Rechazar Factura</button>
            <button className="approve-button">Aprobar Factura</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewRequests;
