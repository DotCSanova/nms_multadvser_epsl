
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Star, StarOff, Trash } from "lucide-react";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatDateTime } from "@/utils/formatters";
import { useLanguage } from "@/contexts/LanguageContext";

interface Recording {
  _id: string;
  title: string;
  createdAt: string;
  duration: string;
  streamName: string;
  isFavorite?: boolean;
}

interface RecordingCardProps {
  recording: Recording;
  onPlay: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  showDeleteButton?: boolean;
  showFavoriteButton?: boolean;
}

export function RecordingCard({
  recording,
  onPlay,
  onDelete,
  onToggleFavorite,
  showDeleteButton = true,
  showFavoriteButton = true
}: RecordingCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{recording.title || recording.streamName}</CardTitle>
        <CardDescription>{formatDateTime(recording.createdAt)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{t("library.duration")}: {recording.duration || "N/A"}</p>
        <p className="text-sm truncate">{t("library.stream")}: {recording.streamName}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPlay(recording._id)}
          >
            <Play className="h-4 w-4 mr-2" />
            {t("library.play")}
          </Button>
          
          {showFavoriteButton && onToggleFavorite && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleFavorite(recording._id)}
            >
              {recording.isFavorite ? (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        
        {showDeleteButton && onDelete && (
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete && onDelete(recording._id)}
            >
              <Trash className="h-4 w-4 mr-2" />
              {t("library.delete")}
            </Button>
          </AlertDialogTrigger>
        )}
      </CardFooter>
    </Card>
  );
}
