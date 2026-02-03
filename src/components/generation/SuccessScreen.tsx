import { motion } from "framer-motion";
import { Sparkles, ExternalLink, RotateCcw, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SuccessScreenProps {
  onGenerateAnother: () => void;
  generatedUrl?: string;
}

const SuccessScreen = ({ onGenerateAnother, generatedUrl }: SuccessScreenProps) => {
  const navigate = useNavigate();

  const handleOpenApp = () => {
    if (generatedUrl) {
      window.open(generatedUrl, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-8 z-20"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
      
      {/* Animated glow rings */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-cyan-500/20"
            style={{ width: 200 + i * 100, height: 200 + i * 100 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative z-10 text-center"
      >
        {/* Success icon */}
        <motion.div
          className="w-24 h-24 mx-auto mb-6 relative"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 blur-xl opacity-50" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          
          {/* Sparkles around */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${50 + 60 * Math.sin((i * Math.PI * 2) / 6)}%`,
                left: `${50 + 60 * Math.cos((i * Math.PI * 2) / 6)}%`,
              }}
              animate={{ scale: [0, 1, 0], rotate: [0, 180] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3"
        >
          Generation Complete
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 mb-8"
        >
          Your app has been successfully created.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            onClick={handleOpenApp}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 px-8 shadow-lg shadow-cyan-500/30"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Application
          </Button>
          
          <Button
            onClick={onGenerateAnother}
            variant="outline"
            size="lg"
            className="border-slate-700 hover:bg-slate-800 text-slate-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Generate Another
          </Button>
        </motion.div>

        {/* Optional view report */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-xs text-slate-500 hover:text-slate-400 flex items-center gap-1 mx-auto"
        >
          <FileText className="w-3 h-3" />
          View Build Report
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SuccessScreen;
