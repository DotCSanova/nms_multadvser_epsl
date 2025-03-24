const express = require('express');
const cors = require('cors'); // Importar módulo CORS, para permitir peticiones desde el frontend (Cross-Origin Resource Sharing) .
require('dotenv').config({ path: '../.env' });
const { connect } = require('./config/db');
const authRoutes = require('./api/auth');
const streamRoutes = require('./api/streams');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' })); // Solo permite peticiones de este este origen. !! CAMBIAR AL DOCKERIZAR FRONTEND

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
//app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('SERVIDOR fUNCIONANDO bien!');
    });
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});