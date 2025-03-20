const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a la base de datos MongoDB');
  } catch (err) {
    console.error('Error conectando a la base de datos:', err);
  }
};

module.exports = { connect };