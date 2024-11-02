import { Usuario } from './entity/Usuario';

export class ListaSingleton {
    private static instance: ListaSingleton;
    private usuarios: Usuario[] = [];

    private constructor() {}

    public static getInstance(): ListaSingleton {
        if (!ListaSingleton.instance) {
            ListaSingleton.instance = new ListaSingleton();
        }
        return ListaSingleton.instance;
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