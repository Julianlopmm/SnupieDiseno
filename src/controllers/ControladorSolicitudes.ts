import { Solicitud } from "../entity/Solicitud";
import { AppDataSource } from "../data-source";

export class ControladorSolicitudes {
    private solicitudes: Solicitud[] = [];

    constructor(private dataSource = AppDataSource) {
        this.init();
    }

    // Método de inicialización para cargar solicitudes
    private async init() {
        await this.obtenerSolicitudes();
        this.imprimirSolicitudes(); // Imprime las solicitudes después de cargarlas
    }

    // Método para obtener todas las solicitudes desde la base de datos
    async obtenerSolicitudes() {
        this.solicitudes = await this.dataSource.manager.find(Solicitud);
    }

    // Método para imprimir todas las solicitudes
    imprimirSolicitudes() {
        if (this.solicitudes.length === 0) {
            console.log('No hay solicitudes');
        }
        this.solicitudes.forEach(solicitud => {
            console.log(solicitud);
            console.log("\n");
        });
    }

    // Método para obtener una solicitud por ID
    async obtenerSolicitudPorId(id: number) {
        let solicitud = this.solicitudes.find(solicitud => solicitud.id === id);
        if (!solicitud) {
            solicitud = await this.dataSource.manager.findOne(Solicitud, { where: { id } });
        }
        return solicitud;
    }

    // Método para crear una nueva solicitud
    async crearSolicitud(solicitud: Solicitud) {
        const savedSolicitud = await this.dataSource.manager.save(solicitud);
        this.solicitudes.push(savedSolicitud); // Agrega la solicitud guardada a la memoria
        return savedSolicitud;
    }

    // Método para actualizar una solicitud existente
    async actualizarSolicitud(id: number, updatedSolicitud: Solicitud) {
        const index = this.solicitudes.findIndex(solicitud => solicitud.id === id);
        if (index === -1) {
            throw new Error('Solicitud no encontrada');
        }

        const solicitudToUpdate = this.solicitudes[index];
        const mergedSolicitud = this.dataSource.manager.merge(Solicitud, solicitudToUpdate, updatedSolicitud);
        const savedSolicitud = await this.dataSource.manager.save(mergedSolicitud);

        this.solicitudes[index] = savedSolicitud; // Actualiza la solicitud en memoria
        return savedSolicitud;
    }

    // Método para eliminar una solicitud
    async eliminarSolicitud(id: number) {
        const index = this.solicitudes.findIndex(solicitud => solicitud.id === id);
        if (index === -1) {
            throw new Error('Solicitud no encontrada');
        }

        await this.dataSource.manager.remove(this.solicitudes[index]); // Elimina de la base de datos
        this.solicitudes.splice(index, 1); // Elimina de la memoria
        return true;
    }
}
