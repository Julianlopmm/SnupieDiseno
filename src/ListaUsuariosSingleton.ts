import { Usuario } from './entity/Usuario';

export class ListaUsuariosSingleton {
    private static instance: ListaUsuariosSingleton;
    private usuarios: Usuario[] = [];

    private constructor() {}

    public static getInstance(): ListaUsuariosSingleton {
        if (!ListaUsuariosSingleton.instance) {
            ListaUsuariosSingleton.instance = new ListaUsuariosSingleton();
        }
        return ListaUsuariosSingleton.instance;
    }

    public getUsuarios(): Usuario[] {
        return this.usuarios;
    }

    public setUsuarios(usuarios: Usuario[]): void {
        this.usuarios = usuarios;
    }

    public agregarUsuario(usuario: Usuario): void {
        this.usuarios.push(usuario);
    }
}