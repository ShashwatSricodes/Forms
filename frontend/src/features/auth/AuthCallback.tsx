import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/config/supabaseClient";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get session after OAuth redirect
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("OAuth callback error:", error);
          setErrorMessage(error.message);
          setStatus("error");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        if (session) {
          // Store full session for persistence
          localStorage.setItem("supabaseSession", JSON.stringify(session));

          // Save token shortcuts
          localStorage.setItem("authToken", session.access_token);
          if (session.refresh_token) {
            localStorage.setItem("refreshToken", session.refresh_token);
          }

          // Save email + profile if present
          const { user } = session;
          if (user.email) localStorage.setItem("userEmail", user.email);
          if (user.user_metadata) {
            const { full_name, avatar_url } = user.user_metadata;
            if (full_name) localStorage.setItem("userName", full_name);
            if (avatar_url) localStorage.setItem("userAvatar", avatar_url);
          }

          // Notify app UI
          window.dispatchEvent(new Event("authChange"));

          setStatus("success");

          // Redirect immediately (no timeout race)
          navigate("/dashboard", { replace: true });
        } else {
          setErrorMessage("No session returned. Please try again.");
          setStatus("error");
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (err) {
        console.error("Unexpected OAuth error:", err);
        setErrorMessage("Unexpected error occurred.");
        setStatus("error");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <h2 className="text-lg font-semibold">Completing sign-in...</h2>
                <p className="text-sm text-muted-foreground">Please wait a moment</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="h-12 w-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-green-600">Sign-in successful!</h2>
                <p className="text-sm text-muted-foreground">Redirecting…</p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="h-12 w-12 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-red-600">Sign-in failed</h2>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
                <p className="text-sm text-muted-foreground">Sending you back…</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
