// src/Strategy/OrdenCronologicoDescendente.ts
import { IEstrategiaOrden } from "./IEstrategiaOrden";

export class OrdenCronologicoDescendente implements IEstrategiaOrden {
    ordenar(solicitudes: any[]): any[] {
        return solicitudes.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      }
}
