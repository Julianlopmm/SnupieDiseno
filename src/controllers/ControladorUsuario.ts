import { Usuario } from "../entity/Usuario";
import { AppDataSource } from "../data-source";

export class ControladorUsuario {
    private usuarios: Usuario[] = [];
    
    constructor(private dataSource = AppDataSource) {
        this.init();
    }
    
    async init() {
        await this.obtenerUsuarios();
        this.imprimirUsuarios();
    }
    

    async obtenerUsuarios() {
        this.usuarios = await this.dataSource.manager.find(Usuario);
        return this.usuarios;
    }

    async imprimirUsuarios() {
        if (this.usuarios.length === 0) {
            console.log('No hay usuarios');
        }
        this.usuarios.forEach(usuario => {
            console.log(usuario);
            console.log("\n");
        });
    }

    async obtenerUsuarioPorId(id: number) {
        let usuario = this.usuarios.find(usuario => usuario.id === id);
        if (!usuario) {
            usuario = await this.dataSource.manager.findOne(Usuario, { where: { id } });
        }
        return usuario;
    }

    async crearUsuario(usuario: Usuario) {
        const savedUsuario = await this.dataSource.manager.save(usuario);
        this.usuarios.push(savedUsuario);
        return savedUsuario;
    }

    async actualizarUsuario(id: number, updatedUsuario: Usuario) {
        const index = this.usuarios.findIndex(usuario => usuario.id === id);
        if (index === -1) {
            throw new Error('Usuario no encontrado');
        }

        const usuarioToUpdate = this.usuarios[index];
        const mergedUsuario = this.dataSource.manager.merge(Usuario, usuarioToUpdate, updatedUsuario);
        const savedUsuario = await this.dataSource.manager.save(mergedUsuario);

        this.usuarios[index] = savedUsuario;
        return savedUsuario;
    }

    async eliminarUsuario(id: number) {
        const index = this.usuarios.findIndex(usuario => usuario.id === id);
        if (index === -1) {
            throw new Error('Usuario no encontrado');
        }

        await this.dataSource.manager.remove(this.usuarios[index]);
        this.usuarios.splice(index, 1);
        return true;
    }
}
