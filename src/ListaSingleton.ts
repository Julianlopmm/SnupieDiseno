import { Usuario } from './entity/Usuario';
import { Medicamento } from './entity/Medicamento';
import { Farmacia } from './entity/Farmacia';
import { FarmaciaUsuarioAdapter } from './adapter/FarmaciaUsuarioAdapter';


export class ListaSingleton {
    private static instance: ListaSingleton;
    private usuarios: Usuario[] = [];
    private medicamentos: Medicamento[] = [];
    private farmacias: Farmacia[] = [];
    private farmaciaUsuarios: FarmaciaUsuarioAdapter[] = [];

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

    public getMedicamentos(): Medicamento[] {
        return this.medicamentos;
    }

    public setMedicamentos(medicamentos: Medicamento[]): void {
        this.medicamentos = medicamentos;
    }

    public agregarMedicamento(medicamento: Medicamento): void {
        this.medicamentos.push(medicamento);
    }

    public getFarmacias(): Farmacia[] {
        return this.farmacias;
    }

    public setFarmacias(farmacias: Farmacia[]): void {
        this.farmacias = farmacias;
    }

    public agregarFarmacia(farmacia: Farmacia): void {
        this.farmacias.push(farmacia);
    }

    public getFarmaciaUsuarios(): FarmaciaUsuarioAdapter[] {
        return this.farmaciaUsuarios;
    }

    public agregarFarmaciaUsuario(farmaciaUsuario: FarmaciaUsuarioAdapter): void {
        this.farmaciaUsuarios.push(farmaciaUsuario);
    }
}