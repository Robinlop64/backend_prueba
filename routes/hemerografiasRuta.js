const express = require('express');
const multer = require('multer');
const path = require('path');
const Hemerografia = require('../models/hemerografia'); // Asegúrate de importar tu modelo Hemerografia
const HemerografiaControlador = require("../controllers/hemerografiaControlador")
const router = express.Router();

const almacenamiento = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./imagenes/hemerografia");
  },
  filename: async function(req, file, cb) {
    try {
      const hemerografia = await Hemerografia.findById(req.params.id); // Suponiendo que estás usando Mongoose para interactuar con MongoDB
      if (!hemerografia) {
        return cb(new Error('Hemerografia no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const nombreArchivo = `Hemerografia,${hemerografia.nombre_periodico},${hemerografia.encabezado}${extension}`;
      cb(null, nombreArchivo);
    } catch (error) {
      cb(error);
    }
  }
});
const subidas = multer({ storage: almacenamiento });


router.get('/prueba-hemerografia', HemerografiaControlador.pruebaHemerografia);
router.post("/registrar",HemerografiaControlador.registrarHemerografia)
router.post('/registrar-imagen/:id', [subidas.single("file0")], HemerografiaControlador.cargarFotografia);
router.delete('/borrar/:id', HemerografiaControlador.borrarHemerografia);
router.put('/editar/:id', HemerografiaControlador.editarHemerografia);
router.get('/listar-temas', HemerografiaControlador.obtenerTemasHemerografia);
router.get('/tema/:id', HemerografiaControlador.listarPorTema);
router.get('/hemero/:id', HemerografiaControlador.obtenerHemerografiaPorID);

module.exports = router;