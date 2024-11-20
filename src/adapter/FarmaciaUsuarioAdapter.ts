import { Farmacia } from '../entity/Farmacia';
import { Rol } from '../entity/Rol';
import { IUsuarioAdapter } from './IUsuarioAdapter';

export class FarmaciaUsuarioAdapter implements IUsuarioAdapter {
    id: number;
    nombre: string;
    email: string;
    contrasena: string;
    rol: Rol;
    farmacia: Farmacia;

    constructor(farmacia: Farmacia, rol: Rol, contrasena: string, id : number) {
        this.id = id;
        this.nombre = farmacia.nombre;
        this.email = farmacia.email;
        this.contrasena = contrasena; // Contraseña puede ser generada o recibida
        this.rol = rol; // Rol asignado a la farmacia como usuario
        this.farmacia = farmacia;
    }
}
