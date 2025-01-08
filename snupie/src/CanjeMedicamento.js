import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CanjeMedicamento.css'; // Asegúrate de tener un archivo CSS para estilos

function CanjeMedicamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const { medicamento, userId} = location.state || {}; // Recibe el medicamento, userId, y farmaciaId desde la navegación
  const [user, setUser] = useState(null); // Estado para almacenar la información del usuario
  const [farmacia, setFarmacia] = useState(null); // Estado para almacenar la información de la farmacia
  const [cantidad, setCantidad] = useState(1); // Estado para manejar la cantidad

  const farmaciaId = localStorage.getItem('farmaciaId'); // Obtiene el id de la farmacia del local storage

  // Función para manejar el cambio de cantidad
  const handleCantidadChange = (e) => {
    const valor = e.target.value;
    if (!isNaN(valor) && valor >= 0) {
      // Validación para aceptar solo números no negativos
      setCantidad(Number(valor));
    }
  };

  // Función para manejar la acción del botón Aceptar
  const handleUpdate = () => {
    console.log('Cantidad seleccionada:', cantidad);
    console.log('Usuario:', user);
    console.log('Farmacia:', farmacia);
    console.log('Medicamento:', medicamento);
    // Aquí puedes manejar la acción de enviar los datos al backend o realizar alguna acción
  };

  // Efecto para cargar el usuario
  useEffect(() => {
    if (userId) {
      fetch(`https://api-snupie-acs-287732579337.us-central1.run.app/usuarios/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al cargar los datos del usuario');
          }
          return response.json();
        })
        .then((data) => {
          setUser(data); // Guardar los datos del usuario en el estado
        })
        .catch((error) => console.error('Error al obtener el usuario:', error));
    }
  }, [userId]); // Se ejecuta solo cuando cambia userId

  // Efecto para cargar la farmacia
  useEffect(() => {
    if (farmaciaId) {
      fetch(`https://api-snupie-acs-287732579337.us-central1.run.app/farmacias/${farmaciaId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al cargar los datos de la farmacia');
          }
          return response.json();
        })
        .then((data) => {
          setFarmacia(data); // Guardar los datos de la farmacia en el estado
        })
        .catch((error) => console.error('Error al obtener la farmacia:', error));
    }
  }, [farmaciaId]); // Se ejecuta solo cuando cambia farmaciaId

  // Verificar si los datos necesarios están cargados
  if (!medicamento || !user || !farmacia) {
    return <p>Cargando información...</p>;
  }

  async function handleCanje() {
    const canje = {
      fecha: new Date().toISOString().split('T')[0], // Formato de fecha YYYY-MM-DD
      usuario: { id: user.id }, // Objeto anidado para usuario
      medicamento: { id: medicamento.id }, // Objeto anidado para medicamento
      farmacia: { id: farmacia.id }, // Objeto anidado para farmacia
      cantidad, // Cantidad seleccionada
    };
  
    try {
      const response = await fetch('https://api-snupie-acs-287732579337.us-central1.run.app/crearCanje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(canje),
      });
  
      if (response.ok) {
        console.log('Canje registrado exitosamente');
        alert('Canje registrado exitosamente');
      } else {
        const errorData = await response.json();
        console.error('Error al registrar el canje:', errorData);
      }
    } catch (error) {
      console.error('Error al registrar el canje:', error);
    }
  }
  

  return (
    <div className="configure-container">
      <h1 className="title">Snupie</h1>
      <h2 className="subtitle">Solicitar canje</h2>

      <div className="medication-info">
        <h3>{medicamento.nombre}</h3>
        <img src={medicamento.urlImagen} alt={medicamento.nombre} className="med-image" />
        <p>
          <strong>Presentación:</strong>{' '}
          {medicamento.presentacion ? medicamento.presentacion.nombre : 'N/A'}
        </p>
      </div>

      <div className="form-group">
        <label>Fecha</label>
        <input
          type="text"
          value={new Date().toLocaleDateString()}
          readOnly
          className="input-readonly"
        />
      </div>

      <div className="form-group">
        <label>Cliente</label>
        <input
          type="text"
          value={user.nombre} // Muestra el nombre del usuario cargado
          readOnly
          className="input-readonly"
        />
      </div>

      <div className="form-group">
        <label>Farmacia</label>
        <input
          type="text"
          value={farmacia.nombre} // Muestra el nombre de la farmacia cargada
          readOnly
          className="input-readonly"
        />
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

      <button className="accept-button" onClick={handleCanje}>
        Aceptar
      </button>
    </div>
  );
}

export default CanjeMedicamento;
