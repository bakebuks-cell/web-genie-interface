import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeroBackground } from "@/components/HeroBackground";
import GenerationDashboard from "@/components/GenerationDashboard";
import { useGenerationStore } from "@/stores/useGenerationStore";
import { saveRecentProject } from "@/components/RecentProjectCard";
import { supabase } from "@/integrations/supabase/client";

const GeneratingPage = () => {
  const navigate = useNavigate();
  const store = useGenerationStore();
  const buildStarted = useRef(false);
  const [buildDone, setBuildDone] = useState(false);

  // Hydrate store from localStorage on mount (survives refresh)
  useEffect(() => {
    store.hydrate();
  }, []);

  // If no generation intent, redirect home
  useEffect(() => {
    // Small delay to let hydrate finish
    const t = setTimeout(() => {
      const { prompt, status } = useGenerationStore.getState();
      if (!prompt) {
        console.log("[GeneratingPage] No generation intent found, redirecting home");
        navigate("/", { replace: true });
      }
    }, 200);
    return () => clearTimeout(t);
  }, [navigate]);

  // Fire the actual build request
  useEffect(() => {
    if (buildStarted.current) return;

    const state = useGenerationStore.getState();
    if (!state.prompt || state.status === "ready") return;

    buildStarted.current = true;
    store.setStatus("building");
    console.log("[GeneratingPage] Starting backend build...", { prompt: state.prompt, stack: state.stack });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000);

    fetch("https://api.mycodex.dev/build", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include",
      body: JSON.stringify({ prompt: state.prompt, stack: state.stack }),
      signal: controller.signal,
    })
      .then(async (res) => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        console.log("[GeneratingPage] Build response:", data);

        if (data.success && data.url) {
          store.setResult({
            backendProjectId: data.projectId || "",
            generatedUrl: data.url,
          });

          // Update the Supabase project record with status + preview URL
          const dbId = useGenerationStore.getState().dbProjectId;
          if (dbId) {
            console.log("[GeneratingPage] Updating project in DB:", dbId);
            const { error: updateError } = await supabase
              .from("projects")
              .update({
                status: "ready",
                preview_url: data.url,
              })
              .eq("id", dbId);
            if (updateError) {
              console.error("[GeneratingPage] Failed to update project:", updateError);
            } else {
              console.log("[GeneratingPage] Project updated to ready in DB");
            }
          } else {
            console.warn("[GeneratingPage] No dbProjectId — project status not saved to DB");
          }

          // Save to recent projects (localStorage backup)
          saveRecentProject({
            projectId: data.projectId || Date.now().toString(),
            projectName: state.prompt.slice(0, 60) || "Untitled",
            promptText: state.prompt,
            mode: state.mode === "multi" ? "multi" : "single",
            singleLanguage: state.singleLanguage || state.stack,
            language: state.stack,
            idea: state.prompt,
            updatedAt: new Date().toISOString(),
          });

          setBuildDone(true);
        } else {
          store.setStatus("error", data.message || "Build failed");
          setBuildDone(true);
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        const msg = err.name === "AbortError" ? "Build timed out" : err.message;
        console.error("[GeneratingPage] Build error:", msg);
        store.setStatus("error", msg);
        setBuildDone(true);
      });

    return () => {
      clearTimeout(timeoutId);
    };
  }, [store.prompt]);

  const handleComplete = () => {
    const state = useGenerationStore.getState();
    console.log("[GeneratingPage] UI animation complete, navigating to /generate");
    navigate("/generate", {
      state: {
        language: state.stack,
        idea: state.prompt,
        generationMode: {
          mode: state.mode,
          singleLanguage: state.singleLanguage,
          multiStack: state.multiStack,
        },
      },
      replace: true,
    });
  };

  // If build finishes before the UI animation, wait for animation.
  // If animation finishes before build, wait for build.
  const handleAnimationComplete = () => {
    const state = useGenerationStore.getState();
    if (state.status === "ready" || state.status === "error") {
      handleComplete();
    }
    // Otherwise, the build effect will navigate when done
  };

  // Watch for build completing after animation
  useEffect(() => {
    if (buildDone) {
      // Small delay to show final step
      const t = setTimeout(() => handleComplete(), 800);
      return () => clearTimeout(t);
    }
  }, [buildDone]);

  if (!store.prompt) return null;

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center">
      <HeroBackground />
      <div className="relative z-10 w-full max-w-lg px-4">
        <GenerationDashboard
          language={store.stack}
          idea={store.prompt}
          onComplete={handleAnimationComplete}
        />
      </div>
    </div>
  );
};

export default GeneratingPage;
