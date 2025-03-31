
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn("glass-card rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto", className)}>
      {children}
    </div>
  );
}
