import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Database, Server, ChevronRight, ChevronDown, Check, ArrowLeft, Loader2, Copy } from "lucide-react";
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
    // Generic fallback
    tables = [
      { name: "users", fields: [{ name: "id", type: "uuid" }, { name: "email", type: "text" }, { name: "name", type: "text", nullable: true }, { name: "created_at", type: "timestamptz" }] },
      { name: "items", fields: [{ name: "id", type: "uuid" }, { name: "user_id", type: "uuid" }, { name: "title", type: "text" }, { name: "description", type: "text", nullable: true }, { name: "status", type: "text" }, { name: "created_at", type: "timestamptz" }] },
    ];
  }

  const sql = tables
    .map(
      (t) =>
        `CREATE TABLE public.${t.name} (\n${t.fields
          .map((f) => `  ${f.name} ${f.type}${f.name === "id" ? " PRIMARY KEY DEFAULT gen_random_uuid()" : ""}${!f.nullable && f.name !== "id" ? " NOT NULL" : ""}`)
          .join(",\n")}\n);`
    )
    .join("\n\n");

  return { tables, sql };
}

// ── Regions ──
const REGIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-west-1", label: "US West (N. California)" },
  { value: "eu-west-1", label: "EU West (Ireland)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
];

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
  const [tab, setTab] = useState<"create" | "existing">("create");

  // Create new
  const [dbName, setDbName] = useState("");
  const [region, setRegion] = useState(REGIONS[0].value);
  const [creating, setCreating] = useState(false);

  // Connect existing
  const [extUrl, setExtUrl] = useState("");
  const [extKey, setExtKey] = useState("");

  // Schema
  const schema = useMemo(() => generateSchema(prompt), [prompt]);
  const [showSql, setShowSql] = useState(false);
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const handleCreate = async () => {
    if (!dbName.trim()) { toast.error("Enter a project name."); return; }
    setCreating(true);
    // Mock creation
    await new Promise((r) => setTimeout(r, 1500));
    const mockUrl = `https://${dbName.toLowerCase().replace(/\s+/g, "-")}.supabase.co`;
    const mockKey = "eyJ...mock_anon_key";
    connectSupabase(projectId, mockUrl, mockKey);
    setCreating(false);
    setStep("schema");
  };

  const handleConnect = () => {
    if (!extUrl.trim() || !extKey.trim()) { toast.error("Both fields are required."); return; }
    connectSupabase(projectId, extUrl.trim(), extKey.trim());
    setStep("schema");
  };

  const handleApplySchema = async () => {
    setApplying(true);
    await new Promise((r) => setTimeout(r, 1200));
    applySchema(projectId, schema.tables, schema.sql);
    setApplying(false);
    toast.success("Database schema applied.");
    onClose();
  };

  const handleCopySql = async () => {
    await navigator.clipboard.writeText(schema.sql);
    toast.success("SQL copied.");
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
                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-secondary/40 rounded-lg">
                  {(["create", "existing"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        tab === t
                          ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_10px_rgba(0,230,210,0.15)]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t === "create" ? "Create new database" : "Connect existing"}
                    </button>
                  ))}
                </div>

                {tab === "create" ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">MyCodex will create a Supabase project for you.</p>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Project name</label>
                      <Input value={dbName} onChange={(e) => setDbName(e.target.value)} placeholder="my-awesome-db" className="bg-secondary/30 border-border" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Region</label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full h-10 rounded-md border border-border bg-secondary/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {REGIONS.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                    <Button onClick={handleCreate} disabled={creating} className="w-full">
                      {creating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...</> : "Create Database"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Enter your Supabase project credentials.</p>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Supabase Project URL</label>
                      <Input value={extUrl} onChange={(e) => setExtUrl(e.target.value)} placeholder="https://xyz.supabase.co" className="bg-secondary/30 border-border" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Supabase Anon Key</label>
                      <Input value={extKey} onChange={(e) => setExtKey(e.target.value)} placeholder="eyJ..." className="bg-secondary/30 border-border font-mono text-xs" />
                    </div>
                    <Button onClick={handleConnect} className="w-full">Connect</Button>
                  </div>
                )}
              </div>
            ) : (
              /* Schema step */
              <div className="p-6 space-y-5">
                <p className="text-sm text-muted-foreground">We will create tables based on your prompt.</p>

                {/* Tables list */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
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

                {/* SQL toggle */}
                <div>
                  <button
                    onClick={() => setShowSql(!showSql)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {showSql ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    {showSql ? "Hide SQL preview" : "Show SQL preview"}
                  </button>
                  <AnimatePresence>
                    {showSql && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="relative mt-2">
                          <pre className="text-xs font-mono text-foreground/70 bg-secondary/30 border border-border rounded-lg p-3 max-h-40 overflow-auto whitespace-pre-wrap">
                            {schema.sql}
                          </pre>
                          <button onClick={handleCopySql} className="absolute top-2 right-2 p-1 rounded text-muted-foreground hover:text-primary transition-colors" title="Copy SQL">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep("connect")} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button onClick={handleApplySchema} disabled={applying} className="flex-1">
                    {applying ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Applying...</> : "Apply to database"}
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
