import React, { useEffect, useState } from 'react';
import './ReviewRequests.css'; // Asegúrate de tener un archivo CSS para estilos

function ReviewRequests() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesArregladas, setSolicitudesArregladas] = useState([]);

  useEffect(() => {
    // Realizar la solicitud para obtener las solicitudes pendientes
    fetch('http://localhost:5000/solicitudes/pendientes')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las solicitudes');
        }
        return response.json();
      })
      .then(data => {
        setSolicitudes(data); // Guardar los datos en el estado original
        // Transformar las solicitudes para crear solicitudesArregladas
        const nuevasSolicitudesArregladas = data.map(solicitud => ({
          id: solicitud.id,
          farmacia: solicitud.farmacia.nombre,
          fechaCanje: solicitud.fecha,
          numeroFactura: solicitud.numSolicitud,
          producto: solicitud.medicamento.nombre,
          cantidad: solicitud.cantidad,
          presentacion: solicitud.medicamento.presentacion.nombre,
          imagenFactura: solicitud.medicamento.urlImagen, // Asumiendo que la URL de la imagen está aquí
        }));
        setSolicitudesArregladas(nuevasSolicitudesArregladas); // Guardar las solicitudes transformadas
      })
      .catch(error => {
        console.error('Error al cargar las solicitudes:', error);
      });
  }, []); // El array vacío [] significa que esto se ejecutará solo una vez al montar el componente

  const handleAprobarSolicitud = (id) => {
    fetch(`http://localhost:5000/solicitud/aprobar/${id}`, {
      method: 'PUT',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al aprobar la solicitud');
        }
        return response.json();
      })
      .then(data => {
        console.log('Solicitud aprobada:', data);
        // Actualizar el estado de las solicitudes si es necesario
        setSolicitudesArregladas(prev => prev.filter(solicitud => solicitud.id !== id));
      })
      .catch(error => {
        console.error('Error al aprobar la solicitud:', error);
      });
  };

  const handleRechazarSolicitud = (id) => {
    fetch(`http://localhost:5000/solicitud/rechazar/${id}`, {
      method: 'PUT',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al rechazar la solicitud');
        }
        return response.json();
      })
      .then(data => {
        console.log('Solicitud rechazada:', data);
        // Actualizar el estado de las solicitudes si es necesario
        setSolicitudesArregladas(prev => prev.filter(solicitud => solicitud.id !== id));
      })
      .catch(error => {
        console.error('Error al rechazar la solicitud:', error);
      });
  };

  return (
    <div className="review-container">
      <h1 className="title">Snupie</h1>
      <h2 className="subtitle">Revisión de solicitudes</h2>

      <div className="search-bar">
        <input type="text" placeholder="Buscar" />
        <button className="search-button">🔍</button>
      </div>

      {solicitudesArregladas.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        solicitudesArregladas.map((solicitud, index) => (
          <div key={index} className="solicitud-card">
            <p><strong>Farmacia:</strong> {solicitud.farmacia}</p>
            <p><strong>Fecha de canje:</strong> {solicitud.fechaCanje}</p>
            <p><strong>Número de factura:</strong> {solicitud.numeroFactura}</p>
            <p><strong>Producto:</strong> {solicitud.producto}</p>
            <p><strong>Cantidad:</strong> {solicitud.cantidad}</p>
            <p><strong>Presentación:</strong> {solicitud.presentacion}</p>
            <p><strong>Imagen de factura:</strong></p>
            {solicitud.imagenFactura ? (
              <img src={solicitud.imagenFactura} alt="Factura" className="factura-imagen" />
            ) : (
              <div className="image-placeholder">📷</div>
            )}

            <div className="buttons">
              <button className="reject-button" onClick={() => handleRechazarSolicitud(solicitud.id)}>
                Rechazar Factura
              </button>
              <button className="approve-button" onClick={() => handleAprobarSolicitud(solicitud.id)}>
                Aprobar Factura
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewRequests;
