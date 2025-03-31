const express = require('express');
const cors = require('cors'); // Importar módulo CORS, para permitir peticiones desde el frontend (Cross-Origin Resource Sharing) .
require('dotenv').config({ path: '../.env' });
const { connect } = require('./config/db');
const authRoutes = require('./api/auth');
const streamRoutes = require('./api/streams');
const uploadRoutes = require('./api/upload');
const recordRoutes = require('./api/record');
//require('./websocket/signaling');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' })); // Solo permite peticiones de este este origen.

// Middleware para analizar cuerpo de solicitud como JSON
app.use(express.json(), (req, res, next) => {
    console.log("Middleware ejecutado - req.body:", req.body);
    next();
});

// Conexión a la base de datos
connect();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/record', recordRoutes);
//app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('SERVIDOR fUNCIONANDO bien!');
    });
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});