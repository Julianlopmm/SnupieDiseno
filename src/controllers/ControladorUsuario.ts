import { Usuario } from "../entity/Usuario";
import { Rol } from "../entity/Rol";
import { AppDataSource } from "../data-source";

export class ControladorUsuario{
    
        constructor(private usuarios: Usuario[]){}
        dataSource = AppDataSource;
    
        async obtenerUsuarios(){
            this.dataSource.manager.find(Usuario).then((usuarios) => {
                this.usuarios = usuarios;
            });
        }
    
        async obtenerUsuarioPorId(id: number){
            return this.usuarios.find(usuario => usuario.id === id);
        }
    
        async crearUsuario(usuario: Usuario){
            this.usuarios.push(usuario);
            return usuario;
        }
    
        async actualizarUsuario(id: number, usuario: Usuario){
            const index = this.usuarios.findIndex(usuario => usuario.id === id);
            if(index === -1){
                throw new Error('Usuario no encontrado');
            }
            this.usuarios[index] = usuario;
            return usuario;
        }
    
        async eliminarUsuario(id: number){
            const index = this.usuarios.findIndex(usuario => usuario.id === id);
            if(index === -1){
                throw new Error('Usuario no encontrado');
            }
            this.usuarios.splice(index, 1);
            return true;
        }
    
    }