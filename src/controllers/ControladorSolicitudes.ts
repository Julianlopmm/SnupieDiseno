import { Solicitud } from "../entity/Solicitud";
import { AppDataSource } from "../data-source";

export class ControladorSolicitudes{
    
        constructor(private solicitudes: Solicitud[]){}
        dataSource = AppDataSource;
    
        async obtenerSolicitudes(){
            this.dataSource.manager.find(Solicitud).then((solicitudes) => {
                this.solicitudes = solicitudes;
            });
        }
    
        async obtenerSolicitudPorId(id: number){
            return this.solicitudes.find(solicitud => solicitud.id === id);
        }
    
        async crearSolicitud(solicitud: Solicitud){
            this.solicitudes.push(solicitud);
            return solicitud;
        }
    
        async actualizarSolicitud(id: number, solicitud: Solicitud){
            const index = this.solicitudes.findIndex(solicitud => solicitud.id === id);
            if(index === -1){
                throw new Error('Solicitud no encontrada');
            }
            this.solicitudes[index] = solicitud;
            return solicitud;
        }
    
        async eliminarSolicitud(id: number){
            const index = this.solicitudes.findIndex(solicitud => solicitud.id === id);
            if(index === -1){
                throw new Error('Solicitud no encontrada');
            }
            this.solicitudes.splice(index, 1);
            return true;
        }
    
    }