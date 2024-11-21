import { Solicitud } from '../entity/Solicitud';

export interface Visitor {
    visitSolicitud(solicitud: Solicitud);
  }