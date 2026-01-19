import { Link } from "react-router-dom";
import { ArrowLeft, Code2, Layers, Globe, Sparkles, Zap, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState } from "react";

const technologies = [
  {
    id: "php",
    name: "PHP",
    icon: "🐘",
    color: "from-indigo-500 to-purple-600",
    bgGradient: "from-indigo-500/20 via-purple-600/10 to-transparent",
    glowColor: "shadow-indigo-500/30",
    accentColor: "#8B5CF6",
    description: "A popular general-purpose scripting language especially suited for web development.",
    features: [
      "Laravel & Symfony frameworks",
      "MySQL & PostgreSQL integration",
      "RESTful API development",
      "Session management",
      "Template engines (Blade, Twig)",
    ],
    useCases: ["Content Management Systems", "E-commerce platforms", "Web portals", "API backends"],
    stats: { performance: 85, popularity: 92, ecosystem: 88 },
  },
  {
    id: "java",
    name: "Java Spring Boot",
    icon: "☕",
    color: "from-orange-500 to-red-600",
    bgGradient: "from-orange-500/20 via-red-600/10 to-transparent",
    glowColor: "shadow-orange-500/30",
    accentColor: "#F97316",
    description: "Enterprise-grade framework for building production-ready applications with minimal configuration.",
    features: [
      "Dependency injection",
      "Spring Security",
      "JPA/Hibernate ORM",
      "Microservices architecture",
      "Cloud-native support",
    ],
    useCases: ["Enterprise applications", "Banking systems", "Large-scale APIs", "Microservices"],
    stats: { performance: 95, popularity: 88, ecosystem: 96 },
  },
  {
    id: "python",
    name: "Python Django",
    icon: "🐍",
    color: "from-green-500 to-teal-600",
    bgGradient: "from-green-500/20 via-teal-600/10 to-transparent",
    glowColor: "shadow-green-500/30",
    accentColor: "#10B981",
    description: "High-level Python framework that encourages rapid development and clean, pragmatic design.",
    features: [
      "Built-in admin interface",
      "ORM & migrations",
      "Authentication system",
      "REST framework",
      "Template system",
    ],
    useCases: ["Data-driven applications", "Scientific computing", "Machine learning platforms", "Content sites"],
    stats: { performance: 80, popularity: 95, ecosystem: 94 },
  },
  {
    id: "dotnet",
    name: "ASP.NET",
    icon: "🔷",
    color: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-500/20 via-cyan-600/10 to-transparent",
    glowColor: "shadow-blue-500/30",
    accentColor: "#3B82F6",
    description: "Microsoft's powerful framework for building modern, cloud-based web applications.",
    features: [
      "Entity Framework Core",
      "Identity management",
      "Blazor for SPA",
      "SignalR real-time",
      "Azure integration",
    ],
    useCases: ["Enterprise software", "Windows integration", "Real-time apps", "Cloud services"],
    stats: { performance: 94, popularity: 78, ecosystem: 90 },
  },
  {
    id: "node-react",
    name: "Node.js + React",
    icon: "⚛️",
    color: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-500/20 via-blue-600/10 to-transparent",
    glowColor: "shadow-cyan-500/30",
    accentColor: "#06B6D4",
    description: "Full-stack JavaScript solution for building modern, interactive web applications.",
    features: [
      "Express.js backend",
      "React components",
      "Real-time with Socket.io",
      "MongoDB/PostgreSQL",
      "JWT authentication",
    ],
    useCases: ["Single-page applications", "Real-time chat", "Social platforms", "Modern web apps"],
    stats: { performance: 90, popularity: 98, ecosystem: 99 },
  },
];

