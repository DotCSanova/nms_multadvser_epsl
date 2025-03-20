const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const authRoutes = require('./api/auth');
const streamRoutes = require('./api/streams');
const userRoutes = require('./api/users');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
db.connect();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/users', userRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});