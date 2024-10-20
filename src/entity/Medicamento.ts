import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Presentacion } from './Presentacion';
import { Solicitud } from './Solicitud';

@Entity()
export class Medicamento {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @ManyToOne(() => Presentacion)
    presentacion: Presentacion;

    @Column()
    precioUnitario: number;

    @Column()
    urlImagen: string;

    @OneToMany(() => Solicitud, (solicitud) => solicitud.medicamento)
    solicitudes: Solicitud[];
}
