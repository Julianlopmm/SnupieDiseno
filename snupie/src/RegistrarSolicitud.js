import React, { useState } from 'react';

import './RegistrarSolicitud.css'; // Importa el archivo de estilos

const RegistrarSolicitud = () => {
    const [farmacia, setFarmacia] = useState('');
    const [producto, setProducto] = useState('');
    const [fecha, setFecha] = useState('');
    const [numeroFactura, setNumeroFactura] = useState('');
    const [cantidad, setCantidad] = useState('');
  
    return (
      <div className="register-container">
        <h1 className="title">Snupie</h1>
        <h2 className="subtitle">Registrar Solicitud</h2>
  
        <div className="form-grid">
          <div className="form-group">
            <label>Farmacia</label>
            <select value={farmacia} onChange={(e) => setFarmacia(e.target.value)}>
              <option value="">Seleccione</option>
              <option value="FarmaValue">FarmaValue</option>
              <option value="Fischel">Fischel</option>
              <option value="La Bomba">La Bomba</option>
              <option value="Sucre">Sucre</option>
              <option value="Walmart">Walmart</option>
            </select>
          </div>
  
          <div className="form-group">
            <label>Producto</label>
            <select value={producto} onChange={(e) => setProducto(e.target.value)}>
              <option value="">Seleccione</option>
              <option value="Acetaminofén (Pastilla)">Acetaminofén (Pastilla)</option>
              <option value="Aleve (Pastilla)">Aleve (Pastilla)</option>
              <option value="Enantyum (Boli)">Enantyum (Boli)</option>
              <option value="Ibuprofeno (Pastilla)">Ibuprofeno (Pastilla)</option>
            </select>
          </div>
  
          <div className="form-group">
            <label>Fecha</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
  
          <div className="form-group datos">
            <label>Número de Factura</label>
            <input type="text" value={numeroFactura} onChange={(e) => setNumeroFactura(e.target.value)} />
  
            <label>Cantidad</label>
            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
  
            <label>Imagen de la factura</label>
            <input type="file" />
          </div>
        </div>
  
        <button className="register-button">Registrar</button>
      </div>
    );
};

export default RegistrarSolicitud;
