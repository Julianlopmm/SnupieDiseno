import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CanjeMedicamento.css'; // Asegúrate de tener un archivo CSS para estilos

function CanjeMedicamento() {

    const location = useLocation();
    const navigate = useNavigate();
    const { medicamento: medicamento, userId } = location.state || {}; // Recibe el medicamento y userId desde la navegación
    const [user, setUser] = useState(null);

  const [cantidad, setCantidad] = useState(1); // Estado para manejar la cantidad

  // Función para manejar el cambio de cantidad
  const handleCantidadChange = (e) => {
    const valor = e.target.value;
    if (!isNaN(valor) && valor >= 0) { // Validación para aceptar solo números no negativos
      setCantidad(Number(valor));
    }
  };

  // Función para manejar la acción del botón Aceptar
  const handleUpdate = () => {
    console.log('Cantidad seleccionada:', cantidad);
    // Aquí puedes manejar la acción de enviar los datos al backend o realizar alguna acción
  };

  return (
    <div className="configure-container">
      <h1 className="title">Snupie</h1>
      <h2 className="subtitle">Solicitar canje</h2>
      
      <div className="medication-info">
        <h3>{medicamento.nombre}</h3>
        <img src={medicamento.urlImagen} alt={medicamento.nombre} className="med-image" />
        <p><strong>Presentación:</strong> {medicamento.presentacion ? medicamento.presentacion.nombre : 'N/A'}</p>
      </div>

      <div className="form-group">
        <label>Fecha</label>
        <input type="text" value={new Date().toLocaleDateString()} readOnly className="input-readonly" />
      </div>

      <div className="form-group">
        <label>Cliente</label>
        <input type="text" value={userId.nombre} readOnly className="input-readonly" />
      </div>

      <div className="form-group">
        <label>Farmacia</label>
        <input type="text" value={'Hola'} readOnly className="input-readonly" />
      </div>

      <div className="form-group">
        <label>Cantidad</label>
        <input
          type="number"
          value={cantidad}
          onChange={handleCantidadChange}
          className="input-editable"
          min="0"
        />
      </div>

      <button className="accept-button" onClick={handleUpdate}>
        Aceptar
      </button>
    </div>
  );
}

export default CanjeMedicamento;
