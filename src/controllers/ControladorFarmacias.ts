import { Farmacia } from '../entity/Farmacia';
import { AppDataSource } from '../data-source';
import { ListaSingleton } from '../ListaSingleton';
import { FarmaciaUsuarioAdapter } from '../adapter/FarmaciaUsuarioAdapter';
import { Rol } from '../entity/Rol';
import { Usuario } from '../entity/Usuario';
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
        await this.actualizarFarmacias();
        this.imprimirFarmacias(); // Imprime las farmacias después de cargarlas
    }

    // Método para obtener todas las farmacias desde la base de datos
    async actualizarFarmacias() {
        const farmacias = await this.dataSource.manager.find(Farmacia);
        const rol = await this.dataSource.manager.findOne(Rol, { where: { nombre: 'Farmacia' } });
        const contrasena = '1234'; // Contraseña predeterminada para todas las farmacias
        for (const farmacia of farmacias) {
            const usuarioNuevo = new Usuario();
            usuarioNuevo.nombre = farmacia.nombre;
            usuarioNuevo.email = "example@gmail.com";
            usuarioNuevo.contrasena = "password";
            usuarioNuevo.rol = rol;
            await this.dataSource.manager.save(usuarioNuevo);
            const user = await this.dataSource.manager.findOne(Usuario, { where: { nombre: farmacia.nombre } });
            const farmaciaUsuarioAdapter = new FarmaciaUsuarioAdapter(farmacia, rol, contrasena, user.id);

            this.ListaSingleton.agregarFarmaciaUsuario(farmaciaUsuarioAdapter);
        }

        this.ListaSingleton.setFarmacias(farmacias); // Usa la instancia global
        return farmacias;
    }

    // Método para obtener todas las farmacias
    async obtenerFarmacias() {
        return this.ListaSingleton.getFarmacias(); // Usa la instancia global
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
        return farmacia;

    }

    async setRoles(){
        const rol = await this.dataSource.manager.findOne(Rol, { where: { nombre: 'Farmacia' } });
        const farmaciaUsuarios = this.ListaSingleton.getFarmaciaUsuarios();
        for (const farmaciaUsuario of farmaciaUsuarios){
            farmaciaUsuario.rol = rol;
        }
        return farmaciaUsuarios;
    }

}