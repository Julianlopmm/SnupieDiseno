import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Rol } from './Rol';
import { Solicitud } from './Solicitud';
import { Farmacia } from './Farmacia';

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    contrasena: string;

    @ManyToOne (() => Rol )
    rol: Rol;

    @OneToMany(() => Solicitud, (solicitud) => solicitud.usuario)
    solicitudes: Solicitud[];

}
