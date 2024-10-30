import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Medicamento } from './Medicamento';
import { Usuario  } from './Usuario';

@Entity()
export class Punto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cantidad: number;

    @ManyToOne(() => Medicamento)
    medicamento: Medicamento;

    @Column()
    usuario: Usuario;

}
