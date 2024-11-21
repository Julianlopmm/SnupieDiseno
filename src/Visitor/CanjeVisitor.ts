import { Visitor } from './Visitor';
import { Solicitud } from '../entity/Solicitud';

export class CanjeVisitor implements Visitor {
    visitSolicitud(solicitud: Solicitud) {
        if (solicitud.canje) {
            return solicitud;
        }
        return null;
    }
}