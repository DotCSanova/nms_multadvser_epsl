const express = require('express');
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const authenticate = require('../utils/authenticate');
const User = require('../models/User');
const saveRecording = require('../utils/saveRecording');
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

  module.exports = router;