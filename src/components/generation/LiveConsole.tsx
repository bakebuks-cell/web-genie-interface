import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

interface LiveConsoleProps {
  logs: string[];
  isComplete: boolean;
}

const LiveConsole = ({ logs, isComplete }: LiveConsoleProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="relative p-6">
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.03)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Live Build Console
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
        </div>

        {/* Console body */}
        <div
          ref={scrollRef}
          className="h-48 overflow-y-auto font-mono text-xs p-4 space-y-1"
        >
          <AnimatePresence mode="popLayout">
            {logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-2"
              >
                <span className="text-slate-600 select-none">&gt;</span>
                <span
                  className={
                    log.includes("✅") || log.includes("complete")
                      ? "text-green-400"
                      : log.includes("→")
                      ? "text-cyan-400"
                      : log.includes("...")
                      ? "text-purple-400"
                      : "text-slate-400"
                  }
                >
                  {log}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Blinking cursor */}
          {!isComplete && (
            <motion.div
              className="flex items-center gap-2"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="text-slate-600">&gt;</span>
              <span className="w-2 h-4 bg-cyan-400" />
            </motion.div>
          )}
        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default LiveConsole;
