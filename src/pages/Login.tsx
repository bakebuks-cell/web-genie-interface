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
import loginVisual from "@/assets/login-visual.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({
          title: "Google Sign In Failed",
          description: "Login failed, please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Google Sign In Failed",
        description: "Login failed, please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: sanitizeAuthError(error),
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    toast({
      title: "Login Successful",
      description: "Welcome back to MyCodex!",
    });
    
    setIsLoading(false);
    navigate("/");
  };

  return (
    <div className="w-full flex flex-col">
      <main className="flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-border/50"
          style={{ background: "rgba(20, 24, 30, 0.7)", backdropFilter: "blur(20px)" }}>
          
          {/* Left side — visual panel (hidden on mobile, shown on lg+) */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-8 xl:p-10 relative overflow-hidden">
            {/* Subtle glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            
            <div className="relative z-10">
              <span className="font-bold text-lg text-primary tracking-wide">MyCodex</span>
              <h2 className="text-3xl xl:text-4xl font-bold text-foreground mt-4 mb-3 leading-tight">
                Welcome back
              </h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm">
                Sign in to continue building powerful applications with AI-driven code generation.
              </p>

              {/* Product visual */}
              <div className="rounded-xl overflow-hidden border border-border/30 shadow-[0_0_40px_rgba(0,255,200,0.08)]">
                <img
                  src={loginVisual}
                  alt="MyCodex builder interface"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  width={960}
                  height={1024}
                />
              </div>
            </div>
          </div>

          {/* Right side — login form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 xl:p-10">
            {/* Mobile brand */}
            <div className="flex items-center justify-center mb-6 lg:hidden">
              <span className="font-bold text-2xl text-primary">MyCodex</span>
            </div>

            <h1 className="text-2xl font-bold text-foreground text-center lg:text-left mb-1">
              Sign In
            </h1>
            <p className="text-muted-foreground text-sm text-center lg:text-left mb-6">
              Enter your credentials to access your account
            </p>

            {/* Google OAuth */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
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
                <span className="bg-background/80 px-3 text-muted-foreground" style={{ background: "rgba(20, 24, 30, 0.9)" }}>or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Get Started
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
