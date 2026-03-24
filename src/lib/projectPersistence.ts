type ProjectStack = { frontend: string[]; backend: string[]; database: string[] } | null;

export interface PersistedProject {
  id: string;
  user_id: string;
  name: string;
  prompt: string | null;
  mode: string;
  single_language: string | null;
  multi_stack: ProjectStack;
  status: string;
  preview_url: string | null;
  created_at: string;
  updated_at: string;
  last_opened_at?: string | null;
  repo_url?: string | null;
  share_url?: string | null;
  builder_state?: Record<string, unknown> | null;
}

export function getProjectsStorageKey(userId: string) {
  return `mycodex_projects_${userId}`;
}

export function readLocalProjects(userId: string): PersistedProject[] {
  try {
    const raw = localStorage.getItem(getProjectsStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeLocalProjects(userId: string, projects: PersistedProject[]) {
  localStorage.setItem(getProjectsStorageKey(userId), JSON.stringify(projects));
}

export function upsertLocalProject(userId: string, project: PersistedProject) {
  const existing = readLocalProjects(userId);
  const next = [project, ...existing.filter((item) => item.id !== project.id)].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
  writeLocalProjects(userId, next);
  console.log("Project saved", project.id);
}

export function removeLocalProject(userId: string, projectId: string) {
  const existing = readLocalProjects(userId);
  writeLocalProjects(
    userId,
    existing.filter((item) => item.id !== projectId),
  );
}

export function mergeProjects(
  backendProjects: PersistedProject[],
  localProjects: PersistedProject[],
) {
  const merged = new Map<string, PersistedProject>();

  for (const project of localProjects) {
    merged.set(project.id, project);
  }

  for (const project of backendProjects) {
    merged.set(project.id, {
      ...merged.get(project.id),
      ...project,
    });
  }

  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
}