// 3D Tilt Card Component
const TechCard = ({ tech, index }: { tech: typeof technologies[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000"
    >
      <div
        className={`
          relative p-8 rounded-3xl 
          bg-gradient-to-br from-card/90 via-card/60 to-card/30
          border border-white/10 
          backdrop-blur-2xl
          shadow-2xl ${tech.glowColor}
          transition-all duration-500
          overflow-hidden
          group
          ${isHovered ? 'shadow-3xl border-white/20' : ''}
        `}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Animated gradient background */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${tech.bgGradient} opacity-0`}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Floating particles */}
        {isHovered && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${tech.color}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, -80 - Math.random() * 40],
                }}
                transition={{ 
                  duration: 1.5 + Math.random() * 0.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
                style={{ left: `${20 + i * 15}%`, bottom: '10%' }}
              />
            ))}
          </>
        )}
        
        {/* Moving glow orb */}
        <motion.div 
          className={`absolute w-64 h-64 bg-gradient-to-br ${tech.color} opacity-10 blur-3xl rounded-full`}
          animate={{
            x: isHovered ? [0, 30, -20, 0] : 0,
            y: isHovered ? [0, -20, 30, 0] : 0,
            scale: isHovered ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: '-30%', right: '-20%' }}
        />

        {/* Scan line effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"
            initial={{ y: '-100%' }}
            animate={{ y: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}

        <div className="relative flex flex-col lg:flex-row gap-8" style={{ transform: "translateZ(20px)" }}>
          {/* Left - Info */}
          <div className="lg:w-1/3">
            <motion.div 
              className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center mb-6 shadow-2xl ${tech.glowColor}`}
              animate={{ 
                boxShadow: isHovered 
                  ? `0 0 40px ${tech.accentColor}60, 0 0 80px ${tech.accentColor}30`
                  : `0 0 20px ${tech.accentColor}30`,
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <motion.span 
                className="text-5xl"
                animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {tech.icon}
              </motion.span>
              
              {/* Orbiting ring */}
              <motion.div
                className={`absolute inset-0 rounded-2xl border-2 border-dashed ${isHovered ? 'border-white/40' : 'border-transparent'}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            
            <motion.h3 
              className="text-3xl font-bold text-foreground mb-4"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {tech.name}
            </motion.h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{tech.description}</p>
            
            {/* Performance bars */}
            <div className="space-y-3">
              {Object.entries(tech.stats).map(([key, value], i) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">{key}</span>
                    <span className="text-foreground font-medium">{value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${tech.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Middle - Features */}
          <div className="lg:w-1/3">
            <h4 className="font-semibold text-foreground mb-5 flex items-center gap-2 text-lg">
              <motion.div 
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center shadow-lg`}
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <Layers className="w-5 h-5 text-white" />
              </motion.div>
              Key Features
            </h4>
            <ul className="space-y-3">
              {tech.features.map((feature, i) => (
                <motion.li 
                  key={i} 
                  className="flex items-center gap-3 text-muted-foreground group/item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  whileHover={{ x: 6 }}
                >
                  <motion.div 
                    className={`w-2 h-2 rounded-full bg-gradient-to-br ${tech.color}`}
                    whileHover={{ scale: 2 }}
                  />
                  <span className="group-hover/item:text-foreground transition-colors duration-200">{feature}</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity ml-auto" />
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* Right - Use Cases */}
          <div className="lg:w-1/3">
            <h4 className="font-semibold text-foreground mb-5 flex items-center gap-2 text-lg">
              <motion.div 
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center shadow-lg`}
                whileHover={{ rotate: -180, scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <Globe className="w-5 h-5 text-white" />
              </motion.div>
              Best For
            </h4>
            <div className="flex flex-wrap gap-2">
              {tech.useCases.map((useCase, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  whileHover={{ 
                    scale: 1.08,
                    boxShadow: `0 0 20px ${tech.accentColor}40`,
                  }}
                  className={`
                    px-4 py-2.5 rounded-full 
                    bg-gradient-to-r ${tech.color}/10
                    border border-white/10
                    text-sm text-foreground font-medium
                    hover:border-white/30
                    transition-all duration-300
                    cursor-default
                  `}
                >
                  {useCase}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Technologies = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-purple/8 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        
        {/* Floating code symbols */}
        {['</', '{}', '()', '=>', '[]'].map((symbol, i) => (
          <motion.span
            key={i}
            className="absolute text-primary/10 text-4xl font-mono font-bold"
            style={{ 
              left: `${15 + i * 18}%`, 
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          >
            {symbol}
          </motion.span>
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border/50 bg-background/60 backdrop-blur-xl z-50">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3 group">
            <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-bold text-xl text-foreground">Supported Technologies</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent-purple/20 border border-primary/30 text-primary mb-8 shadow-lg shadow-primary/10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-medium">Powerful Technology Stack</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Choose Your
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-primary via-accent-purple to-cyan-500 bg-[length:200%_100%] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                  opacity: { delay: 0.4 },
                  y: { delay: 0.4 },
                  backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" },
                }}
              >
                Technology
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              We support a variety of popular frameworks and languages to match your project requirements. 
              Build with the tools you love.
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="flex justify-center gap-16 mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: <Code2 className="w-6 h-6" />, label: "Frameworks", value: "5+" },
                { icon: <Zap className="w-6 h-6" />, label: "Fast Setup", value: "< 1min" },
                { icon: <Shield className="w-6 h-6" />, label: "Production Ready", value: "100%" },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="text-center group"
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <motion.div 
                    className="flex items-center justify-center gap-2 text-primary mb-3 p-3 rounded-xl bg-primary/10 mx-auto w-fit"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {stat.icon}
                    <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  </motion.div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Technologies Grid */}
          <div className="space-y-10">
            {technologies.map((tech, index) => (
              <TechCard key={tech.id} tech={tech} index={index} />
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="mt-24 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.div 
              className="relative p-14 rounded-3xl bg-gradient-to-br from-primary/15 via-accent-purple/10 to-cyan-500/10 border border-white/10 backdrop-blur-xl overflow-hidden"
              whileHover={{ scale: 1.01 }}
            >
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent-purple)), hsl(var(--primary)))',
                  backgroundSize: '200% 100%',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'xor',
                  WebkitMaskComposite: 'xor',
                  padding: '1px',
                }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Build?</h2>
              <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg">
                Choose your preferred technology stack and start building your application in minutes.
              </p>
              <Link to="/">
                <motion.button
                  className="px-10 py-5 bg-gradient-to-r from-primary via-accent-purple to-primary bg-[length:200%_100%] text-primary-foreground font-semibold rounded-full shadow-2xl shadow-primary/30 text-lg"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 40px hsl(var(--primary) / 0.5)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ 
                    backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
                  }}
                >
                  Get Started Now
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Technologies;