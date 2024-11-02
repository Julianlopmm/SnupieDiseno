import { Farmacia } from '../entity/Farmacia';
import { AppDataSource } from '../data-source';
import { ListaSingleton } from '../ListaSingleton';
interface FarmaciaRequest {
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
}



export class ControladorFarmacias {
    private ListaSingleton = ListaSingleton.getInstance(); // Obtén la instancia única

    constructor(private dataSource = AppDataSource) {
        this.init();
    }

    // Método de inicialización para cargar farmacias
    private async init() {
        await this.obtenerFarmacias();
        this.imprimirFarmacias(); // Imprime las farmacias después de cargarlas
    }

    // Método para obtener todas las farmacias desde la base de datos
    async obtenerFarmacias() {
        const farmacias = await this.dataSource.manager.find(Farmacia);
        this.ListaSingleton.setFarmacias(farmacias); // Usa la instancia global
        return farmacias;
    }

    // Método para imprimir todas las farmacias
    imprimirFarmacias() {
        const farmacias = this.ListaSingleton.getFarmacias(); // Usa la instancia global
        if (farmacias.length === 0) {
            console.log('No hay farmacias');
        }
        farmacias.forEach(farmacia => {
            console.log(farmacia);
            console.log("\n");
        });
    }

    async crearFarmacia(req : FarmaciaRequest){
        if (!req.nombre || !req.direccion || !req.telefono || !req.email){
            console.log('Datos incompletos');
            return;
        }
        const farmacia = this.dataSource.manager.create(Farmacia, req);
        await this.dataSource.manager.save(farmacia);
        this.ListaSingleton.agregarFarmacia(farmacia);
        console.log(`Farmacia creada: ${farmacia.nombre}`);

    }

}