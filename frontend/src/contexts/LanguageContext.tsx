
import React, { createContext, useContext } from "react";

type LanguageContextType = {
  t: (key: string) => string;
};

const translations = {
  "navbar.back": "Back",
  "navbar.logout": "Logout",
  "streams.title": "Active Streams",
  "streams.noStreams": "No active streams",
  "streams.loading": "Loading streams...",
  "streams.watch": "Watch",
  "dashboard.welcome": "Welcome to your streaming center",
  "dashboard.streamingOptions": "Streaming options",
  "dashboard.sendStream": "Send stream",
  "dashboard.shareContent": "Share your content in real-time",
  "dashboard.receiveStream": "Receive stream",
  "dashboard.viewContent": "View content broadcasted by others",
  "dashboard.myLibrary": "My library",
  "dashboard.accessRecordings": "Access your recordings and saved content",
  "dashboard.viewLibrary": "View library",
  "dashboard.myFavorites": "My favorites",
  "dashboard.activeStreams": "Active streams",
  "dashboard.recordings": "Recordings",
  "dashboard.favorites": "Favorites",
  "dashboard.views": "Views",
  "player.streamNotFound": "Stream Not Found",
  "player.streamNotFoundDesc": "The requested stream could not be found.",
  "player.backToStreams": "Back to Streams",
  "player.loading": "Loading...",
  "player.streamId": "Stream ID",
  "player.resolution": "Resolution",
  "player.audio": "Audio",
  "player.startRecording": "Start Recording",
  "player.stopRecording": "Stop Recording",
  "library.title": "My Library",
  "library.loading": "Loading your recordings...",
  "library.noRecordings": "You don't have any recordings yet",
  "library.startStreaming": "Start Streaming",
  "library.duration": "Duration",
  "library.play": "Play",
  "library.delete": "Delete",
  "library.deleteConfirm": "Are you sure?",
  "library.deleteDesc": "This action cannot be undone. This will permanently delete this recording.",
  "library.cancel": "Cancel",
  "library.remove": "Remove",
  "favorites.title": "My Favorites",
  "favorites.loading": "Loading your favorites...",
  "favorites.noFavorites": "You don't have any saved favorites",
  "favorites.exploreStreams": "Explore streams",
  "favorites.duration": "Duration",
  "favorites.play": "Play",
  "favorites.remove": "Remove",
  "favorites.removeConfirm": "Are you sure?",
  "favorites.removeDesc": "Do you want to remove this item from your favorites?",
  "favorites.cancel": "Cancel",
  "sendStream.title": "Send Streaming",
  "sendStream.subtitle": "Choose your streaming source",
  "sendStream.multimedia": "Multimedia",
  "sendStream.camera": "Camera",
  "sendStream.uploadVideo": "Upload Video",
  "sendStream.selectVideo": "Select Video File",
  "sendStream.selected": "Selected",
  "sendStream.send": "Send",
  "sendStream.cameraStream": "Camera Stream",
  "sendStream.activateCamera": "Activate Camera",
  "sendStream.startStreaming": "Start Streaming",
  "sendStream.stopStreaming": "Stop Streaming",
  "auth.login": "Please log in to access this page",
  "auth.error": "Please login to access this page"
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Translation function - always returns English translations
  const t = (key: string): string => {
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
