/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "../snupie/src/SignUp.js";

global.alert = jest.fn();
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({}),
  } as Response)
);


describe("Pruebas funcionales de SignUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<SignUp />);
  });

  test("Registro exitoso con datos correctos", async () => {
    fireEvent.change(screen.getByPlaceholderText("Nombre"), { target: { value: "Jose Robles Mata" } });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), { target: { value: "jose@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "1234" } });
    fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), { target: { value: "1234" } });
    fireEvent.click(screen.getByText("Registrar"));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Usuario registrado correctamente"));
  });

  test("Error al registrar con nombre vacío", async () => {
    fireEvent.change(screen.getByPlaceholderText("Nombre"), { target: { value: " " } }); // Espacio en blanco
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), { target: { value: "jose@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "1234" } });
    fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), { target: { value: "1234" } });
    fireEvent.click(screen.getByText("Registrar"));

    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("El nombre es obligatorio"));
  });

  test("Error al registrar con correo vacío", async () => {
    fireEvent.change(screen.getByPlaceholderText("Nombre"), { target: { value: "Jose Robles Mata" } });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), { target: { value: " " } });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "1234" } });
    fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), { target: { value: "1234" } });
    fireEvent.click(screen.getByText("Registrar"));

    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("El correo electrónico es obligatorio"));
  });

  test("Error al registrar con datos malformados", async () => {
    fireEvent.change(screen.getByPlaceholderText("Nombre"), { target: { value: "d" } });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), { target: { value: "d" } });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "d" } });
    fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), { target: { value: "d" } });
    fireEvent.click(screen.getByText("Registrar"));

    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Ingrese datos válidos"));
  });

  test("Error al registrar sin datos", async () => {
    fireEvent.change(screen.getByPlaceholderText("Nombre"), { target: { value: " " } });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), { target: { value: " " } });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: " " } });
    fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), { target: { value: " " } });
    fireEvent.click(screen.getByText("Registrar"));

    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Todos los campos son obligatorios"));
  });

  test("Error al registrar cuando la confirmación de contraseña no coincide", async () => {
    fireEvent.change(screen.getByPlaceholderText("Nombre"), { target: { value: "Jose Robles Mata" } });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), { target: { value: "jose@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "1234" } });
    fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), { target: { value: "4321" } });
    fireEvent.click(screen.getByText("Registrar"));

    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Las contraseñas no coinciden"));
  });
});
