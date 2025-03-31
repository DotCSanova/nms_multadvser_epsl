
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
import { Progress } from "@/components/ui/progress";
import { FileVideo, Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import axios from "axios";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FileUploadDialog = ({ open, onOpenChange }: FileUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if the file is a video
      if (!file.type.startsWith('video/')) {
        toast.error(t("sendStream.errorInvalidVideo"));
        return;
      }
      setSelectedFile(file);
      toast.success(`${t("sendStream.selected")}: ${file.name}`);
    }
  };

  // Handle multimedia file upload
  const uploadVideo = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('video', file);
    
    try {
      const response = await axios.post('http://localhost:3000/api/upload/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      
      console.log('Upload response:', response.data);
      toast.success(t("sendStream.uploadSuccess"));
      
      // Reset form
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error(t("sendStream.uploadError"));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSendStream = () => {
    if (selectedFile) {
      uploadVideo(selectedFile);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("sendStream.uploadVideo")}</DialogTitle>
          <DialogDescription>
            {t("sendStream.uploadInstructions")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={isUploading}
            >
              <FileVideo className="mr-2 h-4 w-4" />
              {t("sendStream.selectVideo")}
            </Button>
            {selectedFile && (
              <div className="text-sm">
                {t("sendStream.selected")}: <span className="font-medium">{selectedFile.name}</span>
              </div>
            )}
            
            {isUploading && (
              <div className="w-full space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-center text-muted-foreground">{uploadProgress}%</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleSendStream}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("sendStream.uploading")}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t("sendStream.send")}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
