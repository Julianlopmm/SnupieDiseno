import { Visitor } from "./Visitor";
import { Solicitud } from "../entity/Solicitud";
import { Canjes } from "../entity/Canjes";
import { AppDataSource } from "../data-source";

export class ActualizarVisitor implements Visitor {
    dataSource = AppDataSource;
    canje: Canjes;
    constructor(canje: Canjes) {
      this.canje = canje;
    }
    visitSolicitud(solicitud: Solicitud) {
        solicitud.canje = this.canje;
        this.dataSource.manager.save(solicitud);
    }
  }