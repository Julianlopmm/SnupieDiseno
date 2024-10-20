import { AppDataSource } from "./data-source"
import { Rol } from "./entity/Rol"
import { Usuario } from "./entity/Usuario"

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new Usuario()
    user.nombre = "Timber"
    user.contrasena = "Saw"
    user.rol = new Rol()
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(Usuario)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
