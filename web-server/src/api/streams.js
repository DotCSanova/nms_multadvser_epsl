const express = require('express');
const getActiveStreams = require('../utils/getActiveStreams');  // Importar la función
const authenticate = require('../utils/authenticate');

const router = express.Router();

// Obtener los streamings activos
router.get('/active_streams', authenticate, async (req, res) => {
  try {
    const streams = await getActiveStreams();

    if (!streams || streams.length === 0) {
      return res.json({ message: 'No hay streamings activos', streams: [] });
    }

    res.json({ streams });
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo streamings', error: err.message });
  }
});

module.exports = router;

