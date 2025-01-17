import { AppDataSource } from '../data-source';
import { Canjes } from '../entity/Canjes';
import { Farmacia } from '../entity/Farmacia';
import { Medicamento } from '../entity/Medicamento';
import { Punto } from '../entity/Punto';
import { Solicitud } from '../entity/Solicitud';
import { Usuario } from '../entity/Usuario';
import { ActualizarVisitor } from '../Visitor/ActualizarVisitor';
import { CandidatoVisitor } from '../Visitor/CandidatoVisitor';
import { ContextoOrden } from '../Strategy/ContextoOrden';
import { FiltrarSolicitudesPorCanje } from '../Strategy/FiltrarSolicitudesPorCanje';
interface CanjesRequest {
    fecha: Date;
    medicamento: Medicamento;
    usuario: Usuario;
    farmacia: Farmacia;
    cantidad: number;
}


export class ControladorCanjes {

    private canjes: Canjes[] = [];
    

    constructor(private dataSource = AppDataSource) {
        this.init();
    }

    private async init() {
        await this.obtenerCanjes();
    }

    async obtenerCanjes() {
        this.canjes = await this.dataSource.manager.find(Canjes);
    }

    async getCanjes() {
        return await this.dataSource.manager.find(Canjes, { relations: ['medicamento', 'usuario', 'farmacia'] });
    }

    async crearCanje(canjeData: CanjesRequest) {
        if (!canjeData.fecha || !canjeData.usuario || !canjeData.medicamento || !canjeData.farmacia) {
            throw new Error('Datos inválidos: fecha, idUsuario, idMedicamento, y idFarmacia son obligatorios.');
        }
    
        try {
            // Buscar las entidades relacionadas
            const usuario = await this.dataSource.manager.findOne(Usuario, { where: { id: canjeData.usuario.id } });
            if (!usuario) throw new Error('Usuario no encontrado');
    
            const medicamento = await this.dataSource.manager.findOne(Medicamento, { where: { id: canjeData.medicamento.id } });
            if (!medicamento) throw new Error('Medicamento no encontrado');
    
            const farmacia = await this.dataSource.manager.findOne(Farmacia, { where: { id: canjeData.farmacia.id } });
            if (!farmacia) throw new Error('Farmacia no encontrada');

            const puntosNecesarios = canjeData.cantidad * medicamento.puntosParaCanje

            // Aplicar visitor para cargar solicitudes sin canje del usuario

            const solicitudes = await this.dataSource.manager.find(Solicitud, {
                relations: ['medicamento', 'medicamento.presentacion', 'farmacia', 'estadoSolicitud', 'usuario', 'canje'],
            });
        
            // Crear una instancia del CandidatoVisitor
            const candidatoVisitor = new CandidatoVisitor();
        
            const solicitudesSinCanje: Solicitud[] = [];
        
            for (const solicitud of solicitudes) {
                // Usar el visitante para determinar si la solicitud es aceptada
                const solicitudAceptada = await candidatoVisitor.visitSolicitud(solicitud);

                // Si es aceptada y pertenece al usuario dado, la agregamos al resultado
                if (solicitudAceptada && solicitudAceptada.usuario.id == canjeData.usuario.id && solicitudAceptada.medicamento.id == canjeData.medicamento.id && solicitudAceptada.canje == null) {
                    solicitudesSinCanje.push(solicitudAceptada);
                }
            }

            const puntoRepository = this.dataSource.manager.getRepository(Punto);
            const puntos = await puntoRepository.createQueryBuilder('punto')
            .where('punto.usuarioId = :usuarioId', { usuarioId: canjeData.usuario.id })
            .andWhere('punto.medicamentoId = :medicamentoId', { medicamentoId: canjeData.medicamento.id })
            .getOne();

            if (!puntos) throw new Error('Puntos no encontrados');

            if (puntos.puntosDisponibles < puntosNecesarios){
                throw new Error('Puntos insuficientes para realizar el canje.');
            }
    
            // Seleccionar las solicitudes necesarias para cumplir con los puntos del canje
            let puntosAcumulados = 0;
            const solicitudesSeleccionadas = [];
            for (const solicitud of solicitudesSinCanje) {
                if (puntosAcumulados >= puntosNecesarios) break;
                puntosAcumulados += (solicitud.cantidad * medicamento.puntosPorCompra);
                solicitudesSeleccionadas.push(solicitud);
            }
    
            // Crear el canje
            const canje = new Canjes();
            canje.fecha = canjeData.fecha;
            canje.medicamento = canjeData.medicamento;
            canje.usuario = canjeData.usuario;
            canje.farmacia = canjeData.farmacia;
            canje.cantidad = canjeData.cantidad;
    
            const savedCanje = await this.dataSource.manager.save(canje);

            const actualizarVisitor = new ActualizarVisitor(savedCanje);
    
            // Asociar las solicitudes seleccionadas al canje
            for (const solicitud of solicitudesSeleccionadas) {
                // solicitud.canje = savedCanje;
                actualizarVisitor.visitSolicitud(solicitud);
            }

            // await solicitudRepository.save(solicitudesSeleccionadas);

            // Actualizar puntos en la base
            puntos.puntosDisponibles -= puntosNecesarios;
            puntos.puntosCanjeados += puntosNecesarios;
            await puntoRepository.save(puntos);
            
    
            return {
                mensaje: 'Canje creado exitosamente',
                canje: savedCanje,
                solicitudes: solicitudesSeleccionadas,
            };
        } catch (error) {
            console.error('Error al guardar el canje:', error);
            throw new Error(error.message || 'Error al guardar el canje en la base de datos.');
        }
    }

    async obtenerCanjesPorUsuario(idUsuario: number) {
        return await this.dataSource.manager.find(Canjes, { where: { usuario: { id: idUsuario } }, relations: ['medicamento', 'usuario', 'farmacia'] });
    }

    async obtenerSolicitudesPorCanje(idCanje: number) {
        const contexto = new ContextoOrden(
            new FiltrarSolicitudesPorCanje()
          );
        const solicitudes = await this.dataSource.manager.find(Solicitud, {relations: ['medicamento', 'medicamento.presentacion', 'farmacia', 'estadoSolicitud', 'usuario', 'canje'] });
        const solicitudesConCanje = contexto.ordenarSolicitudes(solicitudes);
        const solicitudesCanjeID = solicitudesConCanje.filter(solicitud => solicitud.canje.id == idCanje);

        return solicitudesCanjeID;
    }

}