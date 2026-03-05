import { Database, Server, Check, XCircle } from "lucide-react";
import { useDbStore } from "@/stores/useDbStore";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  projectId: string;
}

const DatabasePanel = ({ projectId }: Props) => {
  const db = useDbStore((s) => s.getProjectDb(projectId));

  if (!db.supabaseConnected) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-background rounded-2xl border border-border">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <Database className="w-7 h-7 text-primary/60" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Database Connected</h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Connect a database from the toolbar to view tables and schema here.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Database</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-primary font-medium">Connected</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3 border-b border-border space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Provider:</span>
          <span className="text-foreground font-medium">Supabase</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Schema:</span>
          {db.schemaApplied ? (
            <span className="flex items-center gap-1 text-primary font-medium"><Check className="w-3 h-3" /> Applied</span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground"><XCircle className="w-3 h-3" /> Not applied</span>
          )}
        </div>
      </div>

      {/* Tables */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-3 space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tables</span>
          {db.schemaJson.length === 0 ? (
            <p className="text-xs text-muted-foreground">No tables yet.</p>
          ) : (
            db.schemaJson.map((table) => (
              <div key={table.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/30 border border-border/50">
                <Server className="w-3.5 h-3.5 text-primary/70" />
                <span className="text-sm text-foreground">{table.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{table.fields.length} cols</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Keys notice */}
      <div className="px-4 py-2.5 border-t border-border bg-secondary/20">
        <p className="text-[11px] text-muted-foreground">Keys are stored securely per project.</p>
      </div>
    </div>
  );
};

export default DatabasePanel;
