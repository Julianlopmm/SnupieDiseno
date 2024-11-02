import React from 'react';
import ReactDOM from 'react-dom/client'; // Importación correcta para React 18
import './index.css';
import App from './App';
import ReviewRequests from './ReviewRequests'; // Importa tu componente correctamente
import './ReviewRequests.css';
import reportWebVitals from './reportWebVitals';
import AsignarMedicamentos from './AsignarMedicamentos';

// Crear root y renderizar el componente
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* Usa el componente exportado */}
  </React.StrictMode>
);

// Si quieres medir el rendimiento, usa reportWebVitals
reportWebVitals();
