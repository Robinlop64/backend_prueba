const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
const path = require('path');
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

connection();

// Crear servidor node
const app = express();
const puerto = process.env.PORT || 3900;

// Configurar CORS
app.use(cors({
    origin: "*", // Permitir todos los orígenes, puedes restringir esto según sea necesario
}));

// Convertir datos del body a JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

// Importar rutas
const FotoRoutes = require('./routes/fotoRuta');
const userRoutes = require("./routes/userRuta");
const HemerografiaRoutes = require("./routes/hemerografiasRuta")
const IconografiafiaRoutes = require("./routes/iconografiaRuta")
const LibrosRoutes = require("./routes/libroRuta")
const CorrespondenciaRoutes = require("./routes/correspondenciaRuta")
const DocumentacionRoutes = require("./routes/documentacionRuta")
const PartiturasRoutes = require("./routes/partiturasRuta")
const ObjetosRoutes = require("./routes/objetosRuta")
const MonumentosRoutes = require("./routes/monumentosRuta")
const InstitucionesRoutes = require("./routes/institucionesRuta")
const PeriodicosRoutes = require("./routes/periodicosRuta")

// Middleware para usar las rutas

app.use("/api/periodicos", PeriodicosRoutes)
app.use("/api/instituciones", InstitucionesRoutes)
app.use("/api/documentacion", DocumentacionRoutes)
app.use("/api/monumentos", MonumentosRoutes)
app.use("/api/objetos", ObjetosRoutes)
app.use("/api/partituras", PartiturasRoutes)
app.use("/api/correspondencia", CorrespondenciaRoutes)
app.use("/api/libros", LibrosRoutes)
app.use("/api/iconografia", IconografiafiaRoutes)
app.use("/api/hemerografia", HemerografiaRoutes)
app.use('/api/fotografia', FotoRoutes);
app.use("/api/user", userRoutes);


// Arrancar el servidor
app.listen(puerto, () => {
    console.log("Servidor de node corriendo en el puerto:", puerto);
});