import { ControladorCanjes } from '../src/controllers/ControladorCanjes';
import { AppDataSource } from '../src/data-source';
import { Punto } from '../src/entity/Punto';
import { Usuario } from '../src/entity/Usuario';
import { Medicamento } from '../src/entity/Medicamento';
import { Farmacia } from '../src/entity/Farmacia';
import { Canjes } from '../src/entity/Canjes';
import { Solicitud } from '../src/entity/Solicitud';
import { Estado } from '../src/entity/Estado';

jest.mock('../src/data-source');
jest.mock('../src/Visitor/CandidatoVisitor');
jest.mock('../src/Visitor/ActualizarVisitor');



describe('ControladorCanjes', () => {
    let controlador: ControladorCanjes;
    let mockDataSource: any;

    beforeEach(() => {
        mockDataSource = {
            manager: {
                find: jest.fn(),
                findOne: jest.fn(),
                save: jest.fn(),
                getRepository: jest.fn().mockReturnValue({
                    createQueryBuilder: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    andWhere: jest.fn().mockReturnThis(),
                    getOne: jest.fn()
                })
            }
        };
        controlador = new ControladorCanjes(mockDataSource);

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

    test('crearCanje - success', async () => {
        const canjeData = {
            fecha: new Date(),
            medicamento: { id: 1, nombre: 'Medicamento A', descripcion: 'Desc', presentacion: null, precio: 10, puntosPorCompra: 5, puntosParaCanje: 10, urlImagen: '', estadoPromocion: false, solicitudes: []},
            usuario: { id: 1, nombre: 'Usuario A', email: 'user@example.com', contrasena: '1234', rol: null, solicitudes: [] },
            farmacia: { id: 1, nombre: 'Farmacia A', direccion: 'Direccion A', telefono: '123456', email: 'farmacia@example.com' },
            cantidad: 1
        };

        mockDataSource.manager.findOne.mockResolvedValueOnce({ id: 1 });
        mockDataSource.manager.findOne.mockResolvedValueOnce({ id: 1, puntosParaCanje: 10 });
        mockDataSource.manager.findOne.mockResolvedValueOnce({ id: 1 });
        mockDataSource.manager.find.mockResolvedValue([]);
        mockDataSource.manager.getRepository().createQueryBuilder().getOne.mockResolvedValue({ puntosDisponibles: 20, puntosCanjeados: 0 });
        mockDataSource.manager.save.mockResolvedValue({ id: 1 });

        const result = await controlador.crearCanje(canjeData);

        expect(result.mensaje).toBe('Canje creado exitosamente');
        expect(result.canje.id).toBe(1);
    });


    test('crearCanje - success', async () => {
        const canjeData = {
            fecha: new Date(),
            medicamento: { id: 1, nombre: 'Medicamento A', descripcion: 'Desc', presentacion: null, precio: 10, puntosPorCompra: 5, puntosParaCanje: 10, urlImagen: '', estadoPromocion: false, solicitudes: []},
            usuario: { id: 1, nombre: 'Usuario A', email: 'user@example.com', contrasena: '1234', rol: null, solicitudes: [] },
            farmacia: { id: 1, nombre: 'Farmacia A', direccion: 'Direccion A', telefono: '123456', email: 'farmacia@example.com' },
            cantidad: 1
        };

        const mockUsuario = { id: 1, nombre: 'Usuario A', email: 'user@example.com', contrasena: '1234', rol: null, solicitudes: [] };
        const mockMedicamento = { id: 1, nombre: 'Medicamento A', descripcion: 'Desc', presentacion: null, precio: 10, puntosPorCompra: 5, puntosParaCanje: 10, urlImagen: '', estadoPromocion: false, solicitudes: [] };
        const mockFarmacia = { id: 1, nombre: 'Farmacia A', direccion: 'Direccion A', telefono: '123456', email: 'farmacia@example.com' };
        const mockPunto = { id: 1, puntosAcumulados: 100, puntosDisponibles: 20, puntosCanjeados: 0, medicamento: mockMedicamento, usuario: mockUsuario };
        const mockSolicitud = { id: 1, numSolicitud: '123', fecha: new Date(), medicamento: mockMedicamento, cantidad: 1, farmacia: mockFarmacia, estadoSolicitud: null, usuario: mockUsuario, urlImagen: '', canje: null };

        mockDataSource.manager.findOne.mockResolvedValueOnce(mockUsuario);
        mockDataSource.manager.findOne.mockResolvedValueOnce(mockMedicamento);
        mockDataSource.manager.findOne.mockResolvedValueOnce(mockFarmacia);
        mockDataSource.manager.find.mockResolvedValue([mockSolicitud]);
        mockDataSource.manager.getRepository().createQueryBuilder().getOne.mockResolvedValue(mockPunto);
        mockDataSource.manager.save.mockResolvedValue({ id: 1 });

        const result = await controlador.crearCanje(canjeData);

        expect(result.mensaje).toBe('Canje creado exitosamente');
        expect(result.canje.id).toBe(1);
    });

    test('Debe lanzar error si el usuario no tiene suficientes puntos', async () => {
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
    
        await expect(controlador.crearCanje(canjeData)).rejects.toThrow("Puntos insuficientes para realizar el canje.");
      });

    test('Faltan datos obligatorios - Medicinas', async () => {
        const canjeData = {
            fecha: new Date(),
            medicamento: null, //Medicamentos es Null
            usuario: { id: 1, nombre: 'Usuario A', email: 'user@example.com', contrasena: '1234', rol: null, solicitudes: [] },
            farmacia: { id: 1, nombre: 'Farmacia A', direccion: 'Direccion A', telefono: '123456', email: 'farmacia@example.com' },
            cantidad: 1
        };

        await expect(controlador.crearCanje(canjeData)).rejects.toThrow('Datos inválidos: fecha, idUsuario, idMedicamento, y idFarmacia son obligatorios.');
    });

    test('Faltan datos obligatorios - Usuario', async () => {
        const canjeData = {
            fecha: new Date(),
            medicamento: { id: 1, nombre: 'Medicamento A', descripcion: 'Desc', presentacion: null, precio: 10, puntosPorCompra: 5, puntosParaCanje: 10, urlImagen: '', estadoPromocion: false, solicitudes: []},
            usuario: null, //Usuario es Null
            farmacia: { id: 1, nombre: 'Farmacia A', direccion: 'Direccion A', telefono: '123456', email: 'farmacia@example.com' },
            cantidad: 1
        };

        await expect(controlador.crearCanje(canjeData)).rejects.toThrow('Datos inválidos: fecha, idUsuario, idMedicamento, y idFarmacia son obligatorios.');
    });
});