import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { getPreAuthDraft, clearPreAuthDraft } from "@/lib/preAuthDraft";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      console.log("[AuthCallback] session:", !!session, "error:", error?.message);

      if (error) {
        console.error("Auth callback error:", error);
        navigate("/login", { replace: true });
        return;
      }

      if (session) {
        // Check if there's a pre-auth draft to restore
        const draft = getPreAuthDraft();
        if (draft) {
          console.log("[AuthCallback] Restoring pre-auth draft, navigating to /generating");
          clearPreAuthDraft();
          navigate("/generating", {
            replace: true,
            state: {
              language: draft.singleLanguage || "react",
              idea: draft.prompt,
              mode: draft.mode,
              multiStack: draft.multiStack,
            },
          });
        } else {
          navigate("/projects", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Signing you in…</p>
      </div>
    </div>
  );
};

export default AuthCallback;
