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
}