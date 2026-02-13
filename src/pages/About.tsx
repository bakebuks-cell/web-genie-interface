import { motion } from "framer-motion";
import { 
  Zap, 
  Globe2, 
  Sparkles, 
  Code2,
  Gauge, 
  Target, 
  Shield,
  Layers
} from "lucide-react";

const providesFeatures = [
  {
    icon: Zap,
    title: "Prompt to Production",
    description: "Turn ideas into structured, deployable outputs with speed and clarity.",
  },
  {
    icon: Globe2,
    title: "Multi-Language Intelligence",
    description: "Supports programming and natural languages seamlessly.",
  },
  {
    icon: Layers,
    title: "Full-Stack Generation",
    description: "Frontend, backend, and database — all from a single prompt.",
  },
  {
    icon: Code2,
    title: "Clean Code Output",
    description: "Well-structured, maintainable code following best practices.",
  },
];

const whyChooseFeatures = [
  {
    icon: Gauge,
    title: "Built for Speed",
    description: "Optimized for fast iteration and rapid shipping.",
  },
  {
    icon: Target,
    title: "Precision-Driven",
    description: "Structured, predictable, and clean results every time.",
  },
  {
    icon: Shield,
    title: "Production Ready",
    description: "Scalable architecture from day one.",
  },
  {
    icon: Sparkles,
    title: "Developer-First",
    description: "No clutter, no templates — just focused generation.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
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

const FeatureCard = ({ feature }: { feature: { icon: typeof Zap; title: string; description: string } }) => {
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
        hover:shadow-xl hover:shadow-[rgba(0,245,212,0.03)]
        transition-all duration-300 ease-out
        cursor-default"
    >
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[rgba(0,245,212,0.03)] via-transparent to-transparent pointer-events-none" />
      
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
            background: 'radial-gradient(circle, rgba(0, 245, 212, 0.06) 0%, transparent 70%)',
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
            background: 'radial-gradient(circle, rgba(0, 245, 212, 0.05) 0%, transparent 70%)',
          }}
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px]"
          style={{
            background: 'radial-gradient(ellipse, rgba(0, 245, 212, 0.04) 0%, transparent 60%)',
          }}
        />
      </div>

      <main className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Introduction Section */}
          <motion.section 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              About
            </h1>
            
            <div className="space-y-5">
              <p className="text-lg md:text-xl text-white/60 leading-relaxed">
                MyCodex is an AI-powered prompt-to-application platform that converts ideas into full web applications. It allows users to choose their preferred technology stack and generate scalable, production-ready code.
              </p>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed">
                The platform is built to reduce development friction, accelerate workflows, and maintain clean architecture — enabling developers and teams to ship faster without compromising on quality.
              </p>
            </div>
          </motion.section>

          {/* Divider */}
          <motion.div 
            className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* What MyCodex Provides */}
          <motion.section 
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-10">
              <span className="inline-block text-xs font-medium tracking-widest text-white/30 uppercase mb-3">
                Capabilities
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                What MyCodex Provides
              </h2>
            </div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {providesFeatures.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </motion.div>
          </motion.section>

          {/* Why Choose MyCodex */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="mb-10">
              <span className="inline-block text-xs font-medium tracking-widest text-white/30 uppercase mb-3">
                Advantages
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                Why Choose MyCodex
              </h2>
            </div>

            {/* Premium paragraph content */}
            <div className="space-y-6 mb-12">
              <motion.p 
                className="text-lg md:text-xl text-white/60 leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Unlike generic AI tools that produce fragmented or boilerplate code, MyCodex is purpose-built for real-world software development. Every output is structured around clean architecture principles — separating concerns, enforcing modularity, and ensuring that generated applications are maintainable from the first line of code.
              </motion.p>
              
              <motion.p 
                className="text-lg md:text-xl text-white/55 leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.85 }}
              >
                The platform offers genuine multi-technology support across React, Node.js/TypeScript, PHP, Golang, and Python. This means developers can choose the stack that fits their project requirements without compromising on code quality or architectural consistency. Whether you're building enterprise backends or modern frontends, MyCodex adapts to your workflow.
              </motion.p>
              
              <motion.p 
                className="text-lg md:text-xl text-white/50 leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                Speed and clarity are at the core of the experience. The platform eliminates the noise of traditional development by giving you exactly what you need — production-ready code with clear structure, sensible defaults, and room for customization. Developers retain full control over the output while benefiting from AI-accelerated generation that respects industry standards and scalability requirements.
              </motion.p>
            </div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {whyChooseFeatures.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </motion.div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default About;
