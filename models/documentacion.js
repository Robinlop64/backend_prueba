const { Schema, model } = require("mongoose");
const DocumentacionSchema = new Schema({
    titulo: {
        type: String,
        required: true,
    },
    autor: {
        type: String,
    },
    images: [ // Cambiado a un array de objetos con propiedades 'nombre' y 'fileId'
        {
          nombre: {
            type: String,
            required: true,
          },
          fileId: {
            type: String,
            required: true,
          }
        }
      ],
    pais: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    institucion: {
        type: String,
    },
    ubicacion_fisica: {
        type: String,
    },
    fecha: {
        type: Date,
    },
    fecha_adquisicion: {
        type: Number,
    },
    coleccion: {
        type: String,
    },
    tipo_bien: {
        type: String,
        default: "Documentación"
    },
    hallazgo: {
        type: String,
        default: "No"
    },
    persona_registra: {
        type: String,
    },
    tema: {
        type: String,
    },
    numero_registro: {
        type: Number,
    },
    // Campos adicionales
    tipo_documento: {
        type: String,
    },
    institucion_emisor: {
        type: String,
    },
    emisor: {
        type: String,
    },
    destinatario: {
        type: String,
    },
    fecha_emision: {
        type: Date,
    },
    lugar_emision: {
        type: String,
    },
    proposito: {
        type: String,
    },
    vigencia: {
        type: Date,
    },
    transcripcion: {
        type: String,
    },
    numero_expediente: {
        type: Number,
    },
    notas_relevantes: {
        type: String,
    },
    documento: {
        type: String,
    },
    contenido: {
        type: String,
    },
    pendientes: {
        type: String,
    },
    pdfs: [ // Cambiado a un array de objetos con propiedades 'nombre' y 'fileId'
        {
          nombre: {
            type: String,
            required: true,
          },
          ruta: {
            type: String,
            required: true,
          }
        }
      ],
      mostrar: {
        type: String,
      },
      editar: {
        type: String,
      },
      revisado: {
        type: String,
      },
});

module.exports = model("Documentacion", DocumentacionSchema, "documentacion");
