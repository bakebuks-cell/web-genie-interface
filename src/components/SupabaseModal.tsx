import { useState } from "react";
import { Database, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SupabaseModalProps {
  open: boolean;
  onClose: () => void;
  connected: boolean;
  onToggleConnection: (connected: boolean) => void;
  supabaseUrl: string;
  onSupabaseUrlChange: (url: string) => void;
  supabaseAnonKey: string;
  onSupabaseAnonKeyChange: (key: string) => void;
}

const SupabaseModal = ({
  open,
  onClose,
  connected,
  onToggleConnection,
  supabaseUrl,
  onSupabaseUrlChange,
  supabaseAnonKey,
  onSupabaseAnonKeyChange,
}: SupabaseModalProps) => {
  const [useSupabase, setUseSupabase] = useState(connected);

  const handleConnect = () => {
    onToggleConnection(true);
    setUseSupabase(true);
    onClose();
  };

  const handleDisconnect = () => {
    onToggleConnection(false);
    setUseSupabase(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-primary/20 p-6"
            style={{
              background: "linear-gradient(135deg, rgba(20,24,30,0.98) 0%, rgba(10,14,20,0.98) 100%)",
              boxShadow: "0 0 40px rgba(0,230,210,0.1), 0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Supabase Database</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/30 bg-secondary/20 mb-4">
              <Label htmlFor="use-supabase" className="text-sm font-medium text-foreground cursor-pointer">
                Use Supabase for this project
              </Label>
              <Switch
                id="use-supabase"
                checked={useSupabase}
                onCheckedChange={setUseSupabase}
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-5 px-1">
              <div className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-primary" : "bg-muted-foreground/40"}`} />
              <span className="text-sm text-muted-foreground">
                Status: {connected ? "Connected" : "Not connected"}
              </span>
            </div>

            {/* Inputs */}
            <div className="space-y-3 mb-6">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Supabase Project URL</Label>
                <Input
                  placeholder="https://your-project.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => onSupabaseUrlChange(e.target.value)}
                  className="bg-secondary/30 border-border/50 text-sm h-9 focus:border-primary/50"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Supabase Anon Key</Label>
                <Input
                  placeholder="eyJhbGciOiJIUz..."
                  value={supabaseAnonKey}
                  onChange={(e) => onSupabaseAnonKeyChange(e.target.value)}
                  className="bg-secondary/30 border-border/50 text-sm h-9 focus:border-primary/50"
                  type="password"
                />
              </div>
            </div>

            {/* Action */}
            {connected ? (
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                className="w-full"
              >
                <Check className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SupabaseModal;
