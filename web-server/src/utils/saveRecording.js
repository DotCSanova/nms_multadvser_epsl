const Recording = require('../models/Recording');

async function saveRecording(userId, streamUrl, filePath) {
    try {
      const newRecording = new Recording({
        userId,
        streamUrl,
        filePath,
        duration: 0,
        isFavorite: false,
      });
  
      await newRecording.save();
      console.log(`💾 Grabación guardada en la base de datos: ${filePath}`);
    } catch (err) {
      console.error("❌ Error al guardar la grabación en la base de datos:", err);
    }
  }

module.exports = saveRecording;