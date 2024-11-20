import { IEstrategiaOrden } from "./IEstrategiaOrden";

export class OrdenCronologicoAscendente implements IEstrategiaOrden {
    ordenar(solicitudes: any[]): any[] {
        return solicitudes.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      }
}
