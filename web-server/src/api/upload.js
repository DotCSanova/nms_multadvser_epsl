const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

router.post('/upload-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se subió ningún archivo.');
    }

    const videoPath = req.file.path;  // Ruta al archivo subido
    console.log('Recibido video:', videoPath);

    // Usar FFmpeg para convertir el video a RTMP
    ffmpeg(videoPath)
    .inputOptions([
        '-re' // Lee el input a velocidad nativa
    ])
    .outputOptions([
        '-c:v libx264',
        '-preset ultrafast',
        '-tune zerolatency',
        '-c:a aac',
        '-ar 44100',
        '-f flv'
    ])
    .output('rtmp://multimedia_server:1935/live/stream')
    .on('start', (commandLine) => {
        console.log('Comando FFmpeg:', commandLine);
    })
    .on('end', () => {
        fs.unlink(videoPath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
            } else {
                console.log('Archivo eliminado exitosamente:', videoPath);
            }
        });
        console.log('Video enviado Node media server');
        res.status(200).send('Video enviado correctamente');
    })
    .on('error', (err) => {
        fs.unlink(videoPath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error al eliminar el archivo:', unlinkErr);
            }
        });
        console.error('Error en FFmpeg:', err);
        res.status(500).send('Error procesando el video');
    })
    .run();
});


module.exports = router;
