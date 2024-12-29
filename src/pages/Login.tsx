import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/aac7c64e-04f1-43ba-9fc5-a6f47582a661.png" 
              alt="Geometric illustration with figures" 
              className="w-32 h-32 mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Drum Room</h1>
          <p className="text-muted-foreground">Sign in to reserve your practice space</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={["github"]}
          />
        </div>
      </div>
    </div>
  );
}