import { motion } from "framer-motion";
import { 
  Zap, 
  Globe2, 
  Sparkles, 
  Gauge, 
  Target, 
  Heart 
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Prompt to Production",
    description: "Turn ideas into structured outputs with speed and clarity.",
  },
  {
    icon: Globe2,
    title: "Multi-Language Intelligence",
    description: "Supports programming and natural languages seamlessly.",
  },
  {
    icon: Sparkles,
    title: "Clean Developer Experience",
    description: "No clutter, no templates — just focused generation.",
  },
  {
    icon: Gauge,
    title: "Built for Speed",
    description: "Optimized for fast iteration and rapid shipping.",
  },
  {
    icon: Target,
    title: "Precision-Driven Outputs",
    description: "Structured, predictable, and clean results every time.",
  },
  {
    icon: Heart,
    title: "Why DataBuks Studio",
    description: "Because modern builders need clarity, not complexity.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const FeatureCard = ({ feature }: { feature: typeof features[0] }) => {
  const IconComponent = feature.icon;
  
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.25, ease: "easeOut" }
      }}
      className="group relative p-6 rounded-xl 
        bg-white/[0.02]
        backdrop-blur-sm
        border border-white/[0.06]
        hover:border-white/[0.12]
        hover:bg-white/[0.04]
        hover:shadow-xl hover:shadow-purple-500/[0.03]
        transition-all duration-300 ease-out
        cursor-default"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5 group-hover:bg-white/[0.06] group-hover:border-white/[0.1] transition-all duration-300">
          <IconComponent className="w-5 h-5 text-white/50 group-hover:text-white/70 transition-colors duration-300" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-base font-semibold text-white/90 group-hover:text-white mb-2 transition-colors duration-300">
          {feature.title}
        </h3>
        
        <p className="text-sm text-white/40 group-hover:text-white/55 leading-relaxed transition-colors duration-300">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

const About = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dot grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />
      
      {/* Ambient gradient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(250 70% 50% / 0.06) 0%, transparent 70%)',
          }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(280 70% 45% / 0.05) 0%, transparent 70%)',
          }}
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px]"
          style={{
            background: 'radial-gradient(ellipse, hsl(260 60% 50% / 0.03) 0%, transparent 60%)',
          }}
        />
      </div>

      <main className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-medium tracking-widest text-white/30 uppercase mb-4">
              About DataBuks Studio
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Built for modern prompt-driven development
            </h1>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default About;
