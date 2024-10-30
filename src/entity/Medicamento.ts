import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Presentacion } from './Presentacion';
import { Solicitud } from './Solicitud';
import { Estado } from './Estado';

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
    precio: number;

    @Column()
    puntosPorCompra: number;

    @Column()
    puntosParaCanje : number;

    @Column()
    urlImagen: string;

    @Column(() => Estado)
    estadoPromocion : boolean;

    @OneToMany(() => Solicitud, (solicitud) => solicitud.medicamento)
    solicitudes: Solicitud[];
}
