import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getPreAuthDraft } from "@/lib/preAuthDraft";
import { sanitizeAuthError } from "@/lib/auth-errors";
import { lovable } from "@/integrations/lovable/index";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const AuthGate = () => {
  const draft = getPreAuthDraft();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const [view, setView] = useState<"choice" | "login" | "signup">("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogle = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Google Sign-In Failed", description: String(error), variant: "destructive" });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) {
      toast({ title: "Login Failed", description: sanitizeAuthError(error), variant: "destructive" });
      return;
    }
    // Auth state change in AuthContext will trigger resume via useEffect in this component
    // but we navigate immediately since signIn resolved successfully
    navigate("/");
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    const { error } = await signUp(email, password, displayName || undefined);
    setIsLoading(false);
    if (error) {
      toast({ title: "Sign Up Failed", description: sanitizeAuthError(error), variant: "destructive" });
      return;
    }
    toast({ title: "Check your email", description: "We sent you a confirmation link. Please verify to continue." });
  };

  // No draft — user arrived directly
  if (!draft) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No draft found.</p>
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Go back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-card/60 backdrop-blur-2xl border border-border/60 rounded-2xl p-8 shadow-xl">
          {view === "choice" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Continue to generate</h1>
                <p className="text-sm text-muted-foreground">
                  Sign up or log in to save your project and continue building.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleGoogle}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setView("signup")}
                  className="w-full h-11 border-border/60 hover:border-primary/40"
                >
                  Continue with Email
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card/60 px-3 text-muted-foreground">or</span>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => setView("login")} className="text-primary hover:underline font-medium">
                  Log in
                </button>
              </p>

              <p className="text-center text-xs text-muted-foreground/60">
                We'll bring your prompt back after you sign in.
              </p>
            </div>
          )}

          {view === "login" && (
            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <button type="button" onClick={() => setView("choice")} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-xl font-bold text-foreground">Log in</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-foreground">Email</Label>
                <Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="bg-secondary/50 border-border focus:border-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="bg-secondary/50 border-border focus:border-primary pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? "Signing in…" : "Sign In"}
              </Button>
              <p className="text-center text-xs text-muted-foreground/60">We'll bring your prompt back after you sign in.</p>
            </form>
          )}

          {view === "signup" && (
            <form onSubmit={handleEmailSignup} className="space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <button type="button" onClick={() => setView("choice")} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-xl font-bold text-foreground">Create account</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-foreground">Display Name</Label>
                <Input id="signup-name" placeholder="Your name" value={displayName} onChange={e => setDisplayName(e.target.value)} className="bg-secondary/50 border-border focus:border-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="bg-secondary/50 border-border focus:border-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="bg-secondary/50 border-border focus:border-primary pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? "Creating account…" : "Create Account"}
              </Button>
              <p className="text-center text-xs text-muted-foreground/60">We'll bring your prompt back after you sign in.</p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthGate;
