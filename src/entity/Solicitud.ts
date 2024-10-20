import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estado } from './Estado';
import { Usuario } from './Usuario';
import { Medicamento } from './Medicamento';

@Entity()
export class Solicitud {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cantidad: number;

    @Column()
    fecha: Date;

    @ManyToOne(() => Estado)
    estado: Estado;

    @ManyToOne(() => Usuario, (usuario) => usuario.solicitudes)
    usuario: Usuario;

    @ManyToOne(() => Medicamento, (medicamento) => medicamento.solicitudes)
    medicamento: Medicamento;
}
