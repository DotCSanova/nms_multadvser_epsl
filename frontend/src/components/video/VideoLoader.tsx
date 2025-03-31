
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface VideoLoaderProps {
  videoUrl: string;
  token: string;
  onError?: (message: string) => void;
  className?: string;
}

export function VideoLoader({ 
  videoUrl, 
  token, 
  onError,
  className = "w-full aspect-video"
}: VideoLoaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (!videoRef.current) return;
    
    const videoElement = videoRef.current;
    
    // Create XMLHttpRequest to handle video streaming with authentication
    const xhr = new XMLHttpRequest();
    xhr.open('GET', videoUrl);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.responseType = 'blob';
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        // Create a blob URL from the response and set it as the video source
        const blob = new Blob([xhr.response], { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        videoElement.src = url;
        
        // Clean up the blob URL when the component unmounts
        return () => {
          URL.revokeObjectURL(url);
        };
      } else {
        console.error('Error loading video:', xhr.statusText);
        if (onError) onError('Error loading video');
      }
    };
    
    xhr.onerror = function() {
      console.error('Network error while loading video');
      if (onError) onError('Network error while loading video');
    };
    
    xhr.send();

    // Handle errors
    videoElement.addEventListener('error', function(e) {
      console.error('Video playback error:', e);
      if (onError) onError('Video playback error');
    });

    // Cleanup
    return () => {
      if (videoElement.src) {
        URL.revokeObjectURL(videoElement.src);
      }
    };
  }, [videoUrl, token, onError]);

  return (
    <video 
      ref={videoRef}
      className={className}
      controls
      autoPlay
      playsInline
    />
  );
}
