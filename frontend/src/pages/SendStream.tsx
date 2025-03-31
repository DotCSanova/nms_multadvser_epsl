
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/Navbar";
import { AuthLayout } from "@/components/AuthLayout";
import { FileVideo, Camera } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileUploadDialog } from "@/components/stream/FileUploadDialog";
import { CameraStreamDialog } from "@/components/stream/CameraStreamDialog";
import { StreamOption } from "@/components/stream/StreamOption";

const SendStream = () => {
  const navigate = useNavigate();
  const [streamType, setStreamType] = useState<"file" | "camera" | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    
    if (!isAuthenticated) {
      toast.error(t("auth.error"));
      navigate("/login");
    }
  }, [navigate, t]);

  const handleOptionClick = (type: "file" | "camera") => {
    setStreamType(type);
  };

  const handleDialogClose = () => {
    setStreamType(null);
  };

  return (
    <PageTransition>
      <Navbar />
      <AuthLayout
        title={t("sendStream.title")}
        subtitle={t("sendStream.subtitle")}
        backTo="/dashboard"
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Upload Option */}
          <StreamOption 
            icon={<FileVideo className="h-10 w-10 text-primary" />}
            label={t("sendStream.multimedia")}
            onClick={() => handleOptionClick("file")}
          />

          {/* Camera Stream Option */}
          <StreamOption 
            icon={<Camera className="h-10 w-10 text-primary" />}
            label={t("sendStream.camera")}
            onClick={() => handleOptionClick("camera")}
          />
        </div>

        {/* Dialogs */}
        <FileUploadDialog 
          open={streamType === "file"} 
          onOpenChange={handleDialogClose} 
        />
        
        <CameraStreamDialog 
          open={streamType === "camera"} 
          onOpenChange={handleDialogClose} 
        />
      </AuthLayout>
    </PageTransition>
  );
};

export default SendStream;
