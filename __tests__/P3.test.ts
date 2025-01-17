import { ControladorCanjes } from '../src/controllers/ControladorCanjes';
import { DataSource } from 'typeorm';
import { Usuario } from '../src/entity/Usuario';
import { Medicamento } from '../src/entity/Medicamento';
import { Farmacia } from '../src/entity/Farmacia';
import { Canjes } from '../src/entity/Canjes';
import { Solicitud } from '../src/entity/Solicitud';
import { Estado } from '../src/entity/Estado';
import { CandidatoVisitor } from '../src/Visitor/CandidatoVisitor';
import { ActualizarVisitor } from '../src/Visitor/ActualizarVisitor';
import { AppDataSource } from '../src/data-source';
import { Punto } from '../src/entity/Punto';

// ✅ Mock de la base de datos (sin acceso a una real)
jest.mock('typeorm', () => {
  const actualTypeORM = jest.requireActual('typeorm');

  return {
    ...actualTypeORM, // Mantiene los decoradores
    DataSource: jest.fn().mockImplementation(() => ({
      manager: {
        findOne: jest.fn(),
        find: jest.fn(),
        save: jest.fn(),
        getRepository: jest.fn().mockReturnValue({
          createQueryBuilder: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getOne: jest.fn(),
          }),
        }),
      },
    })),
  };
});

// ✅ Mock para CandidatoVisitor y ActualizarVisitor
jest.spyOn(CandidatoVisitor.prototype, 'visitSolicitud').mockImplementation(async (solicitud: Solicitud) => {
  const estadoAceptada = Object.assign(new Estado(), { id: 1, nombre: "Aceptada" });

  if (solicitud.estadoSolicitud?.id === estadoAceptada.id) {
    return solicitud;
  }
  return null;
});

jest.spyOn(ActualizarVisitor.prototype, 'visitSolicitud').mockImplementation(async (solicitud: Solicitud) => {
  solicitud.canje = new Canjes();
  return solicitud;
});

