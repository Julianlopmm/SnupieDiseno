import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import MenuPrincipal from './MenuPrincipal'; // Importa MenuPrincipal
import RegistrarSolicitud from './RegistrarSolicitud'; // Importa RegistrarSolicitud
import AsignarMedicamentos from './AsignarMedicamentos';
import ReviewRequest from './ReviewRequests'; // Importa ReviewRequest
import ConsultarEstadoCliente from './ConsultarEstadoCliente';
import DetalleMedicamento from './DetalleMedicamento';
import CanjeMedicamento from './CanjeMedicamento';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/menu-principal" element={<MenuPrincipal />} />
        <Route path="/registrarSolicitud" element={<RegistrarSolicitud />} />
        <Route path="/asignarMedicamento" element={<AsignarMedicamentos />} />
        <Route path="/revisarSolicitudes" element={<ReviewRequest />} />
        <Route path="/consultarEstadoCliente" element={<ConsultarEstadoCliente/>} />
        <Route path="/detalle-medicamento" element={<DetalleMedicamento />} />
        <Route path="/canje-medicamento" element={<CanjeMedicamento />} />
      </Routes>
    </Router>
  );
}

export default App;
