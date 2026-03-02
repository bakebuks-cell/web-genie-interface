const STORAGE_KEY = "mycodex_pre_auth_draft";
const MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

export interface PreAuthDraft {
  prompt: string;
  mode: "single" | "multi";
  singleLanguage: string | null;
  multiStack: string[];
  timestamp: number;
}

export function savePreAuthDraft(draft: Omit<PreAuthDraft, "timestamp">) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...draft, timestamp: Date.now() })
  );
}

export function getPreAuthDraft(): PreAuthDraft | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const draft: PreAuthDraft = JSON.parse(raw);
    if (Date.now() - draft.timestamp > MAX_AGE_MS) {
      clearPreAuthDraft();
      return null;
    }
    return draft;
  } catch {
    clearPreAuthDraft();
    return null;
  }
}

export function clearPreAuthDraft() {
  localStorage.removeItem(STORAGE_KEY);
}
