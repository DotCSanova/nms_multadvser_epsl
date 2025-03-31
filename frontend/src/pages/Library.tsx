
import { PageTransition } from "@/components/PageTransition";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { handleApiError } from "@/utils/apiErrorHandler";
import { RecordingCard } from "@/components/recording/RecordingCard";
import axios from "axios";

interface Recording {
  _id: string;
  title: string;
  createdAt: string;
  duration: string;
  streamName: string;
  filePath: string;
  userId: string;
  isFavorite?: boolean;
}

const Library = () => {
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recordingToDelete, setRecordingToDelete] = useState<string | null>(null);
  const { t } = useLanguage();
  const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000';
  
  // Use our auth check hook
  useAuthCheck();

  const fetchRecordings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error(t("auth.error"));
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/api/record/recordings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecordings(response.data);
      setIsLoading(false);
    } catch (error: any) {
      handleApiError(error, navigate, t, t("library.fetchError"));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, [navigate, t]);

  const handlePlay = (id: string) => {
    navigate(`/recording/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setRecordingToDelete(id);
  };

  const handleDelete = async () => {
    if (recordingToDelete) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.error(t("auth.error"));
          navigate("/login");
          return;
        }

        await axios.delete(`${API_URL}/api/record/recordings/${recordingToDelete}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update the list of recordings
        setRecordings(recordings.filter(recording => recording._id !== recordingToDelete));
        toast.success(t("library.deleteSuccess"));
        setRecordingToDelete(null);
      } catch (error: any) {
        handleApiError(error, navigate, t, t("library.deleteError"));
      }
    }
  };

  const toggleFavorite = async (recordingId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error(t("auth.error"));
        navigate("/login");
        return;
      }

      const response = await axios.patch(
        `${API_URL}/api/record/recordings/${recordingId}/favorite`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the recording in the state
      setRecordings(recordings.map(recording => 
        recording._id === recordingId
          ? { ...recording, isFavorite: response.data.isFavorite }
          : recording
      ));

      toast.success(response.data.message);
    } catch (error: any) {
      handleApiError(error, navigate, t, t("library.favoriteError"));
    }
  };

  return (
    <PageTransition>
      <div className="page-container">
        <Navbar />
        <div className="container mx-auto p-6 flex flex-col h-[calc(100vh-32px)]">
          <div className="sticky top-0 z-10 pt-12 pb-6 bg-transparent">
            <h1 className="text-2xl font-bold text-gray-800 text-center">{t("library.title")}</h1>
            <div className="flex justify-end mt-4">
              <Button 
                onClick={fetchRecordings} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-grow">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>{t("library.loading")}</p>
              </div>
            ) : recordings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">{t("library.noRecordings")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                {recordings.map(recording => (
                  <AlertDialog key={recording._id}>
                    <RecordingCard
                      recording={recording}
                      onPlay={handlePlay}
                      onDelete={handleDeleteClick}
                      onToggleFavorite={toggleFavorite}
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("library.deleteConfirm")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("library.deleteDesc")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("library.cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          {t("library.delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </PageTransition>
  );
};

export default Library;
