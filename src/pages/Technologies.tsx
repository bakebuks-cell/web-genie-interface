import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const technologies = [
  {
    name: "PHP",
    color: "from-blue-500/20 to-blue-600/10",
    glowColor: "group-hover:shadow-blue-500/20",
    borderColor: "group-hover:border-blue-500/50",
    capabilities: [
      "Web applications",
      "APIs & backend systems",
      "CMS & custom dashboards",
    ],
  },
  {
    name: "Java – Spring Boot",
    color: "from-green-500/20 to-green-600/10",
    glowColor: "group-hover:shadow-green-500/20",
    borderColor: "group-hover:border-green-500/50",
    capabilities: [
      "Enterprise-grade backend services",
      "Secure APIs",
      "Scalable microservices",
    ],
  },
  {
    name: "Python – Django",
    color: "from-yellow-500/20 to-yellow-600/10",
    glowColor: "group-hover:shadow-yellow-500/20",
    borderColor: "group-hover:border-yellow-500/50",
    capabilities: [
      "Rapid backend development",
      "AI / ML integrations",
      "Data-driven applications",
    ],
  },
  {
    name: "ASP.NET",
    color: "from-red-500/20 to-red-600/10",
    glowColor: "group-hover:shadow-red-500/20",
    borderColor: "group-hover:border-red-500/50",
    capabilities: [
      "High-performance enterprise apps",
      "Secure business platforms",
      "Large-scale systems",
    ],
  },
  {
    name: "Node.js",
    color: "from-purple-500/20 to-purple-600/10",
    glowColor: "group-hover:shadow-purple-500/20",
    borderColor: "group-hover:border-purple-500/50",
    capabilities: [
      "Real-time applications",
      "Fast APIs",
      "Scalable server-side solutions",
    ],
  },
  {
    name: "React.js",
    color: "from-cyan-500/20 to-cyan-600/10",
    glowColor: "group-hover:shadow-cyan-500/20",
    borderColor: "group-hover:border-cyan-500/50",
    capabilities: [
      "Modern UI / UX",
      "Single Page Applications",
      "Fast, responsive frontends",
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

const TechCard = ({ tech }: { tech: typeof technologies[0] }) => {
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
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-white/90 group-hover:text-white mb-4 transition-colors duration-300">
          {tech.name}
        </h3>
        
        <ul className="space-y-2">
          {tech.capabilities.map((capability, index) => (
            <li 
              key={index}
              className="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-300 flex items-start gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-white/30 mt-2 flex-shrink-0" />
              {capability}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const Technologies = () => {
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

      {/* Floating Header */}
      <header className="fixed top-6 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link 
            to="/"
            className="inline-flex items-center px-5 py-2.5 rounded-full 
              bg-white/[0.05] backdrop-blur-xl 
              border border-white/[0.08]
              hover:bg-white/[0.08] hover:border-white/[0.15]
              transition-all duration-300"
          >
            <span className="text-white/90 font-medium text-sm tracking-tight">
              DataBuks Studio
            </span>
          </Link>
        </motion.div>
      </header>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header - Center Aligned */}
          <motion.div 
            className="text-center mb-16"
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
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {technologies.map((tech) => (
              <TechCard key={tech.name} tech={tech} />
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Technologies;
