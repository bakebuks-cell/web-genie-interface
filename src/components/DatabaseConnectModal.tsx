import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Database, Server, ChevronRight, ChevronDown, Check, ArrowLeft, Loader2, Copy, ExternalLink, ClipboardCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDbStore, type SchemaTable } from "@/stores/useDbStore";

// ── Schema heuristics ─────────────────────────
function generateSchema(prompt: string): { tables: SchemaTable[]; sql: string } {
  const p = prompt.toLowerCase();
  let tables: SchemaTable[] = [];

  if (p.match(/blog|article|post/)) {
    tables = [
      { name: "users", fields: [{ name: "id", type: "uuid" }, { name: "email", type: "text" }, { name: "display_name", type: "text", nullable: true }, { name: "created_at", type: "timestamptz" }] },
      { name: "posts", fields: [{ name: "id", type: "uuid" }, { name: "author_id", type: "uuid" }, { name: "title", type: "text" }, { name: "content", type: "text" }, { name: "published", type: "boolean" }, { name: "created_at", type: "timestamptz" }] },
      { name: "comments", fields: [{ name: "id", type: "uuid" }, { name: "post_id", type: "uuid" }, { name: "user_id", type: "uuid" }, { name: "body", type: "text" }, { name: "created_at", type: "timestamptz" }] },
    ];
  } else if (p.match(/shop|store|ecommerce|e-commerce|product|cart/)) {
    tables = [
      { name: "users", fields: [{ name: "id", type: "uuid" }, { name: "email", type: "text" }, { name: "name", type: "text" }, { name: "created_at", type: "timestamptz" }] },
      { name: "products", fields: [{ name: "id", type: "uuid" }, { name: "name", type: "text" }, { name: "description", type: "text", nullable: true }, { name: "price", type: "numeric" }, { name: "image_url", type: "text", nullable: true }, { name: "created_at", type: "timestamptz" }] },
      { name: "orders", fields: [{ name: "id", type: "uuid" }, { name: "user_id", type: "uuid" }, { name: "total", type: "numeric" }, { name: "status", type: "text" }, { name: "created_at", type: "timestamptz" }] },
      { name: "order_items", fields: [{ name: "id", type: "uuid" }, { name: "order_id", type: "uuid" }, { name: "product_id", type: "uuid" }, { name: "quantity", type: "integer" }, { name: "price", type: "numeric" }] },
    ];
  } else if (p.match(/dashboard|admin|analytics|crm/)) {
    tables = [
      { name: "users", fields: [{ name: "id", type: "uuid" }, { name: "email", type: "text" }, { name: "role", type: "text" }, { name: "created_at", type: "timestamptz" }] },
      { name: "roles", fields: [{ name: "id", type: "uuid" }, { name: "name", type: "text" }, { name: "permissions", type: "jsonb" }] },
      { name: "activity_logs", fields: [{ name: "id", type: "uuid" }, { name: "user_id", type: "uuid" }, { name: "action", type: "text" }, { name: "metadata", type: "jsonb", nullable: true }, { name: "created_at", type: "timestamptz" }] },
    ];
  } else if (p.match(/chat|message|messenger/)) {
    tables = [
      { name: "users", fields: [{ name: "id", type: "uuid" }, { name: "email", type: "text" }, { name: "avatar_url", type: "text", nullable: true }, { name: "created_at", type: "timestamptz" }] },
      { name: "conversations", fields: [{ name: "id", type: "uuid" }, { name: "name", type: "text", nullable: true }, { name: "created_at", type: "timestamptz" }] },
      { name: "messages", fields: [{ name: "id", type: "uuid" }, { name: "conversation_id", type: "uuid" }, { name: "sender_id", type: "uuid" }, { name: "content", type: "text" }, { name: "created_at", type: "timestamptz" }] },
    ];
  } else {
    tables = [
      { name: "users", fields: [{ name: "id", type: "uuid" }, { name: "email", type: "text" }, { name: "name", type: "text", nullable: true }, { name: "created_at", type: "timestamptz" }] },
      { name: "items", fields: [{ name: "id", type: "uuid" }, { name: "user_id", type: "uuid" }, { name: "title", type: "text" }, { name: "description", type: "text", nullable: true }, { name: "status", type: "text" }, { name: "created_at", type: "timestamptz" }] },
    ];
  }

  const sql = tables
    .map(
      (t) =>
        `CREATE TABLE IF NOT EXISTS public.${t.name} (\n${t.fields
          .map((f) => `  ${f.name} ${f.type}${f.name === "id" ? " PRIMARY KEY DEFAULT gen_random_uuid()" : ""}${!f.nullable && f.name !== "id" ? " NOT NULL" : ""}${f.name === "created_at" ? " DEFAULT now()" : ""}`)
          .join(",\n")}\n);`
    )
    .join("\n\n") + "\n\n-- Enable Row Level Security\n" + tables.map(t => `ALTER TABLE public.${t.name} ENABLE ROW LEVEL SECURITY;`).join("\n");

  return { tables, sql };
}

