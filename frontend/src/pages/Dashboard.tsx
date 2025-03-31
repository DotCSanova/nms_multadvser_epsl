
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { ArrowRight, Send, Library, Tv, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStreams } from "@/hooks/useStreams";
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const { activeStreams, isLoading } = useStreams();
  const [recordingsCount, setRecordingsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);
  
  const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000';
  
  useEffect(() => {
    // Use the checkAuth function to verify authentication
    const isAuthenticated = checkAuth();
    
    if (!isAuthenticated) {
      toast.error("Please log in to access this page");
      navigate("/login");
    }
  }, [navigate, checkAuth]);

  const fetchCounts = async () => {
    try {
      // Solo mostramos el loading en la carga inicial
      if (recordingsCount === 0 && favoritesCount === 0) {
        setIsLoadingCounts(true);
      }
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Fetch recordings
      const recordingsResponse = await axios.get(`${API_URL}/api/record/recordings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Fetch favorites by filtering recordings that are favorites
      const recordings = recordingsResponse.data;
      const favorites = recordings.filter((recording: any) => recording.isFavorite);
      
      // Solo actualizar el estado si los valores cambiaron
      if (recordings.length !== recordingsCount) {
        setRecordingsCount(recordings.length);
      }
      
      if (favorites.length !== favoritesCount) {
        setFavoritesCount(favorites.length);
      }
      
      setIsLoadingCounts(false);
    } catch (error) {
      console.error('Error fetching counts:', error);
      setIsLoadingCounts(false);
    }
  };

  // Initial fetch and set up interval
  useEffect(() => {
    fetchCounts();
    
    // Set interval to fetch counts every 5 seconds
    const interval = setInterval(fetchCounts, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <PageTransition>
      <div className="page-container">
        <Navbar />
        <div className="max-w-4xl w-full p-6 space-y-12">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to MultiAdvancedFlow</h1>
            <p className="text-muted-foreground">Stream or receive content in real-time</p>
          </div>
          
          {/* Streaming Options Section */}
          <Card className="border-0 shadow-md bg-white/90 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Tv className="h-5 w-5 text-primary" />
                Streaming options
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">Send stream</h3>
                  <p className="text-sm text-muted-foreground mb-2">Share your content in real-time</p>
                  <Link to="/send-stream" className="w-full">
                    <Button variant="default" size="lg" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send stream
                    </Button>
                  </Link>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">Receive stream</h3>
                  <p className="text-sm text-muted-foreground mb-2">View content broadcasted by others</p>
                  <Link to="/streams" className="w-full">
                    <Button variant="default" size="lg" className="w-full">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Receive stream
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Library Section */}
          <Card className="border-0 shadow-md bg-white/90 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Library className="h-5 w-5 text-primary" />
                My library
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-3">
                <p className="text-sm text-muted-foreground">Access your recordings and saved content</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/library" className="w-full">
                    <Button variant="default" size="lg" className="w-full">
                      <Library className="mr-2 h-4 w-4" />
                      View library
                    </Button>
                  </Link>
                  <Link to="/favorites" className="w-full">
                    <Button variant="default" size="lg" className="w-full">
                      <Star className="mr-2 h-4 w-4" />
                      My favorites
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Activity Summary - Stats display with only Active Streams and Recordings */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur p-4 rounded-lg shadow-sm text-center">
              <p className="text-3xl font-bold text-primary">
                {isLoading ? (
                  <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></span>
                ) : (
                  activeStreams
                )}
              </p>
              <p className="text-sm text-muted-foreground">Active streams</p>
            </div>
            <div className="bg-white/80 backdrop-blur p-4 rounded-lg shadow-sm text-center">
              <p className="text-3xl font-bold text-primary">
                {isLoadingCounts && recordingsCount === 0 ? (
                  <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></span>
                ) : (
                  recordingsCount
                )}
              </p>
              <p className="text-sm text-muted-foreground">Recordings</p>
            </div>
            <div className="bg-white/80 backdrop-blur p-4 rounded-lg shadow-sm text-center">
              <p className="text-3xl font-bold text-primary">
                {isLoadingCounts && favoritesCount === 0 ? (
                  <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></span>
                ) : (
                  favoritesCount
                )}
              </p>
              <p className="text-sm text-muted-foreground">Favorites</p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
