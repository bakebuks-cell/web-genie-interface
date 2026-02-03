import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number;
  statusText: string;
}

const ProgressRing = ({ progress, statusText }: ProgressRingProps) => {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative p-6">
      {/* Glassmorphism container */}
      <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative flex flex-col items-center gap-6">
          {/* Circular Progress */}
          <div className="relative w-32 h-32">
            {/* Background ring with glow */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="45"
                fill="none"
                stroke="rgba(100,116,139,0.3)"
                strokeWidth="8"
              />
              {/* Animated progress ring */}
              <motion.circle
                cx="64"
                cy="64"
                r="45"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center percentage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                key={progress}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </div>

            {/* Orbiting dot */}
            <motion.div
              className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50"
              style={{ top: "50%", left: "50%", marginTop: -6, marginLeft: -6 }}
              animate={{
                rotate: 360,
                x: [0, 45, 0, -45, 0],
                y: [-45, 0, 45, 0, -45],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Horizontal progress bar */}
          <div className="w-full">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
              {/* Animated shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              {/* Progress fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/50 via-purple-400/50 to-cyan-400/50 blur-sm" />
              </motion.div>
            </div>
            
            {/* Status text */}
            <motion.p
              className="text-center text-sm text-slate-400 mt-3 font-medium"
              key={statusText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-cyan-400">{Math.round(progress)}%</span>
              <span className="mx-2">•</span>
              <span>{statusText}</span>
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressRing;
