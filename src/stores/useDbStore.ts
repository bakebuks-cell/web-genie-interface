import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SchemaTable {
  name: string;
  fields: { name: string; type: string; nullable?: boolean }[];
}

export interface DbState {
  /** Per-project DB config keyed by projectId */
  projects: Record<
    string,
    {
      databaseProvider: "supabase" | null;
      supabaseConnected: boolean;
      supabaseUrl: string;
      supabaseAnonKey: string;
      schemaApplied: boolean;
      schemaJson: SchemaTable[];
      schemaSql: string;
    }
  >;

  // Actions
  setProvider: (projectId: string, provider: "supabase" | null) => void;
  connectSupabase: (projectId: string, url: string, anonKey: string) => void;
  disconnect: (projectId: string) => void;
  applySchema: (projectId: string, tables: SchemaTable[], sql: string) => void;
  getProjectDb: (projectId: string) => DbState["projects"][string];
}

const defaultProjectDb = (): DbState["projects"][string] => ({
  databaseProvider: null,
  supabaseConnected: false,
  supabaseUrl: "",
  supabaseAnonKey: "",
  schemaApplied: false,
  schemaJson: [],
  schemaSql: "",
});

export const useDbStore = create<DbState>()(
  persist(
    (set, get) => ({
      projects: {},

      setProvider: (projectId, provider) =>
        set((s) => ({
          projects: {
            ...s.projects,
            [projectId]: {
              ...(s.projects[projectId] ?? defaultProjectDb()),
              databaseProvider: provider,
              ...(provider === null
                ? {
                    supabaseConnected: false,
                    supabaseUrl: "",
                    supabaseAnonKey: "",
                    schemaApplied: false,
                    schemaJson: [],
                    schemaSql: "",
                  }
                : {}),
            },
          },
        })),

      connectSupabase: (projectId, url, anonKey) =>
        set((s) => ({
          projects: {
            ...s.projects,
            [projectId]: {
              ...(s.projects[projectId] ?? defaultProjectDb()),
              databaseProvider: "supabase",
              supabaseConnected: true,
              supabaseUrl: url,
              supabaseAnonKey: anonKey,
            },
          },
        })),

      disconnect: (projectId) =>
        set((s) => ({
          projects: {
            ...s.projects,
            [projectId]: defaultProjectDb(),
          },
        })),

      applySchema: (projectId, tables, sql) =>
        set((s) => ({
          projects: {
            ...s.projects,
            [projectId]: {
              ...(s.projects[projectId] ?? defaultProjectDb()),
              schemaApplied: true,
              schemaJson: tables,
              schemaSql: sql,
            },
          },
        })),

      getProjectDb: (projectId) => get().projects[projectId] ?? defaultProjectDb(),
    }),
    { name: "mycodex_db_state" }
  )
);
