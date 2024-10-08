const instituciones = require("../models/instituciones")
const validator = require("validator")
const fs = require("fs")

const pruebaInstituciones = (req, res) => {
    return res.status(200).send({
        message: "Mensaje de prueba enviado"
    });
}
const registrarInstituciones = async (req,res) =>{
    //Recojer parametros por post a guardar
    let parametros = req.body;

    try{
        const publicacion = new instituciones(parametros)
        const publicacionGuardada = await publicacion.save()
        return res.status(200).json({
            status : "successs",
            mensaje: "publicacion periodica guardada correctamente",
            publicacionGuardada
        })

    }catch(erro){
        return res.status(400).json({
            status : "error",
            mensaje: "Algo anda mal we",
            parametros
        })
    }
}
const cargarFotografia = async (req, res) => {
    console.log(req.files); // Para verificar que se están recibiendo múltiples archivos
    let archivos = req.files;

    // Validar extensiones de archivos
    for (let archivo of archivos) {
        let archivo_split = archivo.originalname.split(".");
        let extension = archivo_split[archivo_split.length - 1].toLowerCase();
        if (extension !== "png" && extension !== "jpg" && extension !== "jpeg" && extension !== "gif") {
            fs.unlink(archivo.path, (error) => {
                // Borrar todos los archivos en caso de error de validación
                for (let file of archivos) {
                    fs.unlink(file.path, () => {});
                }
                return res.status(500).json({
                    status: "error",
                    message: "Extensión de archivo no permitida",
                    extension
                });
            });
            return;
        }
    }

    // Si todas las extensiones son válidas, guardar los archivos y responder con éxito
    try {
        // Aquí puedes agregar lógica adicional para procesar las imágenes si es necesario

        return res.status(200).json({
            status: "success",
            archivos: req.files
        });
    } catch (error) {
        // Borrar todos los archivos en caso de error
        for (let file of archivos) {
            fs.unlink(file.path, () => {});
        }
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
            error
        });
    }
};
const borrarInstituciones = async (req, res) => {
    const id = req.params.id;

    try {
        let hemero = await instituciones.findOneAndDelete({ _id: id });

        if (!hemero) {
            return res.status(404).json({
                status: "error",
                message: "Hemerografía no encontrada",
                id
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Hemerografía borrada exitosamente"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al borrar la Hemerografía"
        });
    }
};
const editarInstituciones = async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;

    try {
        let hemero = await instituciones.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!hemero) {
            return res.status(404).json({
                status: "error",
                message: "Foto no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Foto actualizada exitosamente",
                hemero
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar la foto"
        });
    }
};
const obtenerTemasInstituciones = async (req, res) => {
    try {
        // Obtener temas y número de fotos por tema
        const temas = await instituciones.aggregate([
            {
                $group: {
                    _id: "$tema",
                    numeroDeFotos: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    tema: "$_id",
                    numeroDeFotos: 1
                }
            }
        ]);

        if (!temas.length) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron temas"
            });
        }

        // Obtener una foto aleatoria por cada tema y el valor del primer elemento en el campo nombre
        const temasConFotoYNombre = await Promise.all(temas.map(async tema => {
            const libroAleatorio = await instituciones.aggregate([
                { $match: { tema: tema.tema } },
                { $sample: { size: 1 } }
            ]);

            const nombreImagen = libroAleatorio[0]?.images?.length > 0 ? libroAleatorio[0].images[0].nombre : null;

            return {
                ...tema,
                fotoAleatoria: libroAleatorio[0] ? libroAleatorio[0].image : null, // Asumiendo que la URL de la foto se encuentra en el campo 'image'
                nombreImagen: nombreImagen
            };
        }));

        return res.status(200).json({
            status: "success",
            temas: temasConFotoYNombre
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los temas"
        });
    }
};
const listarPorTema = async (req, res) => {
    const tema = req.params.id;
    try {
        let fotos = await instituciones.find({ tema: tema }).sort({ numero_foto: 1 });

        if (!fotos || fotos.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron fotos para este tema"
            });
        } else {
            return res.status(200).send({
                status: "success",
                fotos
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener las fotos"
        });
    }
};
const listarPorPais = async (req, res) => {
    const pais = req.params.id;
    try {
        let insti = await instituciones.find({ pais: pais }).sort({ nombre: 1 });

        if (!insti || insti.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron instituciones para este país",
                pais
            });
        } else {
            return res.status(200).send({
                status: "success",
                insti
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener las instituciones3",
            pais:pais
        });
    }
};

const obtenerInstitucionesPorNombre = async (req, res) => {
    let nombreHemerografia = req.params.id;

    try {
        let hemero = await instituciones.findOne({ nombre: nombreHemerografia });

        if (!hemero) {
            return res.status(404).json({
                status: "error",
                message: "Hemerografía no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                hemero
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener la hemerografía"
        });
    }
};
const listarTodo = async (req, res) => {
    try {
        let inst = await instituciones.find().sort({ pais: 1, ciudad: 1, nombre: 1 });

        if (!inst || inst.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron inst",
            });
        }

        // Estructura del resultado
        const data = {};

        // Iterar sobre cada institución y construir el objeto data
        inst.forEach((inst) => {
            const { pais, ciudad, nombre } = inst;

            if (!data[pais]) {
                data[pais] = {};
            }

            if (!data[pais][ciudad]) {
                data[pais][ciudad] = [];
            }

            data[pais][ciudad].push(nombre);
        });

        return res.status(200).send({
            status: "success",
            data
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los datos",
            error: error.message
        });
    }
};

module.exports={
    pruebaInstituciones,
    registrarInstituciones,
    cargarFotografia,
    borrarInstituciones,
    editarInstituciones,
    obtenerTemasInstituciones,
    listarPorTema,
    listarPorPais,
    obtenerInstitucionesPorNombre,
    listarTodo
}

