
import { useState, useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type Player from 'video.js/dist/types/player';
import { toast } from 'sonner';

export interface StreamData {
  id?: string;
  name: string;
  type?: 'live' | 'recording';
  url?: string;
  clients?: number;
  connectedClients?: number;
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

interface UseStreamPlayerProps {
  stream: StreamData | null;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useStreamPlayer = ({ stream, containerRef }: UseStreamPlayerProps) => {
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const playerRef = useRef<Player | null>(null);
  const videoElement = useRef<HTMLVideoElement | null>(null);

  // Initialize and clean up player
  useEffect(() => {
    // Only initialize when we have the stream data and container ref
    if (!stream || !stream.url || !containerRef.current) {
      return;
    }

    // Clean up any existing player
    if (playerRef.current) {
      console.log('Cleaning up existing player');
      playerRef.current.dispose();
      playerRef.current = null;
    }

    // Create a fresh video element
    console.log('Creating video element for stream:', stream.name);
    videoElement.current = document.createElement('video');
    videoElement.current.className = 'video-js vjs-big-play-centered vjs-fluid';
    videoElement.current.playsInline = true;

    // Clear container and append video element
    const container = containerRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(videoElement.current);

    // Configure player with HLS settings
    const playerOptions = {
      controls: true,
      autoplay: true,
      preload: 'auto',
      responsive: true,
      fluid: true,
      liveui: true,
      html5: {
        hls: {
          overrideNative: true
        }
      },
      sources: [{
        src: stream.url,
        type: 'application/x-mpegURL' // HLS format
      }]
    };

    console.log('Initializing player with URL:', stream.url);
    
    try {
      // Initialize player with the video element
      const player = videojs(videoElement.current, playerOptions);
      
      // Simple event handlers for debugging
      player.ready(() => {
        console.log('Player is ready:', player);
        setIsPlayerReady(true);
      });
      
      player.on('error', (e) => {
        const error = player.error();
        console.error('Player error:', e, error);
        toast.error(`Error en la reproducción: ${error?.message || 'Desconocido'}`);
      });
      
      player.on('playing', () => {
        console.log('Video is now playing');
        toast.success('Reproducción iniciada');
      });
      
      // Store player reference
      playerRef.current = player;
      
    } catch (error) {
      console.error('Error initializing player:', error);
      toast.error('Error al inicializar el reproductor');
    }

    // Cleanup function
    return () => {
      console.log('Running cleanup for player');
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      setIsPlayerReady(false);
    };
  }, [stream, containerRef]);

  return {
    isPlayerReady,
    player: playerRef.current
  };
};
