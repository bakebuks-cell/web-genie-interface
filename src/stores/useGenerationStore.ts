/**
 * Persistent generation store — survives route changes and page refresh.
 * Keeps the current generation intent and result in both Zustand and localStorage.
 */
import { create } from "zustand";

const STORAGE_KEY = "mycodex_generation_state";

export type GenerationStatus = "idle" | "queued" | "building" | "ready" | "error";

export interface GenerationState {
  prompt: string;
  stack: string;
  mode: string;
  singleLanguage: string | null;
  multiStack: string[];
  dbProjectId: string | null;      // Supabase project row id
  backendProjectId: string | null;  // projectId returned by /build
  generatedUrl: string | null;
  status: GenerationStatus;
  error: string | null;
  startedAt: number | null;
}

interface GenerationStore extends GenerationState {
  /** Persist a new generation intent (called from HeroSection before navigating) */
  setIntent: (intent: Pick<GenerationState, "prompt" | "stack" | "mode" | "singleLanguage" | "multiStack" | "dbProjectId">) => void;
  /** Update after backend responds */
  setResult: (result: { backendProjectId: string; generatedUrl: string }) => void;
  /** Update status */
  setStatus: (status: GenerationStatus, error?: string) => void;
  /** Clear everything */
  reset: () => void;
  /** Restore from localStorage on mount */
  hydrate: () => void;
}

const INITIAL: GenerationState = {
  prompt: "",
  stack: "react",
  mode: "single",
  singleLanguage: null,
  multiStack: [],
  dbProjectId: null,
  backendProjectId: null,
  generatedUrl: null,
  status: "idle",
  error: null,
  startedAt: null,
};

function persist(state: GenerationState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full / unavailable — ignore
  }
}

function loadFromStorage(): GenerationState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GenerationState;
    // Expire after 30 minutes
    if (parsed.startedAt && Date.now() - parsed.startedAt > 30 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export const useGenerationStore = create<GenerationStore>((set, get) => ({
  ...INITIAL,

  setIntent: (intent) => {
    const next: GenerationState = {
      ...INITIAL,
      ...intent,
      status: "queued",
      startedAt: Date.now(),
    };
    persist(next);
    set(next);
    console.log("[GenerationStore] Intent saved:", next);
  },

  setResult: ({ backendProjectId, generatedUrl }) => {
    const next: GenerationState = {
      ...get(),
      backendProjectId,
      generatedUrl,
      status: "ready",
      error: null,
    };
    persist(next);
    set(next);
    console.log("[GenerationStore] Result saved:", { backendProjectId, generatedUrl });
  },

  setStatus: (status, error) => {
    const next: GenerationState = { ...get(), status, error: error ?? null };
    persist(next);
    set(next);
    console.log("[GenerationStore] Status updated:", status, error);
  },

  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    set(INITIAL);
  },

  hydrate: () => {
    const saved = loadFromStorage();
    if (saved) {
      set(saved);
      console.log("[GenerationStore] Hydrated from localStorage:", saved);
    }
  },
}));
