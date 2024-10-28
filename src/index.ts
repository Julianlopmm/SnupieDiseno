import { AppDataSource } from "./data-source";
import { ControladorMedicamentos } from "./controllers/ControladorMedicamentos";
import { ControladorSolicitudes } from "./controllers/ControladorSolicitudes";
import { ControladorUsuario } from "./controllers/ControladorUsuario";
import express from 'express';

AppDataSource.initialize()
  .then(async () => {
    const controladorUsuario = new ControladorUsuario();
    const controladorMedicamentos = new ControladorMedicamentos();
    const controladorSolicitudes = new ControladorSolicitudes();

    const app = express();
    app.use(express.json());

    app.get('/', (req, res) => {
      res.send('¡Hola mundo!');
    });

    // Ruta para obtener usuarios, haciendo uso de async/await
    app.get('/usuarios', async (req, res) => {
      try {
        const usuarios = await controladorUsuario.obtenerUsuarios();
        res.json(usuarios);
      } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
      }
    });

    // Iniciar el servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch((error) => console.log("Error al iniciar la base de datos:", error));
