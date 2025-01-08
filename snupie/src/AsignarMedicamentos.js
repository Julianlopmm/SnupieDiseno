import React, { useState, useEffect } from 'react';
import './AsignarMedicamentos.css';
import ConfigurarMedicamento from './ConfigurarMedicamento'; // Importa el nuevo componente

function AsignarMedicamentos() {
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);

  // Hook para obtener los medicamentos al cargar el componente
  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const response = await fetch('https://api-snupie-acs-287732579337.us-central1.run.app/medicamentos'); 
        if (!response.ok) {
          throw new Error('Error al obtener los medicamentos');
        }
        const data = await response.json();
        setMedicamentos(data);
      } catch (error) {
        console.error('Error al obtener los medicamentos:', error);
      }
    };
  
    fetchMedicamentos();
  }, []);

  const handleConfigureClick = (med) => {
    setSelectedMedication(med);
  };

  if (selectedMedication) {
    return <ConfigurarMedicamento medicamento={selectedMedication} />;
  }

  return (
    <div className="assign-container">
      <h1 className="title">Snupie</h1>
      <h2 className="subtitle">Asignar medicamentos</h2>
      <div className="medications-grid">
        {medicamentos.map((med, index) => (
          <div key={index} className="med-card">
            <img src={med.urlImagen || 'ruta-a-imagen-por-defecto'} alt={med.nombre} className="med-image" />
            <h3>{med.nombre}</h3>
            <p>{med.precio ? `$${med.precio}` : 'Precio no disponible'}</p>
            <p>{med.descripcion || 'Descripción no disponible'}</p>
            <p><strong>Presentación:</strong> {med.presentacion ? med.presentacion.nombre : 'N/A'}</p> {/* Agrega esta línea */}
            <button className="configure-button" onClick={() => handleConfigureClick(med)}>Configurar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AsignarMedicamentos;
