// src/models/Recording.js
const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Para almacenar un identificador unico. Permite establecer relaciones entre colecciones
      ref: 'User',  // Referencia a la colección `users`. El valor de userId debe ser un ObjectId que exista en la colección users.
      required: true,
    },
    streamUrl: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,  // Duración en segundos (opcional)
    },
    isFavorite: {
      type: Boolean,
      default: false,  // Valor por defecto para indicar que no es favorito
    },
  },
  {
    timestamps: true,  // Añade automáticamente `createdAt` y `updatedAt`
  }
);

module.exports = mongoose.model('Recording', recordingSchema);