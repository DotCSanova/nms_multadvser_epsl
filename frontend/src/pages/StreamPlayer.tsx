import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Square } from "lucide-react";
import { useStreamPlayer, type StreamData } from "@/hooks/useStreamPlayer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { handleApiError } from "@/utils/apiErrorHandler";
import { recordingService } from "@/utils/recordingService";
import 'video.js/dist/video-js.css';

const StreamPlayer = () => {
  const { streamId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useLanguage();
  
  // Check authentication
  const { token } = useAuthCheck();
  
  // Get stream data from location state if available
  const streamDataFromLocation = location.state?.streamData;
  
  // Setup stream data
  useEffect(() => {
    if (!streamId) {
      toast.error("Invalid Stream ID");
      navigate("/streams");
      return;
    }

    // If we have stream data from navigation, use it
    if (streamDataFromLocation) {
      setStreamData({
        ...streamDataFromLocation,
        type: 'live'
      });
      setIsLoading(false);
      return;
    }

    // If no stream data, redirect back to streams
    toast.error("Could not load stream information");
    navigate("/streams");
  }, [streamId, navigate, streamDataFromLocation]);

  // Use our custom hook for the player
  const { isPlayerReady } = useStreamPlayer({
    stream: streamData,
    containerRef: videoContainerRef
  });

  // Handle recording start/stop
  const handleRecording = async () => {
    if (!streamData || !streamData.name || !token) {
      toast.error("No stream data available or not authenticated");
      return;
    }

    setIsProcessing(true);

    try {
      if (isRecording) {
        // Stop recording
        await recordingService.stopRecording(streamData.name, token);
      } else {
        // Start recording
        await recordingService.startRecording(streamData.name, token);
      }
      
      // Toggle recording state
      setIsRecording(!isRecording);
    } catch (error: any) {
      handleApiError(error, navigate, t, "Error with recording operation");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center h-screen">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!streamData) {
    return (
      <PageTransition>
        <Navbar />
        <div className="page-container">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-xl font-medium text-primary mb-4">
              {t("player.streamNotFound")}
            </p>
            <p className="text-muted-foreground mb-4">
              {t("player.streamNotFoundDesc")}
            </p>
            <Button onClick={() => navigate("/streams")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("player.backToStreams")}
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navbar />
      <div className="page-container pt-16">
        <GlassCard className="w-full max-w-4xl animate-slide-up">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">{streamData.name || t("player.loading")}</h1>
                {streamData.id && (
                  <p className="text-sm text-muted-foreground">{t("player.streamId")}: {streamData.id}</p>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/streams")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("player.backToStreams")}
              </Button>
            </div>
            
            <div className="w-full mx-auto">
              <div className="relative rounded-lg overflow-hidden shadow-lg bg-black">
                {/* Video container */}
                <div 
                  ref={videoContainerRef} 
                  className="w-full aspect-video"
                  data-player-ready={isPlayerReady}
                ></div>
              </div>
              
              <div className="flex justify-center mt-4 gap-4">
                <Button
                  onClick={handleRecording}
                  disabled={isProcessing}
                  variant={isRecording ? "destructive" : "default"}
                >
                  {isProcessing ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  ) : isRecording ? (
                    <>
                      <Square className="mr-2 h-4 w-4" />
                      {t("player.stopRecording")}
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      {t("player.startRecording")}
                    </>
                  )}
                </Button>
              </div>
              
              {streamData.video && (
                <div className="mt-2 text-sm text-center text-muted-foreground">
                  {t("player.resolution")}: {streamData.video.width}x{streamData.video.height} @ {streamData.video.fps}fps
                </div>
              )}
              
              {streamData.audio && (
                <div className="mt-1 text-sm text-center text-muted-foreground">
                  {t("player.audio")}: {streamData.audio.codec} {streamData.audio.channels} channels @ {streamData.audio.samplerate}Hz
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
};

export default StreamPlayer;
