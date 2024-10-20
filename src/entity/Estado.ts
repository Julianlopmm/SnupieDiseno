import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Solicitud } from './Solicitud';

@Entity()
export class Estado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

}
