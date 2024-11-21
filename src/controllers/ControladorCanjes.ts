import { AppDataSource } from '../data-source';
import { Canjes } from '../entity/Canjes';
import { Farmacia } from '../entity/Farmacia';
import { Medicamento } from '../entity/Medicamento';
import { Usuario } from '../entity/Usuario';

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
        // Validación de los datos requeridos
        if (!canjeData.fecha || !canjeData.medicamento || !canjeData.usuario || !canjeData.farmacia) {
            throw new Error('Datos inválidos: fecha, medicamento, usuario y farmacia son obligatorios.');
        }
    
        // Crea una instancia del canje
        const canje = new Canjes();
        canje.fecha = canjeData.fecha;
        canje.medicamento = canjeData.medicamento;
        canje.usuario = canjeData.usuario;
        canje.farmacia = canjeData.farmacia;
        canje.cantidad =canjeData.cantidad;
    
        try {
            // Guarda el canje en la base de datos
            const savedCanje = await this.dataSource.manager.save(canje);
            this.canjes.push(savedCanje);
            return {
                mensaje: 'Canje creado exitosamente',
                canjeId: savedCanje.id,
                canje: savedCanje
            };
        } catch (error) {
            console.error('Error al guardar el canje:', error);
            throw new Error('Error al guardar el canje en la base de datos.');
        }
    }
    
}