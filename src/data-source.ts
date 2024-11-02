import "reflect-metadata";
import { DataSource } from "typeorm";
import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import { Usuario } from "./entity/Usuario";
import { Rol } from "./entity/Rol";
import { Farmacia } from "./entity/Farmacia";
import { Solicitud } from "./entity/Solicitud";
import { Estado } from "./entity/Estado";
import { Medicamento } from "./entity/Medicamento";
import { Presentacion } from "./entity/Presentacion";
import { Punto } from "./entity/Punto";

// Asegúrate de que estas variables de entorno estén configuradas en Google Cloud Run o en tu entorno local
const instanceConnectionName = process.env.INSTANCE_CONNECTION_NAME!;
const dbUser = process.env.DB_USER!;
const dbPassword = process.env.DB_PASSWORD!;
const dbName = process.env.DB_NAME!;

const connector = new Connector();

export const AppDataSource = new DataSource({
    type: "mysql",
    username: dbUser,
    password: dbPassword,
    database: dbName,
    synchronize: true,
    logging: false,
    entities: [Usuario, Rol, Farmacia, Solicitud, Estado, Medicamento, Presentacion, Punto],
    migrations: [],
    subscribers: [],
    extra: {
        connectorPackage: '@google-cloud/cloud-sql-connector',
        socketPath: `/cloudsql/${instanceConnectionName}`,
    },
});