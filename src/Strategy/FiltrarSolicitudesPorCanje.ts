import { IEstrategiaOrden } from "./IEstrategiaOrden";
import { CanjeVisitor } from "../Visitor/CanjeVisitor";
import { Solicitud } from "../entity/Solicitud";
import { Canjes } from "../entity/Canjes";

export class FiltrarSolicitudesPorCanje implements IEstrategiaOrden {
  ordenar(canje: Canjes): any {
    const visitor = new CanjeVisitor(canje);
    const solicitudes = canje.solicitudes;
    const solicitudesCanje: Solicitud[] = [];
    solicitudes.forEach((solicitud) => {
      const solicitudCanje = visitor.visitSolicitud(solicitud);
      if (solicitudCanje) {
        solicitudesCanje.push(solicitudCanje);
      }
    });
    return solicitudesCanje;
  }
}