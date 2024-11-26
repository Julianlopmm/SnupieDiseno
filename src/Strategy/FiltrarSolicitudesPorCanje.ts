import { IEstrategiaOrden } from "./IEstrategiaOrden";
import { CanjeVisitor } from "../Visitor/CanjeVisitor";
import { Solicitud } from "../entity/Solicitud";


export class FiltrarSolicitudesPorCanje implements IEstrategiaOrden {
  ordenar(solicitudes: any[]): any[] {
      const visitor = new CanjeVisitor();
      const solicitudesDeCanjes: Solicitud[] = [];
      
          for (const solicitud of solicitudes) {
            
              const solicitudCanje = visitor.visitSolicitud(solicitud);
  
              if (solicitudCanje) {
                solicitudesDeCanjes.push(solicitudCanje);
              }
          }
          return solicitudesDeCanjes;
    }
  }