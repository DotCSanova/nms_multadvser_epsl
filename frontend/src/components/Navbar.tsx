
import { LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  // Don't show back button on dashboard
  const showBackButton = location.pathname !== "/dashboard";

  return (
    <div className="absolute top-0 flex justify-between w-full p-4">
      {showBackButton ? (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack} 
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      ) : (
        <div></div> // Empty div to maintain layout with flex justify-between
      )}
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout} 
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};
