import React, { useState } from 'react';
import './ConfigurarMedicamento.css'; // Asegúrate de tener un archivo CSS para estilos

function ConfigurarMedicamento({ medicamento }) {
  const [estado, setEstado] = useState('Inactivo');
  const [puntosCompra, setPuntosCompra] = useState('');
  const [puntosCanje, setPuntosCanje] = useState('');

  return (
    <div className="configure-container">
      <h1 className="title">Snupie</h1>
      <h2 className="subtitle">Configurar medicamento</h2>
      <div className="medication-info">
        <h3>{medicamento.nombre}</h3>
        <img src={medicamento.imagen} alt={medicamento.nombre} className="med-image" />
      </div>
      <div className="form-group">
        <label>Estado</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Inactivo">Inactivo</option>
          <option value="Activo">Activo</option>
        </select>
      </div>
      <div className="form-group">
        <label>Cantidad de puntos por compra</label>
        <input type="number" value={puntosCompra} onChange={(e) => setPuntosCompra(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Cantidad de puntos para canje</label>
        <input type="number" value={puntosCanje} onChange={(e) => setPuntosCanje(e.target.value)} />
      </div>
      <button className="accept-button">Aceptar</button>
    </div>
  );
}

export default ConfigurarMedicamento;
