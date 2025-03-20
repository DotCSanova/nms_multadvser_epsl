// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,  // El nombre de usuario debe ser único
      trim: true,    // Elimina espacios en blanco al inicio y al final
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,  // Añade automáticamente 'createdAt' y 'updatedAt'
  }
);

// Encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Si la contraseña no ha sido modificada, continuar

  const salt = await bcrypt.genSalt(10); // Generar una sal para encriptar la contraseña
  this.password = await bcrypt.hash(this.password, salt); // Encriptar la contraseña
  next();   //Continuar con el proceso de guardado
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);