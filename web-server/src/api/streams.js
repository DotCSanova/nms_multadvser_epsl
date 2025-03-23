const express = require('express');
const getActiveStreams = require('../utils/getActiveStreams');  // Importar la función

const router = express.Router();

// Obtener los streamings activos
router.get('/streams', async (req, res) => {
  try {
    const streams = await getActiveStreams();
    res.json({ streams });
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo streamings', error: err.message });
  }
});

module.exports = router;