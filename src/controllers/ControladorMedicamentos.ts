import { Medicamento } from '../entity/Medicamento';
import { AppDataSource } from '../data-source';

export class ControladorMedicamentos{

    constructor(private medicamentos: Medicamento[]){}
    dataSource = AppDataSource;

    async obtenerMedicamentos(){
        this.dataSource.manager.find(Medicamento).then((medicamentos) => {
            this.medicamentos = medicamentos;
        });
    }

    async obtenerMedicamentoPorId(id: number){
        return this.medicamentos.find(medicamento => medicamento.id === id);
    }

    async crearMedicamento(medicamento: Medicamento){
        this.medicamentos.push(medicamento);
        return medicamento;
    }

    async actualizarMedicamento(id: number, medicamento: Medicamento){
        const index = this.medicamentos.findIndex(medicamento => medicamento.id === id);
        if(index === -1){
            throw new Error('Medicamento no encontrado');
        }
        this.medicamentos[index] = medicamento;
        return medicamento;
    }

    async eliminarMedicamento(id: number){
        const index = this.medicamentos.findIndex(medicamento => medicamento.id === id);
        if(index === -1){
            throw new Error('Medicamento no encontrado');
        }
        this.medicamentos.splice(index, 1);
        return true;
    }

}