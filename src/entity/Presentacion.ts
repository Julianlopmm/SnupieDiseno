import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Medicamento } from './Medicamento';

@Entity()
export class Presentacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;


}
