
import { PageTransition } from "@/components/PageTransition";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Trash } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { handleApiError } from "@/utils/apiErrorHandler";
import { formatDateTime } from "@/utils/formatters";
import axios from "axios";

interface Recording {
  _id: string;
  title: string;
  createdAt: string;
  duration: string;
  streamName: string;
  isFavorite: boolean;
}

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const { t } = useLanguage();
  const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000';
  
  // Use our auth check hook
  useAuthCheck();

  const fetchFavorites = async () => {
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
      
      // Filter only favorite recordings
      const favoriteRecordings = response.data.filter((recording: Recording) => recording.isFavorite);
      setFavorites(favoriteRecordings);
      setIsLoading(false);
    } catch (error: any) {
      handleApiError(error, navigate, t, t("favorites.fetchError"));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [navigate, t]);

  const handlePlay = (id: string) => {
    navigate(`/recording/${id}`);
  };

  const handleRemoveFromFavorites = async () => {
    if (itemToRemove) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.error(t("auth.error"));
          navigate("/login");
          return;
        }

        await axios.patch(
          `${API_URL}/api/record/recordings/${itemToRemove}/favorite`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Remove the item from the favorites list
        setFavorites(favorites.filter(item => item._id !== itemToRemove));
        toast.success(t("favorites.removed"));
        setItemToRemove(null);
      } catch (error: any) {
        handleApiError(error, navigate, t, t("favorites.removeError"));
      }
    }
  };

  return (
    <PageTransition>
      <div className="page-container">
        <Navbar />
        <div className="container mx-auto p-6 flex flex-col h-[calc(100vh-32px)]">
          <div className="sticky top-0 z-10 pt-12 pb-6 bg-transparent">
            <h1 className="text-2xl font-bold text-gray-800 text-center">{t("favorites.title")}</h1>
          </div>
          
          <ScrollArea className="flex-grow">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>{t("favorites.loading")}</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">{t("favorites.noFavorites")}</p>
                <Button onClick={() => navigate("/library")}>{t("favorites.exploreStreams")}</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                {favorites.map(item => (
                  <Card key={item._id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{item.title || item.streamName}</CardTitle>
                      <CardDescription>{formatDateTime(item.createdAt)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{t("favorites.duration")}: {item.duration || "N/A"}</p>
                      <p className="text-sm truncate">{t("favorites.stream")}: {item.streamName}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePlay(item._id)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {t("favorites.play")}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => setItemToRemove(item._id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            {t("favorites.remove")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("favorites.removeConfirm")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("favorites.removeDesc")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("favorites.cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRemoveFromFavorites}>
                              {t("favorites.remove")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </PageTransition>
  );
};

export default Favorites;
