const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


// Registro de usuario
router.post('/register', async (req, res) => {
  console.log("Solicitud recibida");
  console.log("EL BODY ES Body:", req.body);
  const { username, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario
    const user = new User({ username, password });
    await user.save();

    // Respuesta exitosa
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registrando usuario', error: err.message });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar el usuario en la base de datos
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respuesta exitosa
    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    res.status(500).json({ message: 'Error en el login', error: err.message });
  }
});

module.exports = router;