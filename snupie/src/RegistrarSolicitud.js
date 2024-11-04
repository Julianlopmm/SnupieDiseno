import React, { useState, useEffect } from 'react';
import './RegistrarSolicitud.css'; // Importa el archivo de estilos

const RegistrarSolicitud = () => {
    const [farmacia, setFarmacia] = useState('');
    const [producto, setProducto] = useState('');
    const [fecha, setFecha] = useState('');
    const [numeroFactura, setNumeroFactura] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [farmacias, setFarmacias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [url, setUrl] = useState('');

    // Obtener el ID del usuario desde localStorage
    const userId = localStorage.getItem('userId');

    // Fetch para obtener las farmacias
    useEffect(() => {
        const fetchFarmacias = async () => {
            try {
                const response = await fetch('https://api-snupie-diseno-1017614000153.us-central1.run.app/farmacias');
                if (response.ok) {
                    const data = await response.json();
                    setFarmacias(data);
                } else {
                    console.error('Error al obtener farmacias:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud de farmacias:', error);
            }
        };

        fetchFarmacias();
    }, []);

    // Fetch para obtener los medicamentos
    useEffect(() => {
        const fetchMedicamentos = async () => {
            try {
                const response = await fetch('https://api-snupie-diseno-1017614000153.us-central1.run.app/activos');
                if (response.ok) {
                    const data = await response.json();
                    setProductos(data);
                } else {
                    console.error('Error al obtener medicamentos:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud de medicamentos:', error);
            }
        };

        fetchMedicamentos();
    }, []);

    // Función para registrar la solicitud
    const handleRegistrarSolicitud = async () => {
        try {
            const solicitudData = {
                numSolicitud: numeroFactura,
                fecha: fecha,
                medicamento: {
                    id: parseInt(producto, 10)
                },
                cantidad: parseInt(cantidad, 10),
                farmacia: {
                    id: parseInt(farmacia, 10)
                },
                estadoSolicitud: {
                    id: 1 // ID fijo para un estado inicial
                },
                usuario: {
                    id: parseInt(userId, 10) // ID del usuario autenticado
                },
                urlImagen: url,
            };
            

            const response = await fetch('https://api-snupie-diseno-1017614000153.us-central1.run.app/solicitud', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(solicitudData),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Solicitud registrada con éxito');
                console.log('Solicitud registrada:', data);
            } else {
                console.error('Error al registrar solicitud:', response.statusText);
                alert('Error al registrar la solicitud');
            }
        } catch (error) {
            console.error('Error en la solicitud de registro:', error);
            alert('Error de red al registrar la solicitud');
        }
    };

    return (
        <div className="register-container">
            <h1 className="title">Snupie</h1>
            <h2 className="subtitle">Registrar Solicitud</h2>

            <div className="form-grid">
                <div className="form-group">
                    <label>Farmacia</label>
                    <select value={farmacia} onChange={(e) => setFarmacia(e.target.value)}>
                        <option value="">Seleccione</option>
                        {farmacias.map((farmacia) => (
                            <option key={farmacia.id} value={farmacia.id}>{farmacia.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Producto</label>
                    <select value={producto} onChange={(e) => setProducto(e.target.value)}>
                        <option value="">Seleccione</option>
                        {productos.map((producto) => (
                            <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Cantidad</label>
                    <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Fecha</label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Número de Factura</label>
                    <input type="text" value={numeroFactura} onChange={(e) => setNumeroFactura(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Imagen de la factura (URL)</label>
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL de la imagen" />
                </div>
            </div>

            <button className="register-button" onClick={handleRegistrarSolicitud}>Registrar</button>
        </div>
    );
};

export default RegistrarSolicitud;
