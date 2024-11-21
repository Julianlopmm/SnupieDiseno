import { IEstrategiaOrden } from "./IEstrategiaOrden";

export class FiltrarSolicitudesConCanje implements IEstrategiaOrden {
  ordenar(solicitudes: any[]): any[] {
    return solicitudes.filter((solicitud) => solicitud.canje !== null);
  }
}