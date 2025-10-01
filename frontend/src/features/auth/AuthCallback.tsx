// src/features/auth/AuthCallback.tsx
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
        // Get the session after OAuth redirect
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
          // Save auth token and user info
          localStorage.setItem("authToken", session.access_token);
          localStorage.setItem("userEmail", session.user.email || "");

          // Store additional user metadata if available
          if (session.user.user_metadata) {
            const { full_name, avatar_url } = session.user.user_metadata;
            if (full_name) localStorage.setItem("userName", full_name);
            if (avatar_url) localStorage.setItem("userAvatar", avatar_url);
          }

          // Dispatch auth change event
          window.dispatchEvent(new Event("authChange"));

          setStatus("success");

          // Redirect to dashboard
          setTimeout(() => navigate("/dashboard"), 1000);
        } else {
          setErrorMessage("No session found. Please try again.");
          setStatus("error");
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (err) {
        console.error("Unexpected error during OAuth callback:", err);
        setErrorMessage("An unexpected error occurred.");
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
                <p className="text-sm text-muted-foreground">
                  Please wait a moment
                </p>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-green-600">
                  Sign-in successful!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Redirecting to dashboard...
                </p>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-red-600">
                  Sign-in failed
                </h2>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
                <p className="text-sm text-muted-foreground">
                  Redirecting back to login...
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
