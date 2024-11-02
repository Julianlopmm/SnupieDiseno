import "reflect-metadata"
import { DataSource } from "typeorm"
import { Usuario } from "./entity/Usuario"
import { Rol } from "./entity/Rol"
import { Farmacia } from "./entity/Farmacia"
import { Solicitud } from "./entity/Solicitud"
import { Estado } from "./entity/Estado"
import { Medicamento } from "./entity/Medicamento"
import { Presentacion } from "./entity/Presentacion"
import { Punto } from "./entity/Punto"
import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector'
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "db",
    port: 3306,
    username: "root",
    password: "secret",
    database: "snupie_db",
    synchronize: true,
    logging: false,
    entities: [Usuario, Rol, Farmacia, Solicitud, Estado, Medicamento, Presentacion, Punto],
    migrations: [],
    subscribers: [],
})