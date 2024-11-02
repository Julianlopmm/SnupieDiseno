import React, { useState } from 'react';
import './ConfigurarMedicamento.css'; // Asegúrate de tener un archivo CSS para estilos

function ConfigurarMedicamento({ medicamento }) {
  const [estado, setEstado] = useState(medicamento.estadoPromocion ? 'Activo' : 'Inactivo');
  const [puntosCompra, setPuntosCompra] = useState(medicamento.puntosPorCompra);
  const [puntosCanje, setPuntosCanje] = useState(medicamento.puntosParaCanje);
  
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/medicamentos/${medicamento.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estadoPromocion: estado === 'Activo',
          puntosPorCompra: parseInt(puntosCompra),
          puntosParaCanje: parseInt(puntosCanje),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el medicamento');
      }

      const updatedMedicamento = await response.json();
      console.log('Medicamento actualizado:', updatedMedicamento);
      alert('Medicamento actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el medicamento:', error);
      alert('Hubo un error al actualizar el medicamento');
    }
  };

  return (
    <div className="configure-container">
      <h1 className="title">Snupie</h1>
      <h2 className="subtitle">Configurar medicamento</h2>
      <div className="medication-info">
        <h3>{medicamento.nombre}</h3>
        <img src={medicamento.urlImagen} alt={medicamento.nombre} className="med-image" />
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
        <input
          type="number"
          value={puntosCompra}
          onChange={(e) => setPuntosCompra(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Cantidad de puntos para canje</label>
        <input
          type="number"
          value={puntosCanje}
          onChange={(e) => setPuntosCanje(e.target.value)}
        />
      </div>
      <button className="accept-button" onClick={handleUpdate}>
        Aceptar
      </button>
    </div>
  );
}

export default ConfigurarMedicamento;
