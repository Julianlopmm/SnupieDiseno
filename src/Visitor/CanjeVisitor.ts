import { Visitor } from './Visitor';
import { Solicitud } from '../entity/Solicitud';
import { Canjes } from '../entity/Canjes';
export class CanjeVisitor implements Visitor {

    visitSolicitud(solicitud: Solicitud) {
        if (solicitud.canje) {
            return solicitud;
        }
        return null;
    }
}