describe('Pruebas de integración de crearCanje (sin acceso a BD)', () => {
  let mockDataSource: any;
  let controladorCanjes: ControladorCanjes;

  beforeEach(() => {
    mockDataSource = AppDataSource;
    controladorCanjes = new ControladorCanjes(mockDataSource);

    // ✅ Mock de todas las llamadas a la base de datos
    jest.spyOn(mockDataSource.manager, 'findOne').mockImplementation(async (entity, condition) => {
      if (entity === Usuario) return { id: 1, nombre: "Juan Pérez", email: "juan@example.com", contrasena: "1234", rol: { id: 2, nombre : "Operativo" }};
      if (entity === Medicamento) return { id: 101, nombre: "Paracetamol", puntosParaCanje: 50, puntosPorCompra: 10, descripcion: "Medicamento para el dolor"
        , presentacion: { id: 1, nombre: "Tabletas" }, precio: 100, urlImagen: "https://www.example.com/paracetamol.jpg", estadoPromocion: true,
        solicitudes: []
       };
      if (entity === Farmacia) return { id: 10, nombre: "Farmacia Central", direccion: "Av. Principal 123", telefono: "123456789", solicitudes: [], email: "central@gmail.com" };
      return undefined;
    });

    jest.spyOn(mockDataSource.manager, 'find').mockImplementation(async () => [
      Object.assign(new Solicitud(), {
        id: 201,
        numSolicitud: "SOL-2025-001",
        fecha: new Date("2025-01-15"),
        cantidad: 2,
        usuario: Object.assign(new Usuario(), { id: 1, nombre: "Juan Pérez", email: "juan@example.com", contrasena: "1234", rol: { id: 2, nombre : "Operativo" }, solicitudes: [] }),
        medicamento: Object.assign(new Medicamento(), { id: 101, nombre: "Paracetamol", puntosParaCanje: 50, puntosPorCompra: 10, descripcion: "Medicamento para el dolor"
            , presentacion: { id: 1, nombre: "Tabletas" }, precio: 100, urlImagen: "https://www.example.com/paracetamol.jpg", estadoPromocion: true,
            solicitudes: []
           }),
        farmacia : { id: 10, nombre: "Farmacia Central", direccion: "Av. Principal 123", telefono: "123456789", solicitudes: [], email: "central@gmail.com" },
        estadoSolicitud: Object.assign(new Estado(), { id: 1, nombre: "Aceptada" }),
        canje: null
      })
    ]);

    jest.spyOn(mockDataSource.manager, 'save').mockImplementation(async (entity) => entity);

    // ✅ Mock para `getRepository(Punto).createQueryBuilder()`
    const puntoRepositoryMock = {
        createQueryBuilder: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({
            puntosDisponibles: 100,
            puntosCanjeados: 0
            }), // Simula que el usuario tiene 100 puntos disponibles
        }),
        save: jest.fn().mockImplementation(async (punto) => punto),
        };
    
        jest.spyOn(mockDataSource.manager, 'getRepository').mockReturnValue(puntoRepositoryMock);
        
  });
  

  it('Debe validar la integración con CandidatoVisitor y ActualizarVisitor sin acceder a la BD', async () => {
    const canjeData = {
        fecha: new Date(),
        usuario: { id: 1, nombre: "Juan Pérez", email: "juan@example.com", contrasena: "1234", rol: { id: 2, nombre : "Operativo" }, solicitudes: [] },
        medicamento: { id: 101, nombre: "Paracetamol", puntosParaCanje: 50, puntosPorCompra: 10, descripcion: "Medicamento para el dolor"
          , presentacion: { id: 1, nombre: "Tabletas" }, precio: 100, urlImagen: "https://www.example.com/paracetamol.jpg", estadoPromocion: true,
          solicitudes: []
         },
        farmacia: { id: 10, nombre: "Farmacia Central", direccion: "Av. Principal 123", telefono: "123456789", solicitudes: [], email: "central@gmail.com" },
        cantidad: 2
      };

    const result = await controladorCanjes.crearCanje(canjeData);

    expect(CandidatoVisitor.prototype.visitSolicitud).toHaveBeenCalled();
    expect(ActualizarVisitor.prototype.visitSolicitud).toHaveBeenCalled();
    expect(result).toHaveProperty('canje');

    
  });
  // ✅ Caso 2: No hay suficientes puntos para el canje
  it('Debe lanzar error si el usuario no tiene suficientes puntos', async () => {
    // 🔹 Modificamos el mock de puntos para simular un usuario con solo 10 puntos
    jest.spyOn(mockDataSource.manager.getRepository(Punto).createQueryBuilder(), 'getOne').mockResolvedValue({
      puntosDisponibles: 10, // Solo 10 puntos disponibles
      puntosCanjeados: 0
    });

    const canjeData = {
        fecha: new Date(),
        usuario: { id: 1, nombre: "Juan Pérez", email: "juan@example.com", contrasena: "1234", rol: { id: 2, nombre : "Operativo" }, solicitudes: [] },
        medicamento: { id: 101, nombre: "Paracetamol", puntosParaCanje: 50, puntosPorCompra: 10, descripcion: "Medicamento para el dolor"
          , presentacion: { id: 1, nombre: "Tabletas" }, precio: 100, urlImagen: "https://www.example.com/paracetamol.jpg", estadoPromocion: true,
          solicitudes: []
         },
        farmacia: { id: 10, nombre: "Farmacia Central", direccion: "Av. Principal 123", telefono: "123456789", solicitudes: [], email: "central@gmail.com" },
        cantidad: 2
      };

    await expect(controladorCanjes.crearCanje(canjeData)).rejects.toThrow("Puntos insuficientes para realizar el canje.");
  });
  // ✅ Caso 3: Datos obligatorios faltantes
  it('Debe lanzar error si faltan datos obligatorios', async () => {
    const canjeData = {
      fecha: new Date(), // 🔹 Falta `usuario`, `medicamento` y `farmacia`
      cantidad: 2
    };

    await expect(controladorCanjes.crearCanje(canjeData as any)).rejects.toThrow(
      "Datos inválidos: fecha, idUsuario, idMedicamento, y idFarmacia son obligatorios."
    );
  });
});
