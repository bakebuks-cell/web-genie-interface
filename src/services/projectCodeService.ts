import type { GeneratedProjectResponse } from "@/types/projectCode";

const API_BASE = "https://api.mycodex.dev";

/**
 * Fetch generated project files from the backend.
 * Falls back to an empty file list on error (toast handled by caller).
 */
export async function fetchGeneratedProject(
  projectId: string
): Promise<GeneratedProjectResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${API_BASE}/project/${projectId}/files`, {
      credentials: "include",
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    return {
      projectId: data.projectId ?? projectId,
      files: Array.isArray(data.files) ? data.files : [],
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Request a shareable public link for a project.
 */
export async function generateShareLink(
  projectId: string
): Promise<{ shareUrl: string }> {
  const res = await fetch(`${API_BASE}/project/${projectId}/share`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }

  return res.json();
}

/**
 * Create or retrieve a GitHub repository for a project.
 */
export async function getOrCreateGitHubRepo(
  projectId: string
): Promise<{ repoUrl: string }> {
  const res = await fetch(`${API_BASE}/project/${projectId}/github`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }

  return res.json();
}
