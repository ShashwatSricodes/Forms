// frontend/SignUp.tsx
import { useState } from "react";
import { Loader2 } from "lucide-react";
// Assuming all your shadcn components are correctly imported:
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
import { FaGithub, FaFacebook } from "react-icons/fa";

// Set the correct backend URL for PORT 5000
const BACKEND_URL = "http://localhost:5000/api/auth/signup";

interface MessageState {
  type: "success" | "error";
  text: string;
}

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // TypeScript fix
  const [message, setMessage] = useState<MessageState | null>(null);

  const handleSignup = async () => {
    if (!email || !password) {
      setMessage({
        type: "error",
        text: "Please enter both email and password.",
      });
      return;
    }

    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
      } else {
        setMessage({
          type: "error",
          text: data.error || "An unexpected error occurred during signup.",
        });
      }
    } catch (err) {
      console.error("Network or Fetch Error:", err);
      setMessage({
        type: "error",
        text: "Could not connect to the backend server. Is it running?",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">
            Create an Account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          {message && (
            <p
              className={`text-sm font-medium ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <Button
            className="w-full"
            onClick={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing up...
              </>
            ) : (
              "Create an account"
            )}
          </Button>

          <Separator className="my-4" />

          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" disabled={isLoading}>
              <FcGoogle className="mr-2 h-5 w-5" /> Google
            </Button>
            <Button variant="outline" className="w-full" disabled={isLoading}>
              <FaGithub className="mr-2 h-5 w-5" /> Github
            </Button>
            <Button variant="outline" className="w-full" disabled={isLoading}>
              <FaFacebook className="mr-2 h-5 w-5 text-blue-600" /> Facebook
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center text-sm">
          Already a user?{" "}
          <a href="/login" className="ml-1 underline">
            Login
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
