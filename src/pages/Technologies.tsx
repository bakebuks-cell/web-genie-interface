import { Link } from "react-router-dom";
import { 
  Globe, 
  MessageSquareText, 
  Save, 
  Bell, 
  Sparkles, 
  Code2 
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Supports multiple programming and natural languages.",
  },
  {
    icon: MessageSquareText,
    title: "Full-Text Prompt Understanding",
    description: "Understands your idea deeply before generating output.",
  },
  {
    icon: Save,
    title: "Save & Version Prompts",
    description: "Automatically saves prompts and iterations.",
  },
  {
    icon: Bell,
    title: "Notifications & Updates",
    description: "Get updates when generation is complete.",
  },
  {
    icon: Sparkles,
    title: "Template-Free Generation",
    description: "No templates, pure idea-driven generation.",
  },
  {
    icon: Code2,
    title: "Developer-First Architecture",
    description: "Built for speed, clarity, and scalability.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const IconComponent = feature.icon;
  
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="group relative p-8 rounded-2xl 
        bg-card/50 backdrop-blur-xl
        border border-border/50
        hover:border-border
        hover:bg-card/70
        transition-all duration-300 ease-out
        cursor-default"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors duration-300">
          <IconComponent className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-3">
          {feature.title}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

const Technologies = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top-left blue/purple glow */}
        <motion.div 
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(250 83% 60% / 0.08) 0%, transparent 70%)',
          }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Bottom-right purple glow */}
        <motion.div 
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(280 83% 55% / 0.06) 0%, transparent 70%)',
          }}
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Center subtle glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(250 83% 60% / 0.03) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Floating Header - Right aligned */}
      <header className="fixed top-6 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-full 
              bg-card/60 backdrop-blur-xl 
              border border-border/50
              hover:bg-card/80 hover:border-border
              transition-all duration-300"
          >
            <span className="text-foreground font-semibold tracking-tight">
              DataBuks Studio
            </span>
          </Link>
        </motion.div>
      </header>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Technology Features
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Powerful capabilities designed to transform your ideas into production-ready applications.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Technologies;
