const express = require('express');
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const authenticate = require('../utils/authenticate');
const User = require('../models/User');
const saveRecording = require('../utils/saveRecording');
const Recording = require('../models/Recording');
const recordings = {}; 

const router = express.Router();

const nmsRtmpUri = process.env.NMS_RTMP_URI;


router.post('/start-recording', async (req, res) => {
    const { username, streamName, filename } = req.body;
    
    if (!username || !streamName || !filename) {
      return res.status(400).json({ error: "Faltan parámetros" });
    }
  
    try {
      // Buscar al usuario por el username
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      
      const userId = user._id;
      const streamUrl = `${nmsRtmpUri}/live/${streamName}`;
      const userFolder = path.join(__dirname, "..", "recordings", username);
      const filePath = path.join(userFolder, `${filename}.mp4`);
  
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }
  
      const command = ffmpeg(streamUrl)
      .output(filePath)
      .format("mp4")
      .videoCodec("copy")
      .audioCodec("aac")
      .on("start", (commandLine) => {
        console.log(`Iniciando grabación con el comando: ${commandLine}`);
      })
      .on("end", () => {
        console.log(`✅ Grabación terminada: ${filePath}`);
        saveRecording(userId, streamUrl, filePath);
      })
      .on("error", (err) => {
        if (err.message.includes("255")) {
          console.log(`⏹️ Grabación detenida manualmente: ${filePath}`);
          saveRecording(userId, streamUrl, filePath);
        } else {
          console.error("❌ Error en la grabación:", err);
        }
      });

    command.run();
  
      // Guardamos el proceso para poder detenerlo después
      recordings[streamName] = command;
    
      res.json({ message: "Grabación iniciada", filePath });
    } catch (err) {
      console.error("Error al buscar el usuario:", err);
      res.status(500).json({ error: "Error en el servidor" });
    }
  });

router.post('/stop-recording', authenticate, (req, res) => {
    const { streamName } = req.body;
    if (!streamName || !recordings[streamName]) {
        return res.status(400).json({ error: "Grabación no encontrada" });
      }
    
      // Detener el proceso de grabación
      recordings[streamName].kill("SIGINT"); // Detenemos el proceso de FFmpeg
      delete recordings[streamName];
    
      console.log(`⏹️ Grabación detenida para ${streamName}`);
      res.json({ message: "Grabación detenida" });
  });

  // Obtener todas las grabaciones del usuario
  router.get('/recordings', authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const recordings = await Recording.find({ userId });
      res.json(recordings);
    } catch (err) {
      console.error('Error al obtener grabaciones:', err);
      res.status(500).json({ error: 'Error al obtener las grabaciones' });
    }
  });

  // Eliminar una grabación específica
  router.delete('/recordings/:id', authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const recordingId = req.params.id;

      const recording = await Recording.findOne({ _id: recordingId, userId });
      
      if (!recording) {
        return res.status(404).json({ error: 'Grabación no encontrada' });
      }

      // Eliminar el archivo físico
      fs.unlink(recording.filePath, async (err) => {
        if (err) {
          console.error('Error al eliminar archivo:', err);
        }
        // Eliminar el registro de la base de datos
        await Recording.deleteOne({ _id: recordingId });
        res.json({ message: 'Grabación eliminada correctamente' });
      });

    } catch (err) {
      console.error('Error al eliminar grabación:', err);
      res.status(500).json({ error: 'Error al eliminar la grabación' });
    }
  });

  // Actualizar el estado de favorito de una grabación
  router.patch('/recordings/:id/favorite', authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const recordingId = req.params.id;

      const recording = await Recording.findOne({ _id: recordingId, userId });
      
      if (!recording) {
        return res.status(404).json({ error: 'Grabación no encontrada' });
      }

      // Cambiar el estado de favorito (toggle)
      recording.isFavorite = !recording.isFavorite;
      await recording.save();

      res.json({ 
        message: `Grabación ${recording.isFavorite ? 'marcada como favorita' : 'desmarcada de favoritos'}`,
        isFavorite: recording.isFavorite 
      });

    } catch (err) {
      console.error('Error al actualizar favorito:', err);
      res.status(500).json({ error: 'Error al actualizar el estado de favorito' });
    }
  });

  router.get('/recordings/:id/stream', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const recordingId = req.params.id;

    const recording = await Recording.findOne({ _id: recordingId, userId });
    
    if (!recording) {
      return res.status(404).json({ error: 'Grabación no encontrada' });
    }

    // Verificar si el archivo existe
    if (!fs.existsSync(recording.filePath)) {
      return res.status(404).json({ error: 'Archivo de grabación no encontrado' });
    }

    // Obtener el tamaño del archivo
    const stat = fs.statSync(recording.filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Streaming parcial para soportar seeking en el video
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(recording.filePath, {start, end});
      
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Streaming completo
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      
      res.writeHead(200, head);
      fs.createReadStream(recording.filePath).pipe(res);
    }
  } catch (err) {
    console.error('Error al reproducir la grabación:', err);
    res.status(500).json({ error: 'Error al reproducir la grabación' });
  }
});


  module.exports = router;