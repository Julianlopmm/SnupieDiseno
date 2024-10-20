import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Presentacion } from './Presentacion';

@Entity()
export class Punto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cantidad: number;

    @ManyToOne(() => Presentacion)
    presentacion: Presentacion;

    @Column()
    valorPunto: number;
}
