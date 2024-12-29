import { Button } from "@/components/ui/button";
import { LogOut, LogIn, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const AuthButtons = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return isAuthenticated ? (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/profile")}
        className="rounded-full"
      >
        <UserRound className="h-5 w-5" />
      </Button>
      <Button variant="outline" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </>
  ) : (
    <Button variant="outline" onClick={() => navigate("/login")}>
      <LogIn className="mr-2 h-4 w-4" />
      Login
    </Button>
  );
};