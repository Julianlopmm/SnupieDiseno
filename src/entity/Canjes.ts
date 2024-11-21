import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';
import { Medicamento } from './Medicamento';
import { Farmacia } from './Farmacia';
import { Solicitud } from './Solicitud';

@Entity()
export class Canjes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha: Date;

    @ManyToOne(() => Medicamento)
    medicamento: Medicamento;

    @ManyToOne(() => Usuario)
    usuario: Usuario;

    @ManyToOne(() => Farmacia)
    farmacia: Farmacia;

    @OneToMany(() => Solicitud, solicitud => solicitud.canje)
    solicitudes: Solicitud[];
}