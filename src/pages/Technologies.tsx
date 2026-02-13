import { motion } from "framer-motion";
import { 
  Rocket, 
  Settings, 
  Bot, 
  BarChart3, 
  Shield, 
  Globe,
  Loader2 
} from "lucide-react";
import { useTechnologiesWithStyles } from "@/hooks/useTechnologies";

const buildFeatures = [
  {
    icon: Rocket,
    title: "Full-Stack Web Applications",
    items: [
      "From idea to production-ready apps",
      "Frontend + backend handled end-to-end",
    ],
  },
  {
    icon: Settings,
    title: "Custom Backend & APIs",
    items: [
      "Secure REST APIs",
      "Scalable architecture",
      "High performance systems",
    ],
  },
  {
    icon: Bot,
    title: "AI-Powered Applications",
    items: [
      "Prompt-driven workflows",
      "AI integrations",
      "Smart automation tools",
    ],
  },
  {
    icon: BarChart3,
    title: "Business & Admin Dashboards",
    items: [
      "Analytics dashboards",
      "Internal tools",
      "Role-based access systems",
    ],
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Systems",
    items: [
      "Secure authentication",
      "Scalable infrastructure",
      "Production-ready deployments",
    ],
  },
  {
    icon: Globe,
    title: "Multi-Technology Support",
    items: [
      "Choose the best tech per project",
      "Mix frontend & backend stacks seamlessly",
    ],
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

interface TechCardProps {
  tech: {
    name: string;
    icon: string | null;
    description: string | null;
    color: string;
    glowColor: string;
    borderColor: string;
    useCases: string[];
    benefits: string[];
    projectTypes: string;
  };
}

const TechCard = ({ tech }: TechCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -6,
        transition: { duration: 0.25, ease: "easeOut" }
      }}
      className={`group relative p-6 rounded-xl 
        bg-gradient-to-br ${tech.color}
        backdrop-blur-sm
        border border-white/[0.08]
        ${tech.borderColor}
        ${tech.glowColor}
        hover:shadow-xl
        transition-all duration-300 ease-out
        cursor-default`}
    >
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header with icon and name */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{tech.icon}</span>
          <h3 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
            {tech.name}
          </h3>
        </div>
        
        {/* Description */}
        <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-300 mb-4">
          {tech.description}
        </p>
        
        {/* Use Cases */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2">Use Cases</h4>
          <ul className="space-y-1.5">
            {tech.useCases.map((useCase, index) => (
              <li 
                key={index}
                className="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-300 flex items-start gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-white/30 mt-2 flex-shrink-0" />
                {useCase}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Benefits */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2">Key Benefits</h4>
          <ul className="space-y-1.5">
            {tech.benefits.map((benefit, index) => (
              <li 
                key={index}
                className="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-300 flex items-start gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Project Types */}
        <div>
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2">Typical Projects</h4>
          <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors duration-300">
            {tech.projectTypes}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const BuildFeatureCard = ({ feature }: { feature: typeof buildFeatures[0] }) => {
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
        border border-white/[0.08]
        hover:border-white/[0.15]
        hover:bg-white/[0.04]
        hover:shadow-xl hover:shadow-white/[0.02]
        transition-all duration-300 ease-out
        cursor-default"
    >
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center mb-4 group-hover:bg-white/[0.08] transition-colors duration-300">
          <IconComponent className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors duration-300" />
        </div>
        
        <h3 className="text-base font-semibold text-white/90 group-hover:text-white mb-3 transition-colors duration-300">
          {feature.title}
        </h3>
        
        <ul className="space-y-1.5">
          {feature.items.map((item, index) => (
            <li 
              key={index}
              className="text-sm text-white/40 group-hover:text-white/60 transition-colors duration-300"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const Technologies = () => {
  const { technologies, isLoading } = useTechnologiesWithStyles();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dot grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />
      
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
          style={{
            background: 'radial-gradient(ellipse, hsl(250 60% 50% / 0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      <main className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Technologies We Work With
            </h1>
            <p className="text-white/40 text-base max-w-lg mx-auto">
              Build, scale, and ship products using modern and reliable technologies.
            </p>
          </motion.div>

          {/* Technology Cards Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-24"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {technologies?.map((tech) => (
                <TechCard key={tech.name} tech={tech} />
              ))}
            </motion.div>
          )}

          {/* What You Can Build Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                What You Can Build with MyCodex.Dev
              </h2>
              <p className="text-white/40 text-sm max-w-md mx-auto">
                From simple apps to enterprise systems — powered by your choice of technology.
              </p>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {buildFeatures.map((feature) => (
                <BuildFeatureCard key={feature.title} feature={feature} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Technologies;
