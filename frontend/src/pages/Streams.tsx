
import React, { useEffect, useState, useRef } from 'react';
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/Navbar";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useStreams, Stream } from "@/hooks/useStreams";
import { useLanguage } from "@/contexts/LanguageContext";

const Streams = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const previousStreamsRef = useRef<Stream[]>([]);
  const { streamsList, isLoading, error } = useStreams();
  const { t } = useLanguage();

  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      toast.error(t("auth.error"));
      navigate("/login");
    }
  }, [navigate, t]);

  // Manejar errores y notificaciones de nuevos streams
  useEffect(() => {
    // Manejar error de autenticación
    if (error && error.includes('Token')) {
      toast.error(t("auth.sessionExpired"));
      navigate("/login");
      return;
    }

    // Check for new streams that weren't in the previous list
    if (!isLoading && previousStreamsRef.current.length > 0) {
      const previousStreamNames = previousStreamsRef.current.map(s => s.name);
      const newStreams = streamsList.filter(stream => 
        !previousStreamNames.includes(stream.name)
      );
      
      // Only show toast if we found new streams that weren't there before
      if (newStreams.length > 0) {
        // Force a notification with each new stream
        newStreams.forEach(stream => {
          toast.info(`New stream available: ${stream.name}!`);
        });
      }
    } else if (!isLoading && previousStreamsRef.current.length === 0 && streamsList.length > 0) {
      // First streams available after having none
      toast.info("Streams available!");
    }
    
    // Update the previous streams reference
    previousStreamsRef.current = [...streamsList];
    
    // Update message if no streams
    if (!isLoading && streamsList.length === 0) {
      setMessage(error || t('streams.noStreams'));
    } else {
      setMessage('');
    }
  }, [streamsList, isLoading, error, t, navigate]);

  const handlePlayStream = (stream: Stream) => {
    console.log("Selected stream:", stream);
    if (stream && stream.url) {
      toast.success(`Loading stream: ${stream.name}`);
      // Navigate to stream player page with stream data
      navigate(`/stream/${stream.name}`, { state: { streamData: stream } });
    } else {
      toast.error("The selected stream has no URL");
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <Navbar />
        <AuthLayout
          title={t("streams.title")}
          subtitle={t("streams.loading")}
        >
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </AuthLayout>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navbar />
      <AuthLayout
        title={t("streams.title")}
        subtitle="Select a stream to play"
        className="w-full max-w-md" 
      >
        {message ? (
          <div className="text-center p-4">
            <p className="text-muted-foreground">{message}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {streamsList.length > 0 && (
              <Carousel className="w-full max-w-xs mx-auto">
                <CarouselContent>
                  {streamsList.map((stream, index) => (
                    <CarouselItem key={index}>
                      <div className="p-4 border rounded-lg bg-card h-full">
                        <h2 className="text-lg font-semibold mb-2">{stream.name}</h2>
                        <p className="text-sm text-muted-foreground mb-2">
                          Connected clients: {stream.clients || 0}
                        </p>
                        {stream.video && (
                          <p className="text-sm text-muted-foreground mb-3">
                            Resolution: {stream.video.width}x{stream.video.height} @ {stream.video.fps}fps
                          </p>
                        )}
                        <Button 
                          onClick={() => handlePlayStream(stream)}
                          className="w-full"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          {t("streams.watch")}
                        </Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {streamsList.length > 1 && (
                  <div className="flex justify-center mt-4">
                    <CarouselPrevious className="relative mr-2 left-0 translate-y-0" />
                    <CarouselNext className="relative ml-2 right-0 translate-y-0" />
                  </div>
                )}
              </Carousel>
            )}
          </div>
        )}
      </AuthLayout>
    </PageTransition>
  );
};

export default Streams;
