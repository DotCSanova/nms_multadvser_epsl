
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Streams from "./pages/Streams";
import StreamPlayer from "./pages/StreamPlayer";
import SendStream from "./pages/SendStream";
import Library from "./pages/Library";
import Favorites from "./pages/Favorites";
import RecordingPlayer from "./pages/RecordingPlayer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component to handle AnimatePresence with routes
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/streams" element={<Streams />} />
        <Route path="/stream/:streamId" element={<StreamPlayer />} />
        <Route path="/send-stream" element={<SendStream />} />
        <Route path="/library" element={<Library />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/recording/:recordingId" element={<RecordingPlayer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
