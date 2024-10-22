import { AppDataSource } from "./data-source";
import { Rol } from "./entity/Rol";
import { Usuario } from "./entity/Usuario";

AppDataSource.initialize()
  .then(async () => {
    // Creo los roles y los guardo en la bd
    let roles: Array<Rol>;

    const rol1 = new Rol();
    rol1.nombre = "Admin";

    const rol2 = new Rol();
    rol2.nombre = "Operativo";

    // Guardo los roles en la bd
    await AppDataSource.manager.save(rol1);
    await AppDataSource.manager.save(rol2);

    // Cargo el array desde la base
    roles = await AppDataSource.manager.find(Rol);

    // Aqui reviso si se cargaron porque si no se buguea
    if (roles.length > 0) {
      console.log("Roles cargados correctamente:");

      // Imprimo los roles cargados
      for (let rol of roles) {
        console.log("Rol cargado: ", rol);
      }

      // Hago la misma vara con los usuarios
      let usuarios: Array<Usuario>;

      const user1 = new Usuario();
      user1.nombre = "John";
      user1.contrasena = "1234";
      user1.rol = roles.find((rol) => rol.nombre === "Admin");

      const user2 = new Usuario();
      user2.nombre = "Doe";
      user2.contrasena = "1234";
      user2.rol = roles.find((rol) => rol.nombre === "Operativo");

      // Guardo los usuarios en la bd
      await AppDataSource.manager.save(user1);
      await AppDataSource.manager.save(user2);

      // Cargo el array desde la base
      usuarios = await AppDataSource.manager.find(Usuario);

      // Imprimo los usuarios cargados
      console.log("\nUsuarios cargados:");
      for (let usuario of usuarios) {
        console.log("Usuario cargado: ", usuario);
      }

      // Buscar el usuario con ID 1 sin modificar
      console.log("\nUsuario sin modificar:");
      let userBuscar = await AppDataSource.manager.find(Usuario, {
        where: { id: 1 },
      });
      console.log(userBuscar);

      // Aqui esta lo saico, cambio el usuario en el array, lo mando a guardar y la vara
      // modifica el que ya existe en la base de datos
      let user = usuarios.find((usuario) => usuario.id === 1);

      if (user) {
        user.nombre = "Winchis"; // Modificar el nombre del usuario
        await AppDataSource.manager.save(user); // Guardar el cambio
      }

      // Imprimo los usuarios modificados en el array
      console.log("\nUsuarios modificados:");
      for (let usuario of usuarios) {
        console.log("Usuario cargado: ", usuario);
      }

      // Buscar el usuario modificado en la base de datos
      console.log("\nUsuario modificado:");
      userBuscar = await AppDataSource.manager.find(Usuario, {
        where: { id: 1 },
      });
      console.log(userBuscar);

      return;
    } else {
      console.log("Error: No se pudieron cargar los roles.");
    }
  })
  .catch((error) => console.log(error));
