import { motion } from "framer-motion";

interface LivePreviewSkeletonProps {
  progress: number;
}

const LivePreviewSkeleton = ({ progress }: LivePreviewSkeletonProps) => {
  const showNav = progress >= 15;
  const showHero = progress >= 30;
  const showCards = progress >= 50;
  const showFooter = progress >= 75;
  const showColors = progress >= 90;

  return (
    <div className="relative p-6">
      <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Live UI Rendering
          </span>
        </div>

        {/* Preview Area */}
        <div className="p-4 h-56 bg-slate-950/50 relative overflow-hidden">
          {/* Browser chrome */}
          <div className="rounded-lg border border-slate-700/50 h-full flex flex-col overflow-hidden bg-slate-900/80">
            {/* Fake browser bar */}
            <div className="h-6 bg-slate-800/80 flex items-center gap-1.5 px-2 border-b border-slate-700/50">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
              <div className="flex-1 mx-2">
                <div className="h-3 bg-slate-700/50 rounded-sm max-w-[120px]" />
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 p-3 space-y-3 overflow-hidden">
              {/* Navigation skeleton */}
              <motion.div
                className={`flex items-center justify-between ${showNav ? "opacity-100" : "opacity-0"}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -5 }}
              >
                <div className={`w-16 h-4 rounded ${showColors ? "bg-gradient-to-r from-cyan-500/60 to-purple-500/60" : "bg-slate-700/60"}`} />
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-3 rounded bg-slate-700/40" />
                  ))}
                </div>
              </motion.div>

              {/* Hero section skeleton */}
              <motion.div
                className={`space-y-2 ${showHero ? "opacity-100" : "opacity-0"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: showHero ? 1 : 0 }}
              >
                <div className={`h-6 rounded w-3/4 ${showColors ? "bg-gradient-to-r from-cyan-500/40 to-purple-500/40" : "bg-slate-700/50"}`} />
                <div className="h-3 rounded w-1/2 bg-slate-700/30" />
                <div className={`w-20 h-5 rounded-md mt-2 ${showColors ? "bg-cyan-500/50" : "bg-slate-700/40"}`} />
              </motion.div>

              {/* Cards grid skeleton */}
              <motion.div
                className={`grid grid-cols-3 gap-2 ${showCards ? "opacity-100" : "opacity-0"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: showCards ? 1 : 0, y: showCards ? 0 : 10 }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-16 rounded-lg ${showColors ? "bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20" : "bg-slate-700/30"}`}
                  />
                ))}
              </motion.div>

              {/* Footer skeleton */}
              <motion.div
                className={`flex items-center justify-center gap-4 pt-2 ${showFooter ? "opacity-100" : "opacity-0"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: showFooter ? 1 : 0 }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-slate-700/30" />
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scanning effect */}
          <motion.div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LivePreviewSkeleton;
