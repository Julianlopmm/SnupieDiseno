import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Medicamento } from './Medicamento';
import { Usuario  } from './Usuario';

@Entity()
export class Punto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    puntosAcumulados: number;

    @Column()
    puntosDisponibles: number;

    @Column()
    puntosCanjeados: number;
    
    @ManyToOne(() => Medicamento)
    medicamento: Medicamento;

    @ManyToOne (() => Usuario )
    usuario: Usuario;

}
