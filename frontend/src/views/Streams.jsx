import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const Streams = () => {
  const [streams, setStreams] = useState([]);
  const [currentStream, setCurrentStream] = useState(null);
  const [message, setMessage] = useState('');
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000'; // Modificar al pasar a produccion con ngnix

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/streams/active_streams`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.streams.length === 0) {
          setMessage(response.data.message || ' No hay streamings activos');
        }else{
          setStreams(response.data.streams);
          setMessage('');
        }
      } catch (err) {
        console.error('Error obteniendo streamings:', err);
        setMessage('Error obteniendo streamings');
      }
    };

    fetchStreams();
  }, []);

  useEffect(() => {
    if (currentStream && videoRef.current) {
      if (playerRef.current) {
        playerRef.current.dispose(); // Limpiar el reproductor anterior
      }

      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        sources: [{
          src: currentStream,
          type: 'application/x-mpegURL',
        }],
      });
    }
  }, [currentStream]);

  return (
    <div>
      <h1>Streams Disponibles</h1>
      {message && <p>{message}</p>} {/* Mostrar mensaje si no hay streams */}
      <ul>
        {streams.map((stream, index) => (
          <li key={index}>
            <h2>{stream.name}</h2>
            <p>Clientes conectados: {stream.clients}</p>
            <button onClick={() => setCurrentStream(stream.url)}>Reproducir</button>
          </li>
        ))}
      </ul>
      {currentStream && (
        <div data-vjs-player>
          <video ref={videoRef} className="video-js" />
        </div>
      )}
    </div>
  );
};

export default Streams;