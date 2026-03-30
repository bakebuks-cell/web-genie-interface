import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { sanitizeAuthError } from "@/lib/auth-errors";
import { lovable } from "@/integrations/lovable/index";
import signupVisual from "@/assets/signup-visual.jpg";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({ title: "Google Sign Up Failed", description: "Login failed, please try again.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Google Sign Up Failed", description: "Login failed, please try again.", variant: "destructive" });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast({ title: "Missing Fields", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Weak Password", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password, name);

    if (error) {
      toast({ title: "Sign Up Failed", description: sanitizeAuthError(error), variant: "destructive" });
      setIsLoading(false);
      return;
    }

    toast({ title: "Account Created", description: "Welcome to MyCodex!" });
    setIsLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div
          className="w-full max-w-5xl flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-border/50"
          style={{ background: "rgba(20, 24, 30, 0.7)", backdropFilter: "blur(20px)" }}
        >
          {/* Left side — visual + quote (desktop only) */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center relative overflow-hidden">
            {/* Background image */}
            <img
              src={signupVisual}
              alt="MyCodex signup visual"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              width={960}
              height={1024}
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-background/30" />

            {/* Quote content */}
            <div className="relative z-10 p-10 xl:p-14 flex flex-col justify-end h-full">
              <span className="font-bold text-lg text-primary tracking-wide mb-auto pt-2">MyCodex</span>

              <div className="mb-4">
                <h2 className="text-3xl xl:text-4xl font-bold text-foreground leading-tight mb-3">
                  Start building what<br />you imagine.
                </h2>
                <p className="text-muted-foreground/80 text-sm max-w-xs">
                  Create powerful applications with just your ideas.
                </p>
              </div>
            </div>
          </div>

          {/* Right side — sign up form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-10 xl:p-14">
            {/* Mobile brand */}
            <div className="flex items-center justify-center mb-6 lg:hidden">
              <span className="font-bold text-2xl text-primary">MyCodex</span>
            </div>

            <h1 className="text-2xl font-bold text-foreground text-center lg:text-left mb-1">
              Create Account
            </h1>
            <p className="text-muted-foreground text-sm text-center lg:text-left mb-8">
              Start building powerful web applications
            </p>

            {/* Google OAuth */}
            <Button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
              className="w-full h-11 bg-secondary/50 border border-border hover:border-primary/50 hover:bg-secondary/70 text-foreground font-medium transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isGoogleLoading ? "Connecting…" : "Continue with Google"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/80 px-3 text-muted-foreground" style={{ background: "rgba(20, 24, 30, 0.9)" }}>
                  or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground text-sm">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary/30 border-border/50 focus:border-primary h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/30 border-border/50 focus:border-primary h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground text-sm">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/30 border-border/50 focus:border-primary pr-10 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground text-sm">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-secondary/30 border-border/50 focus:border-primary h-11"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
