import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Crown, Zap, Mail, LogOut, ChevronRight, FolderOpen, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useProjects } from "@/hooks/useProjects";

const planMeta: Record<string, { label: string; color: string; bg: string }> = {
  free: { label: "Free", color: "text-muted-foreground", bg: "bg-secondary/50" },
  pro: { label: "Pro", color: "text-primary", bg: "bg-primary/10" },
  enterprise: { label: "Enterprise", color: "text-amber-400", bg: "bg-amber-500/10" },
};

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
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || !profile) return null;

  const plan = planMeta[profile.plan] ?? planMeta.free;
  const isUnlimited = profile.plan !== "free";
  const credits = isUnlimited ? "Unlimited" : `${userCredits?.credits_remaining ?? 0} / 5`;
  const initials = (profile.display_name || user.email || "U").slice(0, 2).toUpperCase();

  return (
    <Layout>
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} userName={profile.display_name || undefined} />

      <div className="min-h-screen pt-16 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* ── Profile header card ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-semibold text-lg shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-foreground truncate">
                  {profile.display_name || "MyCodex User"}
                </h1>
                <p className="text-sm text-muted-foreground truncate flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  {profile.email || user.email}
                </p>
              </div>
              <div className={`${plan.bg} ${plan.color} text-xs font-medium px-3 py-1 rounded-full border border-border/30 shrink-0`}>
                {plan.label}
              </div>
            </div>
          </motion.div>

          {/* ── Quick stats row ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { label: "Plan", value: plan.label, icon: Crown },
              { label: "Credits", value: credits, icon: Zap },
              { label: "Projects", value: String(projects.length), icon: FolderOpen },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-4 text-center">
                <s.icon className="w-4 h-4 text-primary mx-auto mb-2" />
                <p className="text-lg font-semibold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* ── Credits detail ── */}
          {!isUnlimited && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Daily Credits</span>
                <span className="text-sm text-muted-foreground">{credits}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((userCredits?.credits_remaining ?? 0) / 5) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">Resets daily at midnight</p>
            </motion.div>
          )}

          {/* ── Menu items ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm divide-y divide-border/20"
          >
            {[
              { label: "Your Projects", sub: `${projects.length} saved`, icon: FolderOpen, action: () => navigate("/projects") },
              { label: "Billing & Plan", sub: plan.label + " plan", icon: CreditCard, action: () => navigate("/pricing") },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-primary/5 transition-colors"
              >
                <item.icon className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </motion.div>

          {/* ── Recent projects ── */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-foreground">Recent Projects</h2>
                <button onClick={() => navigate("/projects")} className="text-xs text-primary hover:underline">View all</button>
              </div>
              <div className="space-y-2">
                {projects.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => navigate("/projects")}>
                    <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground truncate flex-1">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{p.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Footer actions ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-between pt-2"
          >
            <span className="text-xs text-muted-foreground">
              Joined {new Date(profile.created_at).toLocaleDateString()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => { await signOut(); navigate("/"); }}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
};

export default Profile;
