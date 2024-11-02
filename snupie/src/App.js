import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import MenuPrincipal from './MenuPrincipal'; // Importa MenuPrincipal
import RegistrarSolicitud from './RegistrarSolicitud'; // Importa RegistrarSolicitud
import ConfigurarMedicamento from './ConfigurarMedicamento'; // Importa ConfigurarMedicamento
import ReviewRequest from './ReviewRequests'; // Importa ReviewRequest

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/menu-principal" element={<MenuPrincipal />} />
        <Route path="/registrarSolicitud" element={<RegistrarSolicitud />} />
        <Route path="/configurarMedicamento" element={<ConfigurarMedicamento />} />
        <Route path="/revisarSolicitudes" element={<ReviewRequest />} />
      </Routes>
    </Router>
  );
}

export default App;
