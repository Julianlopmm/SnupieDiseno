import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Rol } from './Rol';
import { Solicitud } from './Solicitud';
import { Punto } from './Punto';

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    email: string;

    @Column()
    contrasena: string;


    @ManyToOne (() => Rol )
    rol: Rol;

    @OneToMany(() => Solicitud, (solicitud) => solicitud.usuario)
    solicitudes: Solicitud[];

}
