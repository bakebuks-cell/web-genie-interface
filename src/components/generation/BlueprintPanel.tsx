import { motion } from "framer-motion";
import { 
  FileCode2, 
  Home, 
  Info, 
  Phone, 
  LayoutDashboard, 
  Settings,
  Package,
  Layers,
  Server,
  HardDrive
} from "lucide-react";

interface BlueprintPanelProps {
  appName: string;
  progress: number;
}

const BlueprintPanel = ({ appName, progress }: BlueprintPanelProps) => {
  const pages = [
    { icon: Home, name: "Home", path: "/" },
    { icon: Info, name: "About", path: "/about" },
    { icon: Phone, name: "Contact", path: "/contact" },
    { icon: LayoutDashboard, name: "Dashboard", path: "/dashboard" },
    { icon: Settings, name: "Settings", path: "/settings" },
  ];

  const techStack = ["HTML", "CSS", "JavaScript", "React"];
  
  const componentsCount = Math.floor((progress / 100) * 18);
  const bundleSize = Math.floor((progress / 100) * 420);

  return (
    <div className="relative p-6">
      <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        {/* Blueprint grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px"
          }}
        />

        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Blueprint & Routes
          </span>
        </div>

        <div className="p-4 space-y-4 relative">
          {/* App name */}
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center"
              animate={{ boxShadow: ["0 0 0 rgba(34,211,238,0)", "0 0 20px rgba(34,211,238,0.3)", "0 0 0 rgba(34,211,238,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Package className="w-5 h-5 text-cyan-400" />
            </motion.div>
            <div>
              <h3 className="text-sm font-semibold text-white">{appName || "Your App"}</h3>
              <p className="text-[10px] text-slate-500">Web Application</p>
            </div>
          </div>

          {/* Tech stack chips */}
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Pages list */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Routes</p>
            {pages.map((page, i) => (
              <motion.div
                key={page.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: progress > (i + 1) * 15 ? 1 : 0.3, 
                  x: 0 
                }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-xs"
              >
                <page.icon className={`w-3.5 h-3.5 ${progress > (i + 1) * 15 ? "text-cyan-400" : "text-slate-600"}`} />
                <span className={progress > (i + 1) * 15 ? "text-slate-300" : "text-slate-600"}>
                  {page.name}
                </span>
                <span className="text-slate-600 font-mono text-[10px]">{page.path}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/50">
            <div className="flex items-center gap-2 text-xs">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-500">Pages:</span>
              <span className="text-slate-300 font-medium">{pages.length}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Package className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-500">Components:</span>
              <span className="text-slate-300 font-medium">{componentsCount}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Server className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-500">API:</span>
              <span className="text-slate-500 text-[10px]">Not connected</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-500">Bundle:</span>
              <span className="text-slate-300 font-medium">~{bundleSize}kb</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintPanel;
