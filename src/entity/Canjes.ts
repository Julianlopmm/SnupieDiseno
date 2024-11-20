import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from './Usuario';
import { Medicamento } from './Medicamento';
import { Farmacia } from './Farmacia';

@Entity()
export class Canjes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha: string;

    @ManyToOne(() => Medicamento)
    medicamento: Medicamento;

    @ManyToOne(() => Usuario)
    usuario: Usuario;

    @ManyToOne(() => Farmacia)
    farmacia: Farmacia;
}