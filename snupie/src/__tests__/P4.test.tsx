import React from 'react';
import { render, screen } from '@testing-library/react';
import MenuPrincipal from '../MenuPrincipal';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// ✅ Función auxiliar para renderizar el componente con un rol específico
const renderWithRole = (role: number | null) => {
  if (role !== null) {
    localStorage.setItem('rol', role.toString());
  } else {
    localStorage.removeItem('rol');
  }

  return render(
    <MemoryRouter>
      <MenuPrincipal />
    </MemoryRouter>
  );
};

describe('Pruebas Unitarias Menú Principal', () => {
  
  afterEach(() => {
    localStorage.clear(); // ✅ Limpia el localStorage después de cada prueba
  });

  // ✅ Caso 1: Usuario Admin (rol 1) - Tiene acceso a todo
  test('Debe habilitar todos los botones para el usuario Admin (rol 1)', () => {
    renderWithRole(1);

    expect(screen.getByText('Registrar Solicitud')).toBeEnabled();
    expect(screen.getByText('Configurar Medicamentos')).toBeEnabled();
    expect(screen.getByText('Revisar Solicitudes')).toBeEnabled();
    expect(screen.getByText('Consultar Estado Cliente')).toBeEnabled();
    expect(screen.getByText('Consultar Canjes Cliente')).toBeEnabled();
  });

  // ✅ Caso 2: Usuario Cliente (rol 3) - Solo puede registrar solicitudes
  test('Debe deshabilitar los botones correctamente para el usuario Cliente (rol 3)', () => {
    renderWithRole(3);

    expect(screen.getByText('Registrar Solicitud')).toBeEnabled();
    expect(screen.getByText('Configurar Medicamentos')).toBeDisabled();
    expect(screen.getByText('Revisar Solicitudes')).toBeDisabled();
    expect(screen.getByText('Consultar Estado Cliente')).toBeDisabled();
    expect(screen.getByText('Consultar Canjes Cliente')).toBeDisabled();
  });

  // ✅ Caso 3: Usuario Operativo (rol 2) - Solo puede revisar solicitudes
  test('Debe deshabilitar los botones correctamente para el usuario Operativo (rol 2)', () => {
    renderWithRole(2);

    expect(screen.getByText('Registrar Solicitud')).toBeDisabled();
    expect(screen.getByText('Configurar Medicamentos')).toBeDisabled();
    expect(screen.getByText('Revisar Solicitudes')).toBeEnabled();
    expect(screen.getByText('Consultar Estado Cliente')).toBeDisabled();
    expect(screen.getByText('Consultar Canjes Cliente')).toBeDisabled();
  });

  // ✅ Caso 4: Usuario sin permisos específicos (rol 4) - Solo puede consultar estados y canjes
  test('Debe habilitar solo botones de consulta para el usuario Farmacia (rol 4)', () => {
    renderWithRole(4);

    expect(screen.getByText('Registrar Solicitud')).toBeDisabled();
    expect(screen.getByText('Configurar Medicamentos')).toBeDisabled();
    expect(screen.getByText('Revisar Solicitudes')).toBeDisabled();
    expect(screen.getByText('Consultar Estado Cliente')).toBeEnabled();
    expect(screen.getByText('Consultar Canjes Cliente')).toBeEnabled();
  });

  // ✅ Caso 5: Sin rol en localStorage - Todos los botones deshabilitados
  test('Debe deshabilitar todos los botones si no hay rol en localStorage', () => {
    renderWithRole(null);

    expect(screen.getByText('Registrar Solicitud')).toBeDisabled();
    expect(screen.getByText('Configurar Medicamentos')).toBeDisabled();
    expect(screen.getByText('Revisar Solicitudes')).toBeDisabled();
    expect(screen.getByText('Consultar Estado Cliente')).toBeDisabled();
    expect(screen.getByText('Consultar Canjes Cliente')).toBeDisabled();
  });
});
