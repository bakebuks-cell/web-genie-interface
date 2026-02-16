import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Search, Layers } from "lucide-react";

interface MultiProgramModalProps {
  open: boolean;
  onClose: () => void;
  selectedStacks: string[];
  onApply: (stacks: string[]) => void;
}

const stackSections = [
  {
    label: "Frontend Stack",
    items: [
      { id: "react", name: "React", icon: "⚛️" },
      { id: "vue", name: "Vue.js", icon: "💚" },
      { id: "angular", name: "Angular", icon: "🅰️" },
      { id: "nextjs", name: "Next.js", icon: "▲" },
    ],
  },
  {
    label: "Backend Stack",
    items: [
      { id: "nodejs", name: "Node.js", icon: "🟢" },
      { id: "django", name: "Django", icon: "🐍" },
      { id: "springboot", name: "Spring Boot", icon: "🍃" },
      { id: "aspnet", name: "ASP.NET", icon: "🔷" },
      { id: "laravel", name: "PHP (Laravel)", icon: "🐘" },
    ],
  },
  {
    label: "Database",
    items: [
      { id: "postgresql", name: "PostgreSQL", icon: "🐘" },
      { id: "mysql", name: "MySQL", icon: "🐬" },
      { id: "mongodb", name: "MongoDB", icon: "🍃" },
      { id: "supabase", name: "Supabase", icon: "⚡" },
    ],
  },
];

const allItems = stackSections.flatMap((s) => s.items);

const MultiProgramModal = ({ open, onClose, selectedStacks, onApply }: MultiProgramModalProps) => {
  const [selected, setSelected] = useState<string[]>(selectedStacks);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      setSelected(selectedStacks);
      setSearch("");
    }
  }, [open, selectedStacks]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const filteredSections = useMemo(() => {
    if (!search.trim()) return stackSections;
    const q = search.toLowerCase();
    return stackSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.name.toLowerCase().includes(q)),
      }))
      .filter((section) => section.items.length > 0);
  }, [search]);

  const selectedNames = selected.map((id) => allItems.find((i) => i.id === id)?.name).filter(Boolean);

  // Render via portal to document.body so it's never clipped
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden max-h-[80vh] flex flex-col"
            style={{
              background: "rgba(20, 24, 30, 0.95)",
              border: "1px solid rgba(0, 230, 210, 0.3)",
              boxShadow: "0 0 40px rgba(0, 230, 210, 0.15), 0 0 80px rgba(0, 230, 210, 0.05)",
            }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Select your stack</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 pb-4 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search technologies…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-secondary/30 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>

            {/* Sections - scrollable */}
            <div className="px-6 pb-4 overflow-y-auto scrollbar-hide space-y-5 flex-1 min-h-0">
              {filteredSections.map((section, idx) => (
                <div key={section.label}>
                  {idx > 0 && <div className="border-t border-border/20 mb-4" />}
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    {section.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item) => {
                      const isSelected = selected.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggle(item.id)}
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                            border transition-all duration-200
                            ${isSelected
                              ? "bg-primary/15 border-primary/40 text-foreground shadow-[0_0_12px_rgba(0,230,210,0.2)]"
                              : "bg-secondary/20 border-border/40 text-muted-foreground hover:border-primary/30 hover:bg-secondary/40"
                            }
                          `}
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-primary ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {filteredSections.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No technologies found.</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/20 shrink-0">
              {selected.length > 0 && (
                <p className="text-xs text-muted-foreground mb-3">
                  Selected: <span className="text-foreground">{selectedNames.join(" • ")}</span>
                </p>
              )}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground bg-secondary/30 border border-border/40 hover:bg-secondary/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { onApply(selected); onClose(); }}
                  className="px-5 py-2 rounded-xl text-sm font-medium text-primary-foreground transition-all hover:opacity-90 shadow-[0_0_20px_rgba(0,255,200,0.3)]"
                  style={{ background: "linear-gradient(90deg, #00f0ff, #00c8a0)" }}
                >
                  Apply Stack
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MultiProgramModal;
