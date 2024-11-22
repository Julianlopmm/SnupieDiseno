import { Solicitud } from "../entity/Solicitud";
import { AppDataSource } from "../data-source";
import { Estado } from "../entity/Estado";
import { Medicamento } from "../entity/Medicamento";
import { Farmacia } from "../entity/Farmacia";
import { Usuario } from "../entity/Usuario";
import { Punto } from "../entity/Punto";
import { ContextoOrden } from "../Strategy/ContextoOrden";
import { OrdenCronologicoAscendente } from "../Strategy/OrdenCronologicoAscendente";
import { FiltrarSolicitudesConCanje } from "../Strategy/FiltrarSolicitudesConCanje";
import { CandidatoVisitor } from "../Visitor/CandidatoVisitor";

interface SolicitudRequest{
    numSolicitud: string;
    fecha: Date;
    medicamento: Medicamento;
    cantidad: number;
    farmacia: Farmacia;
    estadoSolicitud: Estado;
    usuario: Usuario
    urlImagen: string
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
        this.solicitudes = await this.dataSource.manager.find(Solicitud, { relations: ['medicamento', 'medicamento.presentacion', 'farmacia', 'estadoSolicitud', 'usuario'] });
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
            solicitud = await this.dataSource.manager.findOne(Solicitud, { where: { id }, relations: ['medicamento', 'medicamento.presentacion', 'farmacia', 'estadoSolicitud', 'usuario'] });
        }
        return solicitud;
    }

    // Método para crear una nueva solicitud
    async crearSolicitud(solicitud: SolicitudRequest) {

        if (!solicitud.numSolicitud || !solicitud.fecha || !solicitud.medicamento || !solicitud.farmacia || !solicitud.estadoSolicitud || !solicitud.usuario || !solicitud.urlImagen) {
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
        nuevaSolicitud.urlImagen = solicitud.urlImagen;

        const savedSolicitud = await this.dataSource.manager.save(nuevaSolicitud);
        this.solicitudes.push(savedSolicitud); // Agrega la solicitud guardada a la memoria
        

        return savedSolicitud;
    }


    async aceptarSolicitud(idSolicitud: number) {
        const solicitud = await this.obtenerSolicitudPorId(idSolicitud);
        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }
    
        const estadoAceptado = await this.dataSource.manager.findOne(Estado, {where: {nombre: 'Aceptada'}});
        if (!estadoAceptado) {
            throw new Error('Estado "Aceptada" no encontrado');
        }
        console.log(solicitud);
        solicitud.estadoSolicitud = estadoAceptado;
        const solicitudActualizada = await this.dataSource.manager.save(solicitud);
    
        let puntosMedicamento = await this.dataSource.manager.findOne(Punto, {where: {medicamento: solicitud.medicamento, usuario: solicitud.usuario}});
        let medicamento = await this.dataSource.manager.findOne(Medicamento, {where: {id: solicitud.medicamento.id}});
        if (!puntosMedicamento) {
            let punto = new Punto();
            punto.puntosDisponibles = solicitud.cantidad * medicamento.puntosPorCompra;
            punto.puntosAcumulados = solicitud.cantidad * medicamento.puntosPorCompra;
            punto.puntosCanjeados = 0;
            punto.medicamento = solicitud.medicamento;
            punto.usuario = solicitud.usuario;
            await this.dataSource.manager.save(punto);
        } else {
            console.log('Cantidad:', solicitud.cantidad);
            console.log('Medicamento:', solicitud.medicamento);
            console.log('Puntos por compra:', solicitud.medicamento.puntosPorCompra);
            console.log('Puntos disponibles:', puntosMedicamento.puntosDisponibles);
            console.log('Puntos acumulados:', puntosMedicamento.puntosAcumulados);
            puntosMedicamento.puntosDisponibles += solicitud.cantidad * medicamento.puntosPorCompra;
            puntosMedicamento.puntosAcumulados += solicitud.cantidad * medicamento.puntosPorCompra;
            await this.dataSource.manager.save(puntosMedicamento);
        }
    
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

    async obtenerSolicitudesPendientes() {
        const estadoPendiente = await this.dataSource.manager.findOne(Estado, { where: { nombre: 'Pendiente' } });
        const solicitudesPendientes = await this.dataSource.manager.find(Solicitud, {
            where: { estadoSolicitud: estadoPendiente },
            relations: ['medicamento', 'medicamento.presentacion', 'farmacia', 'estadoSolicitud', 'usuario']
        });
        return solicitudesPendientes;
    }

    async obtenerSolicitudesUsuarioAprobadas(_usuario: Usuario): Promise<Solicitud[]> {
        // Obtener todas las solicitudes con sus relaciones necesarias
        const solicitudes = await this.dataSource.manager.find(Solicitud, {
            relations: ['medicamento', 'medicamento.presentacion', 'farmacia', 'estadoSolicitud', 'usuario'],
        });
    
        // Crear una instancia del CandidatoVisitor
        const candidatoVisitor = new CandidatoVisitor();
    
        const solicitudesAprobadas: Solicitud[] = [];
    
        for (const solicitud of solicitudes) {
            // Usar el visitante para determinar si la solicitud es aceptada
            const solicitudAceptada = await candidatoVisitor.visitSolicitud(solicitud);
            // Si es aceptada y pertenece al usuario dado, la agregamos al resultado
            if (solicitudAceptada && solicitudAceptada.usuario.id === _usuario.id) {
                solicitudesAprobadas.push(solicitudAceptada);
            }
        }
        return solicitudesAprobadas;
    }

    async obtenerMedicamentosSegunSolicitudesUsuario(idUsuario: number) {
        const usuario = await this.dataSource.manager.findOne(Usuario, { where: { id: idUsuario } });
        const medicamentos = await this.dataSource.manager.find(Medicamento, { relations: ['presentacion'] });
        const solicitudes = await this.obtenerSolicitudesUsuarioAprobadas(usuario); 
        const medicamentosUsuario = medicamentos.filter(medicamento => solicitudes.some(solicitud => solicitud.medicamento.id === medicamento.id));
        const puntos = await this.dataSource.manager.find(Punto, {where: {usuario: usuario}, relations: ['medicamento']});

        const medicamentosUsuarioConPuntos = medicamentosUsuario.map(medicamento => {
            const punto = puntos.find(punto => punto.medicamento.id === medicamento.id);
            return {
                ...medicamento,
                puntosDisponibles: punto?.puntosDisponibles || 0,
                puntosAcumulados: punto?.puntosAcumulados || 0,
                puntosCanjeados: punto?.puntosCanjeados || 0
            }
        });
        
        return medicamentosUsuarioConPuntos; 
    }


    async obtenerSolicitudesPorCriterioYUsuario(medicamentoId: number, userId: number, criterio: string): Promise<any[]> {
        const usuario = await this.dataSource.manager.findOne(Usuario, { where: { id: userId } });
        if (!usuario) {
          throw new Error("Usuario no encontrado");
        }
      
        const solicitudes = await this.dataSource.manager.find(Solicitud, {
          where: { usuario, medicamento: { id: medicamentoId }, estadoSolicitud: { nombre: "Aceptada" } },
          relations: ["farmacia", "canje", "medicamento"],
        });
      
        const contexto = new ContextoOrden(
          criterio === "ascendente" ? new OrdenCronologicoAscendente() : new FiltrarSolicitudesConCanje()
        );
      
        return contexto.ordenarSolicitudes(solicitudes);
      }
      

    async visitarSolicitud(idSolicitud: number) {
        const solicitud = await this.obtenerSolicitudPorId(idSolicitud);
        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }
    
        // Crear una instancia del CandidatoVisitor
        const candidatoVisitor = new CandidatoVisitor();
    
        // Usar el visitante para determinar si la solicitud es aceptada
        const solicitudAceptada = await candidatoVisitor.visitSolicitud(solicitud);
    
        return solicitudAceptada;
    }




}
