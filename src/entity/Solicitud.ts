import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estado } from './Estado';
import { Usuario } from './Usuario';
import { Medicamento } from './Medicamento';
import { Farmacia } from './Farmacia';

@Entity()
export class Solicitud {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    numSolicitud: string;

    @Column()
    fecha: Date;

    @ManyToOne(() => Medicamento, (medicamento) => medicamento.solicitudes)
    medicamento: Medicamento;

    @Column()
    cantidad: number;

    @ManyToOne(() => Farmacia)
    farmacia: Farmacia;

    @ManyToOne(() => Estado)
    estadoSolicitud: Estado;

    @ManyToOne(() => Usuario, (usuario) => usuario.solicitudes)
    usuario: Usuario;

    @Column()
    urlImagen: string;

    @Column()
    numeroCanje: number;

}    
