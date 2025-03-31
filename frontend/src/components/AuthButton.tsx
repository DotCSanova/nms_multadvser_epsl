
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          variant === "primary" ? "auth-button" : "auth-button-secondary",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AuthButton.displayName = "AuthButton";
