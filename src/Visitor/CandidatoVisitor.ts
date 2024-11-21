import { Visitor } from "./Visitor";
import { Solicitud } from "../entity/Solicitud";
import { AppDataSource } from "../data-source";
import { Estado } from "../entity/Estado";
import { Usuario } from "../entity/Usuario";

export class CandidatoVisitor implements Visitor {
    dataSource = AppDataSource;
    
    async visitSolicitud(solicitud: Solicitud) : Promise<Solicitud> {
        const estado = await this.dataSource.manager.findOne(Estado, {where: {nombre: "Aceptada"}});
        console.log(solicitud)
        if (solicitud.estadoSolicitud === estado) {
            return solicitud
        }
        return null;
    }
}