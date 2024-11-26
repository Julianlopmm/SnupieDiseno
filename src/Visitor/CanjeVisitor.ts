import { Visitor } from './Visitor';
import { Solicitud } from '../entity/Solicitud';
import { Canjes } from '../entity/Canjes';
export class CanjeVisitor implements Visitor {
    canje : Canjes
    constructor(canje: Canjes) {
        this.canje = canje;
    }
    visitSolicitud(solicitud: Solicitud) {
        if (solicitud.canje.id === this.canje.id) {
            return solicitud;
        }
        return null;
    }
}