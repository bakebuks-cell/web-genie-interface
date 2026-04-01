import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, LogOut, ChevronRight, FolderOpen, CreditCard, Settings, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useProjects } from "@/hooks/useProjects";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, userCredits, isLoading, signOut } = useAuth();
  const { data: projects = [] } = useProjects();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user && profile) {
      const done = localStorage.getItem("onboarding_completed");
      const isNew = new Date(profile.created_at).getTime() > Date.now() - 60000;
      if (!done && isNew) setShowOnboarding(true);
    }
  }, [user, profile]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const planLabel = profile.plan === "pro" ? "Pro" : profile.plan === "enterprise" ? "Enterprise" : "Free";
  const isPaid = profile.plan !== "free";
  const creditsRemaining = userCredits?.credits_remaining ?? 0;
  const initials = (profile.display_name || user.email || "U").slice(0, 2).toUpperCase();
  const recentProjects = projects.slice(0, 3);
  const lastUpdated = projects.length > 0
    ? new Date(projects[0].updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

  return (
    <>
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} userName={profile.display_name || undefined} />

      <div className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* ── Account header ── */}
          <div className="flex items-center gap-4 p-5 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-base shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile.display_name || "MyCodex User"}
              </p>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                <Mail className="w-3 h-3 shrink-0" />
                {profile.email || user.email}
              </p>
            </div>
            <button
              onClick={() => navigate("/pricing")}
              className="text-xs font-medium px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors shrink-0"
            >
              {planLabel} plan
            </button>
          </div>

          {/* ── Quick stats ── */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-border/20 bg-card/20 text-center">
              <p className="text-lg font-semibold text-foreground">{projects.length}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Projects</p>
            </div>
            <div className="p-4 rounded-xl border border-border/20 bg-card/20 text-center">
              <p className="text-lg font-semibold text-foreground">{isPaid ? "∞" : creditsRemaining}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Credits left</p>
            </div>
            <div className="p-4 rounded-xl border border-border/20 bg-card/20 text-center">
              <p className="text-sm font-semibold text-foreground">{lastUpdated}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Last active</p>
            </div>
          </div>

          {/* ── Credits bar (free only) ── */}
          {!isPaid && (
            <div className="p-4 rounded-xl border border-border/20 bg-card/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-primary" /> Daily credits
                </span>
                <span className="text-xs text-muted-foreground">{creditsRemaining} / 5</span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(creditsRemaining / 5) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">Resets daily at midnight</p>
            </div>
          )}

          {/* ── Navigation links ── */}
          <div className="rounded-xl border border-border/20 bg-card/20 divide-y divide-border/10 overflow-hidden">
            {[
              { label: "Projects", sub: `${projects.length} saved`, icon: FolderOpen, action: () => navigate("/projects") },
              { label: "Billing & Plan", sub: `${planLabel} plan`, icon: CreditCard, action: () => navigate("/pricing") },
              { label: "Account Settings", sub: "Email, password", icon: Settings, action: () => {} },
              { label: "Security", sub: "Sign-in method", icon: Shield, action: () => {} },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-primary/5 transition-colors"
              >
                <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.sub}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
              </button>
            ))}
          </div>

          {/* ── Recent projects ── */}
          {recentProjects.length > 0 && (
            <div className="rounded-xl border border-border/20 bg-card/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-foreground">Recent projects</p>
                <button onClick={() => navigate("/projects")} className="text-[11px] text-primary hover:underline">
                  View all
                </button>
              </div>
              <div className="space-y-1">
                {recentProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate("/projects")}
                    className="w-full flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-primary/5 transition-colors text-left"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                    <span className="text-sm text-foreground/80 truncate flex-1">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{p.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="flex items-center justify-between pt-1 pb-4">
            <span className="text-[11px] text-muted-foreground">
              Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => { await signOut(); navigate("/"); }}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 h-8 text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;
