// src/models/Recording.js
const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Referencia a la colección `users`
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
  },
  {
    timestamps: true,  // Añade automáticamente `createdAt` y `updatedAt`
  }
);

module.exports = mongoose.model('Recording', recordingSchema);