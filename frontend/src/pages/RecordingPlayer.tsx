
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { handleApiError } from "@/utils/apiErrorHandler";
import { VideoLoader } from "@/components/video/VideoLoader";
import axios from "axios";
import 'video.js/dist/video-js.css';

const RecordingPlayer = () => {
  const { recordingId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const { t } = useLanguage();
  const { token } = useAuthCheck();
  const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000';

  useEffect(() => {
    if (!recordingId) {
      toast.error("Invalid Recording ID");
      navigate("/library");
      return;
    }

    // Get recording info to display title
    const fetchRecordingInfo = async () => {
      try {
        if (!token) {
          toast.error(t("auth.error"));
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_URL}/api/record/recordings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const recording = response.data.find((rec: any) => rec._id === recordingId);
        
        if (recording) {
          setTitle(recording.title || recording.streamName);
          setIsFavorite(recording.isFavorite || false);
        } else {
          toast.error(t("player.recordingNotFound"));
          navigate("/library");
        }
      } catch (error: any) {
        handleApiError(error, navigate, t, t("library.fetchError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordingInfo();
  }, [recordingId, navigate, t, token, API_URL]);

  const toggleFavorite = async () => {
    try {
      if (!token) {
        toast.error(t("auth.error"));
        navigate("/login");
        return;
      }

      const response = await axios.patch(
        `${API_URL}/api/record/recordings/${recordingId}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsFavorite(response.data.isFavorite);
      toast.success(response.data.message);
    } catch (error: any) {
      handleApiError(error, navigate, t, "Error updating favorite status");
    }
  };

  const handleVideoError = (message: string) => {
    toast.error(t("player.playbackError"));
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

  return (
    <PageTransition>
      <Navbar />
      <div className="page-container pt-16">
        <GlassCard className="w-full max-w-4xl animate-slide-up">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleFavorite}
                  className={isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground hover:text-foreground"}
                >
                  <Star className={`h-5 w-5 ${isFavorite ? "fill-yellow-400" : ""}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/library")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Library
                </Button>
              </div>
            </div>
            
            <div className="w-full mx-auto">
              <div className="relative rounded-lg overflow-hidden shadow-lg bg-black">
                {/* Video player */}
                {token && recordingId && (
                  <VideoLoader
                    videoUrl={`${API_URL}/api/record/recordings/${recordingId}/stream`}
                    token={token}
                    onError={handleVideoError}
                  />
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
};

export default RecordingPlayer;
