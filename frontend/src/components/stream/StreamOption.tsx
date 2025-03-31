
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface StreamOptionProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export const StreamOption = ({ icon, label, onClick }: StreamOptionProps) => {
  return (
    <Button 
      variant="outline" 
      size="lg" 
      className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-secondary/50 transition-all"
      onClick={onClick}
    >
      {icon}
      <span className="text-base">{label}</span>
    </Button>
  );
};
