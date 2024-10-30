import { Medicamento } from '../entity/Medicamento';
import { AppDataSource } from '../data-source';

export class ControladorMedicamentos {
    private medicamentos: Medicamento[] = [];

    constructor(private dataSource = AppDataSource) {
        this.init();
    }

    private async init() {
        await this.obtenerMedicamentos();
        this.imprimirMedicamentos(); // Imprime los medicamentos después de cargarlos
    }

    async obtenerMedicamentos() {
        this.medicamentos = await this.dataSource.manager.find(Medicamento, { relations: ["presentacion"] });
    }

    // Método para imprimir todos los medicamentos
    imprimirMedicamentos() {
        if (this.medicamentos.length === 0) {
            console.log('No hay medicamentos');
        }
        this.medicamentos.forEach(medicamento => {
            console.log(medicamento);
            console.log("\n");
        });
    }

    // Método para obtener un medicamento por ID
    async obtenerMedicamentoPorId(id: number) {
        let medicamento = this.medicamentos.find(medicamento => medicamento.id === id);
        if (!medicamento) {
            medicamento = await this.dataSource.manager.findOne(Medicamento, { where: { id } });
        }
        return medicamento;
    }

    // Método para crear un nuevo medicamento
    async crearMedicamento(medicamento: Medicamento) {
        const savedMedicamento = await this.dataSource.manager.save(medicamento);
        this.medicamentos.push(savedMedicamento); // Agrega el medicamento guardado a la memoria
        return savedMedicamento;
    }

    // Método para actualizar un medicamento existente
    async actualizarMedicamento(id: number, updatedMedicamento: Medicamento) {
        const index = this.medicamentos.findIndex(medicamento => medicamento.id === id);
        if (index === -1) {
            throw new Error('Medicamento no encontrado');
        }

        const medicamentoToUpdate = this.medicamentos[index];
        const mergedMedicamento = this.dataSource.manager.merge(Medicamento, medicamentoToUpdate, updatedMedicamento);
        const savedMedicamento = await this.dataSource.manager.save(mergedMedicamento);

        this.medicamentos[index] = savedMedicamento; // Actualiza el medicamento en memoria
        return savedMedicamento;
    }

    // Método para eliminar un medicamento
    async eliminarMedicamento(id: number) {
        const index = this.medicamentos.findIndex(medicamento => medicamento.id === id);
        if (index === -1) {
            throw new Error('Medicamento no encontrado');
        }

        await this.dataSource.manager.remove(this.medicamentos[index]); // Elimina de la base de datos
        this.medicamentos.splice(index, 1); // Elimina de la memoria
        return true;
    }
}