// ── URL validation ──
function isValidSupabaseUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return u.hostname.endsWith("supabase.co");
  } catch {
    return false;
  }
}

function maskKey(key: string): string {
  if (key.length <= 12) return "****";
  return key.slice(0, 8) + "..." + key.slice(-4);
}

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
  prompt: string;
}

const DatabaseConnectModal = ({ open, onClose, projectId, prompt }: Props) => {
  const { connectSupabase, applySchema, getProjectDb } = useDbStore();
  const db = getProjectDb(projectId);

  const [step, setStep] = useState<"connect" | "schema">(db.supabaseConnected ? "schema" : "connect");

  // Connect existing
  const [extUrl, setExtUrl] = useState(db.supabaseUrl || "");
  const [extKey, setExtKey] = useState(db.supabaseAnonKey || "");
  const [urlError, setUrlError] = useState("");
  const [keyError, setKeyError] = useState("");

  // Schema
  const schema = useMemo(() => generateSchema(prompt), [prompt]);
  const [schemaTab, setSchemaTab] = useState<"preview" | "sql">("preview");
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  const handleConnect = () => {
    const url = extUrl.trim();
    const key = extKey.trim();
    let valid = true;

    if (!url) {
      setUrlError("Project URL is required.");
      valid = false;
    } else if (!isValidSupabaseUrl(url)) {
      setUrlError("URL must be a valid Supabase project URL (*.supabase.co).");
      valid = false;
    } else {
      setUrlError("");
    }

    if (!key) {
      setKeyError("Anon key is required.");
      valid = false;
    } else if (key.length < 20) {
      setKeyError("This doesn't look like a valid anon key.");
      valid = false;
    } else {
      setKeyError("");
    }

    if (!valid) return;

    connectSupabase(projectId, url, key);
    toast.success("Supabase connected successfully.");
    setStep("schema");
  };

  const handleCopySql = async () => {
    await navigator.clipboard.writeText(schema.sql);
    setSqlCopied(true);
    toast.success("SQL copied to clipboard.");
    setTimeout(() => setSqlCopied(false), 3000);
  };

  const handleOpenSqlEditor = () => {
    const url = db.supabaseUrl || extUrl.trim();
    // Extract project ref from URL
    try {
      const hostname = new URL(url).hostname;
      const ref = hostname.split(".")[0];
      window.open(`https://supabase.com/dashboard/project/${ref}/sql/new`, "_blank");
    } catch {
      window.open("https://supabase.com/dashboard/project/_/sql/new", "_blank");
    }
  };

  const handleConfirmRan = () => {
    applySchema(projectId, schema.tables, schema.sql);
    toast.success("Schema applied (confirmed).");
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  {step === "connect" ? "Connect Supabase" : "Generate database schema"}
                </h2>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {step === "connect" ? (
              <div className="p-6 space-y-5">
                <p className="text-sm text-muted-foreground">
                  Enter your Supabase project credentials. You can find these in your Supabase Dashboard under Settings &rarr; API.
                </p>

                {/* URL field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Supabase Project URL</label>
                  <Input
                    value={extUrl}
                    onChange={(e) => { setExtUrl(e.target.value); setUrlError(""); }}
                    placeholder="https://your-project.supabase.co"
                    className={`bg-secondary/30 border-border ${urlError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  {urlError && <p className="text-xs text-destructive">{urlError}</p>}
                </div>

                {/* Key field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Supabase Anon Key</label>
                  <Input
                    value={extKey}
                    onChange={(e) => { setExtKey(e.target.value); setKeyError(""); }}
                    placeholder="eyJhbGciOiJIUzI1NiIs..."
                    className={`bg-secondary/30 border-border font-mono text-xs ${keyError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  {keyError && <p className="text-xs text-destructive">{keyError}</p>}
                  <p className="text-[11px] text-muted-foreground">
                    Only the public anon key is needed. Never share your service role key.
                  </p>
                </div>

                <Button onClick={handleConnect} className="w-full">Connect</Button>
              </div>
            ) : (
              /* Schema step */
              <div className="p-6 space-y-4">
                {/* Connected badge */}
                {db.supabaseConnected && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs font-medium text-primary">Connected to Supabase</span>
                    <span className="text-xs text-muted-foreground ml-auto font-mono">{maskKey(db.supabaseAnonKey)}</span>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  We generated a schema based on your prompt. Copy the SQL and run it in your Supabase SQL Editor.
                </p>

                {/* Schema / SQL tabs */}
                <div className="flex gap-1 p-1 bg-secondary/40 rounded-lg">
                  {(["preview", "sql"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSchemaTab(t)}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        schemaTab === t
                          ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_10px_rgba(0,230,210,0.15)]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t === "preview" ? "Schema Preview" : "SQL Migration"}
                    </button>
                  ))}
                </div>

                {schemaTab === "preview" ? (
                  /* Tables list */
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {schema.tables.map((table) => (
                      <div key={table.name} className="border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedTable(expandedTable === table.name ? null : table.name)}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Server className="w-3.5 h-3.5 text-primary" />
                            <span>{table.name}</span>
                            <span className="text-xs text-muted-foreground">({table.fields.length} columns)</span>
                          </div>
                          {expandedTable === table.name ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                        </button>
                        <AnimatePresence>
                          {expandedTable === table.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-3 space-y-1 border-t border-border/50 pt-2">
                                {table.fields.map((f) => (
                                  <div key={f.name} className="flex items-center gap-3 text-xs">
                                    <span className="text-foreground/80 font-mono w-32 truncate">{f.name}</span>
                                    <span className="text-muted-foreground">{f.type}</span>
                                    {f.nullable && <span className="text-muted-foreground/50 text-[10px]">nullable</span>}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* SQL view */
                  <div className="space-y-3">
                    <div className="relative">
                      <pre className="text-xs font-mono text-foreground/70 bg-secondary/30 border border-border rounded-lg p-3 max-h-48 overflow-auto whitespace-pre-wrap">
                        {schema.sql}
                      </pre>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopySql} className="flex items-center gap-2">
                        {sqlCopied ? <ClipboardCheck className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                        {sqlCopied ? "Copied" : "Copy SQL"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleOpenSqlEditor} className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open SQL Editor
                      </Button>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-secondary/20 border border-border/50 rounded-lg p-3 space-y-1.5">
                  <p className="text-xs font-semibold text-foreground">How to apply:</p>
                  <ol className="text-xs text-muted-foreground list-decimal list-inside space-y-1">
                    <li>Open your Supabase Dashboard &rarr; SQL Editor</li>
                    <li>Paste the SQL from the "SQL Migration" tab</li>
                    <li>Click "Run" in the SQL Editor</li>
                    <li>Come back here and click "I ran it"</li>
                  </ol>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <Button variant="outline" onClick={() => setStep("connect")} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopySql} className="flex items-center gap-2">
                    {sqlCopied ? <ClipboardCheck className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy SQL
                  </Button>
                  <Button onClick={handleConfirmRan} className="flex-1 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    I ran it
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DatabaseConnectModal;
