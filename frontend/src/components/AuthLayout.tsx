
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { GlassCard } from "./GlassCard";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backTo?: string;
  className?: string;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  backTo, 
  className 
}: AuthLayoutProps) {
  return (
    <div className="page-container">
      <GlassCard className={cn("animate-slide-up", className)}>
        <div className={cn("space-y-6", className)}>
          {backTo && (
            <Link
              to={backTo}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          )}
          
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          {children}
        </div>
      </GlassCard>
    </div>
  );
}
