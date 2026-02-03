import { motion } from "framer-motion";
import { Zap } from "lucide-react";

type BuildStatus = "initializing" | "analyzing" | "building" | "optimizing" | "deploying" | "ready";

interface FuturisticHeaderProps {
  status: BuildStatus;
  elapsedTime: number;
  eta: number;
}

const statusConfig: Record<BuildStatus, { label: string; color: string; glow: string }> = {
  initializing: { label: "INITIALIZING", color: "text-cyan-400", glow: "shadow-cyan-500/50" },
  analyzing: { label: "ANALYZING", color: "text-blue-400", glow: "shadow-blue-500/50" },
  building: { label: "BUILDING", color: "text-purple-400", glow: "shadow-purple-500/50" },
  optimizing: { label: "OPTIMIZING", color: "text-amber-400", glow: "shadow-amber-500/50" },
  deploying: { label: "DEPLOYING", color: "text-emerald-400", glow: "shadow-emerald-500/50" },
  ready: { label: "READY", color: "text-green-400", glow: "shadow-green-500/50" },
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const FuturisticHeader = ({ status, elapsedTime, eta }: FuturisticHeaderProps) => {
  const config = statusConfig[status];

  return (
    <div className="relative overflow-hidden">
      {/* Gradient background with scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
      
      {/* Animated glow line at top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <div className="relative px-6 py-4 flex items-center justify-between">
        {/* Left: Title & Subtitle */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
              AI App Factory
            </h1>
          </div>
          <p className="text-xs text-slate-400 ml-11">
            Generating your application in real-time...
          </p>
        </div>

        {/* Center: Status Badge */}
        <div className="flex items-center gap-4">
          <motion.div
            className={`px-4 py-1.5 rounded-full border backdrop-blur-sm flex items-center gap-2 ${config.color} border-current/30`}
            animate={{ boxShadow: [`0 0 10px rgba(0,0,0,0)`, `0 0 20px currentColor`, `0 0 10px rgba(0,0,0,0)`] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className={`w-2 h-2 rounded-full bg-current`}
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs font-bold tracking-wider">{config.label}</span>
          </motion.div>
        </div>

        {/* Right: Time & Live indicator */}
        <div className="flex items-center gap-6">
          {/* Elapsed & ETA */}
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Elapsed</span>
              <span className="text-sm font-mono text-cyan-400">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">ETA</span>
              <span className="text-sm font-mono text-purple-400">{formatTime(eta)}</span>
            </div>
          </div>

          {/* Live Indicator */}
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <span className="text-[10px] font-bold text-red-400 tracking-widest">LIVE</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FuturisticHeader;
