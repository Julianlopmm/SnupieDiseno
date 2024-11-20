import { Rol } from '../entity/Rol';

export interface IUsuarioAdapter {
    id: number;
    nombre: string;
    email: string;
    contrasena: string;
    rol: Rol;
}
