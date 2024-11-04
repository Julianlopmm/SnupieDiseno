import { Medicamento } from '../entity/Medicamento';
import { AppDataSource } from '../data-source';
import { Presentacion } from '../entity/Presentacion';
import { ListaSingleton } from '../ListaSingleton';

export class ControladorMedicamentos {
    private ListaSingleton = ListaSingleton.getInstance(); // Obtén la instancia única

    constructor(private dataSource = AppDataSource) {
        this.init();
    }

    private async init() {
        await this.inicializarPresentaciones();
        await this.actualizarMedicamentos();
        this.imprimirMedicamentos(); // Imprime los medicamentos después de cargarlos
    }

    async actualizarMedicamentos() {
        const medicamentos = await this.dataSource.manager.find(Medicamento, { relations: ["presentacion"] });
        this.ListaSingleton.setMedicamentos(medicamentos); // Usa la instancia global
        return medicamentos;
    }

    async obtenerMedicamentos() {
        return this.ListaSingleton.getMedicamentos(); // Usa la instancia global
    }
    
    async obtenerMedicamentosActivos() {
        const medicamentos = this.ListaSingleton.getMedicamentos();
        const medicamentosActivos = medicamentos.filter(medicamento => medicamento.estadoPromocion === true);
        return medicamentosActivos;
    }


    private async inicializarPresentaciones() {
        const presentaciones = ["pastilla", "boli", "botella"];

        for (const nombre of presentaciones) {
            // Verifica si la presentación ya existe
            let presentacion = await this.dataSource.manager.findOne(Presentacion, { where: { nombre } });
            if (!presentacion) {
                // Crea la presentación si no existe
                presentacion = this.dataSource.manager.create(Presentacion, { nombre });
                await this.dataSource.manager.save(presentacion);
            }
        }
    }


    // Método para imprimir todos los medicamentos
    imprimirMedicamentos() {
        const medicamentos = this.ListaSingleton.getMedicamentos(); // Usa la instancia global
        if (medicamentos.length === 0) {
            console.log('No hay medicamentos');
        }
        medicamentos.forEach(medicamento => {
            console.log(medicamento);
            console.log("\n");
        });
    }

    // Método para obtener un medicamento por ID
    async obtenerMedicamentoPorId(id: number) {
        let medicamento = this.ListaSingleton.getMedicamentos().find(medicamento => medicamento.id === id);
        if (!medicamento) {
            medicamento = await this.dataSource.manager.findOne(Medicamento, { where: { id } });
        }
        return medicamento;
    }

    // Método para crear un nuevo medicamento
       // Método para crear un nuevo medicamento
    async crearMedicamento(data: Partial<Medicamento>) {
        // Verifica y carga la entidad de Presentacion
        if (data.presentacion && data.presentacion.id) {
            const presentacion = await this.dataSource.manager.findOne(Presentacion, { where: { id: data.presentacion.id } });
            if (!presentacion) {
                throw new Error('Presentación no encontrada');
            }
            data.presentacion = presentacion;
        } else {
            throw new Error('Presentación es requerida');
        }

        // Crea una instancia de Medicamento
        const nuevoMedicamento = this.dataSource.manager.create(Medicamento, data);

        // Guarda el medicamento en la base de datos
        const savedMedicamento = await this.dataSource.manager.save(nuevoMedicamento);
        this.ListaSingleton.agregarMedicamento(savedMedicamento); // Usa la instancia global
        return savedMedicamento;
    }

    // Método para actualizar un medicamento existente
    async actualizarMedicamento(id: number, updatedMedicamento: Medicamento) {
        let medicamentos = this.ListaSingleton.getMedicamentos(); // Usa la instancia global
        const index = medicamentos.findIndex(medicamento => medicamento.id === id);
        if (index === -1) {
            throw new Error('Medicamento no encontrado');
        }

        const medicamentoToUpdate = medicamentos[index];
        const mergedMedicamento = this.dataSource.manager.merge(Medicamento, medicamentoToUpdate, updatedMedicamento);
        const savedMedicamento = await this.dataSource.manager.save(mergedMedicamento);

        medicamentos[index] = savedMedicamento; // Actualiza el medicamento en memoria
        return savedMedicamento;
    }

    // Método para eliminar un medicamento
    async eliminarMedicamento(id: number) {
        let medicamentos = this.ListaSingleton.getMedicamentos(); // Usa la instancia global
        const index = medicamentos.findIndex(medicamento => medicamento.id === id);
        if (index === -1) {
            throw new Error('Medicamento no encontrado');
        }

        await this.dataSource.manager.remove(medicamentos[index]); // Elimina de la base de datos
        medicamentos.splice(index, 1); // Elimina de la memoria
        return true;
    }

    // Método para configurar un medicamento existente
    async configurarMedicamento(id: number, configuracion: Partial<Medicamento>) {
        // Busca el medicamento existente por ID
        let medicamento = await this.obtenerMedicamentoPorId(id);
        if (!medicamento) {
            throw new Error('Medicamento no encontrado');
        }
    
        // Crea una copia del medicamento existente con los valores del objeto de configuración
        const medicamentoActualizado = { ...medicamento, ...configuracion };
    
        // Guarda los cambios en la base de datos
        const savedMedicamento = await this.dataSource.manager.save(Medicamento, medicamentoActualizado);
    
        // Actualiza el medicamento en memoria
        let medicamentos = this.ListaSingleton.getMedicamentos(); // Usa la instancia global
        const index = medicamentos.findIndex(m => m.id === id);
        if (index !== -1) {
            medicamentos[index] = savedMedicamento;
        }
    
        return savedMedicamento;
    }
    



}
