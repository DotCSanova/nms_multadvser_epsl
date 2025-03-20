const express = require('express');
require('dotenv').config({ path: '../.env' });
const { connect } = require('./config/db');
const authRoutes = require('./api/auth');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar cuerpo de solicitud como JSON
app.use(express.json(), (req, res, next) => {
    console.log("Middleware ejecutado - req.body:", req.body);
    next();
});

// Conexión a la base de datos
connect();

// Rutas
app.use('/api/auth', authRoutes);
//app.use('/api/streams', streamRoutes);
//app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('sERVIDOR fUNCIONANDO!');
    });
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});