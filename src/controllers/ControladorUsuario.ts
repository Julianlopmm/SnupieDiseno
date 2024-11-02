import { Usuario } from "../entity/Usuario";
import { Rol } from "../entity/Rol";
import { AppDataSource } from "../data-source";
import { ListaSingleton } from "../ListaSingleton";

interface UsuarioRequest {
    nombre: string;
    contrasena: string;
    rol: number;
    email: string;
}

export class ControladorUsuario {
    private ListaSingleton = ListaSingleton.getInstance(); // Obtén la instancia única

    private roles: Rol[] = [];
    
    constructor(private dataSource = AppDataSource) {
        this.init();
    }
    
    async init() {
        await this.crearRolesPredeterminados();
        await this.actualizarUsuarios();
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

    

    async actualizarUsuarios() {
        const usuarios = await this.dataSource.manager.find(Usuario, { relations: ["rol"] });
        this.ListaSingleton.setUsuarios(usuarios); // Usa la instancia global
        return usuarios;
    }

    async obtenerUsuarios() {
        return this.ListaSingleton.getUsuarios(); // Usa la instancia global
    }
    

    async imprimirUsuarios() {
        const usuarios = this.ListaSingleton.getUsuarios(); // Usa la instancia global
        if (usuarios.length === 0) {
            console.log('No hay usuarios');
        }
        usuarios.forEach(usuario => {
            console.log(usuario);
            console.log("\n");
        });

        return usuarios;
    }

    async obtenerUsuarioPorId(id: number) {
        let usuario = this.ListaSingleton.getUsuarios().find(usuario => usuario.id === id);
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
    
        const roleEntity = await this.dataSource.manager.findOne(Rol, { where: { id: req.rol } });
        if (!roleEntity) {
            throw new Error("Role not found");
        }
    
        usuario.rol = roleEntity;
    
        try {
            const savedUsuario = await this.dataSource.manager.save(usuario);
            this.ListaSingleton.agregarUsuario(savedUsuario); // Usa la instancia global
            return savedUsuario;
        } catch (error) {
            console.error("Error creating user:", error);
            // Agrega más información para depurar
            if (error.code) {
                console.error("Código de error:", error.code);
            }
            if (error.detail) {
                console.error("Detalle de error:", error.detail);
            }
            throw new Error("Error al guardar el usuario en la base de datos");
        }
    }
    

    async login(req: { email: string, contrasena: string }) {
        const usuario = await this.dataSource.manager.findOne(Usuario, { where: { email: req.email, contrasena: req.contrasena }, relations: ["rol"] });
        if (!usuario) {
            throw new Error("User not found");
        }
        return usuario;
    }

}
