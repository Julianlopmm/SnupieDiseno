import { Usuario } from "../entity/Usuario";
import { Rol } from "../entity/Rol";
import { AppDataSource } from "../data-source";

interface UsuarioRequest {
    nombre: string;
    contrasena: string;
    rol: number;
    email: string;
}

export class ControladorUsuario {
    private usuarios: Usuario[] = [];

    private roles: Rol[] = [];
    
    constructor(private dataSource = AppDataSource) {
        this.init();
    }
    
    async init() {
        await this.crearRolesPredeterminados();
        await this.obtenerUsuarios();
        this.imprimirUsuarios();
    }

    async crearRolesPredeterminados() {
        const rolesPredeterminados = [
            { nombre: "Admin" },
            { nombre: "Operativo" },
            { nombre: "Cliente" }
        ];

        for (const rolData of rolesPredeterminados) {
            const rolExistente = await this.dataSource.manager.findOne(Rol, { where: { nombre: rolData.nombre } });
            if (!rolExistente) {
                const rol = new Rol();
                rol.nombre = rolData.nombre;
                await this.dataSource.manager.save(rol);
                console.log(`Rol creado: ${rol.nombre}`);
            } else {
                console.log(`Rol ya existe: ${rolData.nombre}`);
            }
        }
    }

    

    async obtenerUsuarios() {
        this.usuarios = await this.dataSource.manager.find(Usuario, { relations: ["rol"] });
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

    async crearUsuario(req: UsuarioRequest) {
        if (!req.nombre || !req.contrasena || !req.rol || !req.email) {
            throw new Error("Invalid user data");
        }
    
        const usuario = new Usuario();
        usuario.nombre = req.nombre;
        usuario.contrasena = req.contrasena;
        usuario.email = req.email;
        
        // Fetch the role entity based on ID
        const roleEntity = await this.dataSource.manager.findOne(Rol, { where: { id: req.rol } });
        if (!roleEntity) {
            throw new Error("Role not found");
        }
        
        usuario.rol = roleEntity;
    
        try {
            const savedUsuario = await this.dataSource.manager.save(usuario);
            this.usuarios.push(savedUsuario);
            return savedUsuario;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

}
