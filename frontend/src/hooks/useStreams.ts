import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface Stream {
  name: string;
  clients?: number;
  url?: string;
  audio?: {
    codec: string;
    profile: string;
    samplerate: number;
    channels: number;
  };
  video?: {
    codec: string;
    width: number;
    height: number;
    profile: string;
    level: number;
    fps: number;
  };
}

interface UseStreamsReturn {
  activeStreams: number;
  isLoading: boolean;
  streamsList: Stream[];
  fetchStreams: () => Promise<void>;
  error: string | null;
}

export const useStreams = (): UseStreamsReturn => {
  const [streamsList, setStreamsList] = useState<Stream[]>([]);
  const [activeStreams, setActiveStreams] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000';
  
  // Usamos un estado para controlar los reintentos
  const [retryCount, setRetryCount] = useState(0);
  
  const fetchStreams = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      // Si no hay token, no podemos hacer la petición
      if (!token) {
        setError('No se encontró token de autenticación');
        setIsLoading(false);
        setStreamsList([]);
        setActiveStreams(0);
        return;
      }

      const response = await axios.get(`${API_URL}/api/streams/active_streams`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API response:", response.data);

      if (response.data.streams) {
        setStreamsList(response.data.streams);
        setActiveStreams(response.data.streams.length);
      } else {
        setStreamsList([]);
        setActiveStreams(0);
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error obteniendo streamings:', err);
      
      // Si es un error de autenticación, intentamos renovar el token
      if (err.response && err.response.status === 401) {
        setError('Token de autenticación inválido o expirado');
        
        // Intentar renovar el token o redirigir al login si ya lo intentamos varias veces
        if (retryCount < 2) {
          // Incrementamos el contador de reintentos
          setRetryCount(prev => prev + 1);
          
          // Simulamos una renovación del token o podríamos implementar una real
          // Por ahora, simplemente mostramos un toast informativo
          toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
          
          // Limpiar el token actual ya que es inválido
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
        }
      } else {
        setError('Error al obtener streams activos');
      }
      
      setStreamsList([]);
      setActiveStreams(0);
      setIsLoading(false);
    }
  };
  
  // Inicializar el intervalo para actualizar los streams
  useEffect(() => {
    // Fetch streams initially
    fetchStreams();
    
    // Set up interval to refresh every 5 seconds (changed from 10 seconds)
    const interval = setInterval(() => {
      fetchStreams();
    }, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [retryCount]); // Añadimos retryCount como dependencia para reintentar cuando cambie

  return {
    activeStreams,
    isLoading,
    streamsList,
    fetchStreams,
    error
  };
};
