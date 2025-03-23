const axios = require('axios');

const getActiveStreams = async () => {
  try {

    const nmsUri = process.env.NMS_URI;  // Usar la variable de entorno
    const response = await axios.get(`${nmsUri}/api/streams`);
    const streamsData = response.data.live;

    // Convertir la respuesta en una lista de streams
    const streams = Object.keys(streamsData).map((streamName) => {
      const streamInfo = streamsData[streamName].publisher;
      return {
        name: streamName,
        clients: streamsData[streamName].subscribers.length,
        url: `${nmsUri}/live/${streamName}/index.m3u8`,
        audio: streamInfo.audio,
        video: streamInfo.video,
      };
    });

    return streams;
  } catch (err) {
    console.error('Error obteniendo streamings:', err);
    return [];
  }
};

module.exports = getActiveStreams;