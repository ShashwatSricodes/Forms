// src/features/auth/Signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { API } from "@/config/api";
import { supabase } from "@/config/supabaseClient";

interface MessageState {
  type: "success" | "error";
  text: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageState | null>(null);

  // Email/Password Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage({
        type: "error",
        text: "Please enter both email and password.",
      });
      return;
    }

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(API.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });

        // Save token if provided
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userEmail", email);
          window.dispatchEvent(new Event("authChange"));

          // Navigate to dashboard
          setTimeout(() => navigate("/dashboard"), 1000);
        }
      } else {
        setMessage({ type: "error", text: data.error || "Signup failed" });
      }
    } catch (err) {
      console.error("Network or Fetch Error:", err);
      setMessage({ type: "error", text: "Could not connect to the server." });
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth Sign-In (Google/GitHub)
  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsOAuthLoading(provider);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
        },
      });

      if (error) {
        console.error(`${provider} OAuth error:`, error);
        setMessage({ type: "error", text: error.message });
        setIsOAuthLoading(null);
      }
      // User will be redirected to provider's login page
    } catch (err) {
      console.error(`${provider} OAuth error:`, err);
      setMessage({ type: "error", text: `Failed to connect with ${provider}` });
      setIsOAuthLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">
            Create an Account
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your details to get started
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isOAuthLoading !== null}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isOAuthLoading !== null}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isOAuthLoading !== null}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="relative">
            <Separator className="my-4" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              OR CONTINUE WITH
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignIn("google")}
              disabled={isLoading || isOAuthLoading !== null}
            >
              {isOAuthLoading === "google" ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <FcGoogle className="mr-2 h-5 w-5" /> Google
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignIn("github")}
              disabled={isLoading || isOAuthLoading !== null}
            >
              {isOAuthLoading === "github" ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <FaGithub className="mr-2 h-5 w-5" /> GitHub
                </>
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="ml-1 font-medium underline underline-offset-4 hover:text-primary"
          >
            Login
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
