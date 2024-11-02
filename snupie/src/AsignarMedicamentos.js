import React, { useState } from 'react';
import './AsignarMedicamentos.css';
import ConfigurarMedicamento from './ConfigurarMedicamento'; // Importa el nuevo componente

function AsignarMedicamentos() {
  const [selectedMedication, setSelectedMedication] = useState(null);

  const medicamentos = [
    {
      nombre: 'Acetaminofén Pastilla',
      precio: '$0',
      descripcion: 'Body text.',
      imagen: 'link-a-imagen-1',
    },
    {
      nombre: 'Ibuprofeno Pastilla',
      precio: '$0',
      descripcion: 'Body text.',
      imagen: 'link-a-imagen-2',
    },
    {
      nombre: 'Enantyum Boli',
      precio: '$0',
      descripcion: 'Body text.',
      imagen: 'link-a-imagen-3',
    },
    {
      nombre: 'Enantyum Pastilla',
      precio: '$0',
      descripcion: 'Body text.',
      imagen: 'link-a-imagen-4',
    },
  ];

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
            <img src={med.imagen} alt={med.nombre} className="med-image" />
            <h3>{med.nombre}</h3>
            <p>{med.precio}</p>
            <p>{med.descripcion}</p>
            <button className="configure-button" onClick={() => handleConfigureClick(med)}>Configurar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AsignarMedicamentos;
