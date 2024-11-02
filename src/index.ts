import { AppDataSource } from "./data-source";
import { ControladorMedicamentos } from "./controllers/ControladorMedicamentos";
import { ControladorSolicitudes } from "./controllers/ControladorSolicitudes";
import { ControladorUsuario } from "./controllers/ControladorUsuario";
import { ControladorFarmacias } from "./controllers/ControladorFarmacias";
import { ListaSingleton } from "./ListaSingleton";
import express from 'express';

AppDataSource.initialize()
  .then(async () => {
    const controladorFarmacias = new ControladorFarmacias();
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

    app.get('/imprimir', async (req, res) => {
      try {
        const usuarios = await controladorUsuario.imprimirUsuarios();
        res.json(usuarios);
      } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
      }
    });



    app.get('/usuarios/login', async (req, res) => {
      try {
        const usuario = await controladorUsuario.login(req.body);
        res.json(usuario);
      } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario", error: error.message });
      }
    });

    app.post('/usuarios', async (req, res) => {
      try {
        const nuevoUsuario = await controladorUsuario.crearUsuario(req.body);
        res.json(nuevoUsuario);
      } catch (error) {
        res.status(500).json({ message: "Error al crear usuario", error: error.message });
      }
    });


    // MEDICAMENTOS


    app.post('/medicamentos', async (req, res) => {
      try {
        const nuevoMedicamento = await controladorMedicamentos.crearMedicamento(req.body);
        res.status(201).json(nuevoMedicamento); // 201 Created
      } catch (error) {
        res.status(500).json({ message: "Error al crear medicamento", error: error.message });
      }
    });
    

    app.get('/medicamentos', async (req, res) => {
      try {
        const medicamentos = await controladorMedicamentos.obtenerMedicamentos();
        res.json(medicamentos);
      } catch (error) {
        res.status(500).json({ message: "Error al obtener medicamentos", error: error.message });
      }
    });

    app.get('/medicamentos/:id', async (req, res) => {
      try {
        const medicamento = await controladorMedicamentos.obtenerMedicamentoPorId(parseInt(req.params.id));
        res.json(medicamento);
      } catch (error) {
        res.status(500).json({ message: "Error al obtener medicamento", error: error.message });
      }
    });

    app.put('/medicamentos/:id', async (req, res) => {
      try {
        const medicamentoActualizado = await controladorMedicamentos.configurarMedicamento(
          parseInt(req.params.id),
          req.body
        );
        res.json(medicamentoActualizado);
      } catch (error) {
        res.status(500).json({ message: "Error al configurar medicamento", error: error.message });
      }
    });
    

    app.post('/solicitud', async (req, res) => {
      try {
        const nuevaSolicitud = await controladorSolicitudes.crearSolicitud(req.body);
        res.json(nuevaSolicitud);
      } catch (error) {
        res.status(500).json({ message: "Error al crear solicitud", error: error.message });
      }
    })

    app.put('/solicitud/aprobar/:id', async (req, res) => {
      try {
        const solicitud = await controladorSolicitudes.aceptarSolicitud(parseInt(req.params.id));
        res.json(solicitud);
      } catch (error) {
        res.status(500).json({ message: "Error al aceptar solicitud", error: error.message });
      }
    });

    app.put('/solicitud/rechazar/:id', async (req, res) => {
      try {
        const solicitud = await controladorSolicitudes.rechazarSolicitud(parseInt(req.params.id));
        res.json(solicitud);
      } catch (error) {
        res.status(500).json({ message: "Error al rechazar solicitud", error: error.message });
      }
    });

    app.get('/solicitudes/pendientes', async (req, res) => {
      try {
        const solicitudes = await controladorSolicitudes.obtenerSolicitudesPendientes();
        res.json(solicitudes);
      } catch (error) {
        res.status(500).json({ message: "Error al obtener solicitudes", error: error.message });
      }
    })

    // FARMACIAS

    app.post('/farmacias', async (req, res) => {
      try {
        const nuevaFarmacia = await controladorFarmacias.crearFarmacia(req.body);
        res.json(nuevaFarmacia);
      } catch (error) {
        res.status(500).json({ message: "Error al crear farmacia", error: error.message });
      }
    });

    // Iniciar el servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch((error) => console.log("Error al iniciar la base de datos:", error));
