
import { useState, useRef } from "react";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CameraStreamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CameraStreamDialog = ({ open, onOpenChange }: CameraStreamDialogProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useLanguage();

  // Handle camera stream
  const startCameraStream = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;
        toast.success(t("sendStream.cameraActivated"));
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error(t("sendStream.errorAccessCamera"));
    }
  };

  // Handle stream toggle
  const handleToggleStream = () => {
    setIsStreaming(!isStreaming);
    if (!isStreaming) {
      toast.success(t("sendStream.startedCameraStream"));
    } else {
      toast.success(t("sendStream.stoppedCameraStream"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("sendStream.cameraStream")}</DialogTitle>
          <DialogDescription>
            {t("sendStream.cameraInstructions")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative rounded-md overflow-hidden bg-black aspect-video w-full">
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!videoRef.current?.srcObject && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <Button variant="outline" onClick={startCameraStream}>
                  <Camera className="mr-2 h-4 w-4" />
                  {t("sendStream.activateCamera")}
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleToggleStream}
              disabled={!videoRef.current?.srcObject}
              variant={isStreaming ? "destructive" : "default"}
            >
              <Send className="mr-2 h-4 w-4" />
              {isStreaming ? t("sendStream.stopStreaming") : t("sendStream.startStreaming")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
