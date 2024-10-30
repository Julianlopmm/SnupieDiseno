import { Solicitud } from "../entity/Solicitud";
import { AppDataSource } from "../data-source";
import { Estado } from "../entity/Estado";
import { Medicamento } from "../entity/Medicamento";
import { Farmacia } from "../entity/Farmacia";
import { Usuario } from "../entity/Usuario";

interface SolicitudRequest{
    numSolicitud: string;
    fecha: Date;
    medicamento: Medicamento;
    cantidad: number;
    farmacia: Farmacia;
    estadoSolicitud: Estado;
    usuario: Usuario
}



export class ControladorSolicitudes {
    private solicitudes: Solicitud[] = [];

    private estados: Estado[] = [];

    constructor(private dataSource = AppDataSource) {
        this.init();
    }

    // Método de inicialización para cargar solicitudes
    private async init() {
        await this.obtenerSolicitudes();
        await this.crearEstadosPredeterminados();
        this.imprimirSolicitudes(); // Imprime las solicitudes después de cargarlas
    }

    // Método para obtener todas las solicitudes desde la base de datos
    async obtenerSolicitudes() {
        this.solicitudes = await this.dataSource.manager.find(Solicitud);
    }

    async crearEstadosPredeterminados(){
        const estadosPredeterminados = [
            {nombre: "Pendiente"},
            {nombre: "Aceptada"},
            {nombre: "Rechazada"}
        ]

        for (const estadoData of estadosPredeterminados){
            const rolExistente = await this.dataSource.manager.findOne(Estado, {where: {nombre: estadoData.nombre}});
            if (!rolExistente){
                const estado = new Estado();
                estado.nombre = estadoData.nombre;
                await this.dataSource.manager.save(estado);
                console.log(`Estado creado: ${estado.nombre}`);
            } else {
                console.log(`Estado ya existe: ${estadoData.nombre}`);
            }
        }
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
    async crearSolicitud(solicitud: SolicitudRequest) {

        if (!solicitud.numSolicitud || !solicitud.fecha || !solicitud.medicamento || !solicitud.farmacia || !solicitud.estadoSolicitud || !solicitud.usuario) {
            throw new Error('Invalid data');
        }

        const nuevaSolicitud = new Solicitud();
        nuevaSolicitud.numSolicitud = solicitud.numSolicitud;
        nuevaSolicitud.fecha = solicitud.fecha;
        nuevaSolicitud.medicamento = solicitud.medicamento;
        nuevaSolicitud.cantidad = solicitud.cantidad;
        nuevaSolicitud.farmacia = solicitud.farmacia;
        nuevaSolicitud.estadoSolicitud = solicitud.estadoSolicitud;
        nuevaSolicitud.usuario = solicitud.usuario;

        const savedSolicitud = await this.dataSource.manager.save(nuevaSolicitud);
        this.solicitudes.push(savedSolicitud); // Agrega la solicitud guardada a la memoria
        return savedSolicitud;
    }

    // Método para actualizar una solicitud existente
    // async actualizarSolicitud(id: number, updatedSolicitud: Solicitud) {
    //     const index = this.solicitudes.findIndex(solicitud => solicitud.id === id);
    //     if (index === -1) {
    //         throw new Error('Solicitud no encontrada');
    //     }

    //     const solicitudToUpdate = this.solicitudes[index];
    //     const mergedSolicitud = this.dataSource.manager.merge(Solicitud, solicitudToUpdate, updatedSolicitud);
    //     const savedSolicitud = await this.dataSource.manager.save(mergedSolicitud);

    //     this.solicitudes[index] = savedSolicitud; // Actualiza la solicitud en memoria
    //     return savedSolicitud;
    // }

    // Método para aceptar una solicitud

    async aceptarSolicitud(idSolicitud: number){
        const solicitud = await this.obtenerSolicitudPorId(idSolicitud);
        if (!solicitud){
            throw new Error('Solicitud no encontrada');
        }

        const estadoAceptado = await this.dataSource.manager.findOne(Estado, {where: {nombre: 'Aceptada'}});
        solicitud.estadoSolicitud = estadoAceptado;
        const solicitudActualizada = await this.dataSource.manager.save(solicitud);
        return solicitudActualizada;
    }

    async rechazarSolicitud(idSolicitud: number){
        const solicitud = await this.obtenerSolicitudPorId(idSolicitud);
        if (!solicitud){
            throw new Error('Solicitud no encontrada');
        }

        const estadoRechazado = await this.dataSource.manager.findOne(Estado, {where: {nombre: 'Rechazada'}});
        solicitud.estadoSolicitud = estadoRechazado;
        const solicitudActualizada = await this.dataSource.manager.save(solicitud);
        return solicitudActualizada;
    }

    async obtenerSolicitudesPendientes(){
        const estadoPendiente = await this.dataSource.manager.findOne(Estado, {where: {nombre: 'Pendiente'}});
        const solicitudesPendientes = await this.dataSource.manager.find(Solicitud, {where: {estadoSolicitud: estadoPendiente}});
        return solicitudesPendientes;
    }

}
