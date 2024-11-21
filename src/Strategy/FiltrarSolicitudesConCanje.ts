import { IEstrategiaOrden } from "./IEstrategiaOrden";
import { CanjeVisitor } from "../Visitor/CanjeVisitor";

export class FiltrarSolicitudesConCanje implements IEstrategiaOrden {
  ordenar(solicitudes: any[]): any[] {
    const visitor = new CanjeVisitor();
    return solicitudes.filter((solicitud) => visitor.visitSolicitud(solicitud));
    
    
  }
}