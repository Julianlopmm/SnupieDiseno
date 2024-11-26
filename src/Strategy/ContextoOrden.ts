
import { IEstrategiaOrden } from "./IEstrategiaOrden";

export class ContextoOrden {
  private estrategia: IEstrategiaOrden;

  constructor(estrategia: IEstrategiaOrden) {
    this.estrategia = estrategia;
  }

  setEstrategia(estrategia: IEstrategiaOrden) {
    this.estrategia = estrategia;
  }

  ordenarSolicitudes(solicitudes: any): any {
    return this.estrategia.ordenar(solicitudes);
}
}