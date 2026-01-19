import { Link } from "react-router-dom";
import { ArrowLeft, Code2, Layers, Globe, Sparkles, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const technologies = [
  {
    id: "php",
    name: "PHP",
    icon: "🐘",
    color: "from-indigo-500 to-purple-600",
    glowColor: "shadow-indigo-500/20",
    description: "A popular general-purpose scripting language especially suited for web development.",
    features: [
      "Laravel & Symfony frameworks",
      "MySQL & PostgreSQL integration",
      "RESTful API development",
      "Session management",
      "Template engines (Blade, Twig)",
    ],
    useCases: ["Content Management Systems", "E-commerce platforms", "Web portals", "API backends"],
  },
  {
    id: "java",
    name: "Java Spring Boot",
    icon: "☕",
    color: "from-orange-500 to-red-600",
    glowColor: "shadow-orange-500/20",
    description: "Enterprise-grade framework for building production-ready applications with minimal configuration.",
    features: [
      "Dependency injection",
      "Spring Security",
      "JPA/Hibernate ORM",
      "Microservices architecture",
      "Cloud-native support",
    ],
    useCases: ["Enterprise applications", "Banking systems", "Large-scale APIs", "Microservices"],
  },
  {
    id: "python",
    name: "Python Django",
    icon: "🐍",
    color: "from-green-500 to-teal-600",
    glowColor: "shadow-green-500/20",
    description: "High-level Python framework that encourages rapid development and clean, pragmatic design.",
    features: [
      "Built-in admin interface",
      "ORM & migrations",
      "Authentication system",
      "REST framework",
      "Template system",
    ],
    useCases: ["Data-driven applications", "Scientific computing", "Machine learning platforms", "Content sites"],
  },
  {
    id: "dotnet",
    name: "ASP.NET",
    icon: "🔷",
    color: "from-blue-500 to-cyan-600",
    glowColor: "shadow-blue-500/20",
    description: "Microsoft's powerful framework for building modern, cloud-based web applications.",
    features: [
      "Entity Framework Core",
      "Identity management",
      "Blazor for SPA",
      "SignalR real-time",
      "Azure integration",
    ],
    useCases: ["Enterprise software", "Windows integration", "Real-time apps", "Cloud services"],
  },
  {
    id: "node-react",
    name: "Node.js + React",
    icon: "⚛️",
    color: "from-cyan-500 to-blue-600",
    glowColor: "shadow-cyan-500/20",
    description: "Full-stack JavaScript solution for building modern, interactive web applications.",
    features: [
      "Express.js backend",
      "React components",
      "Real-time with Socket.io",
      "MongoDB/PostgreSQL",
      "JWT authentication",
    ],
    useCases: ["Single-page applications", "Real-time chat", "Social platforms", "Modern web apps"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Technologies = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent rounded-full blur-3xl" />
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
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-accent-purple/20 border border-primary/20 text-primary mb-8"
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Powerful Technology Stack</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              Choose Your
              <span className="block bg-gradient-to-r from-primary via-accent-purple to-primary bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient">
                Technology
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We support a variety of popular frameworks and languages to match your project requirements. 
              Build with the tools you love.
            </p>

            {/* Stats */}
            <motion.div 
              className="flex justify-center gap-12 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { icon: <Code2 className="w-5 h-5" />, label: "Frameworks", value: "5+" },
                { icon: <Zap className="w-5 h-5" />, label: "Fast Setup", value: "< 1min" },
                { icon: <Shield className="w-5 h-5" />, label: "Production Ready", value: "100%" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-primary mb-2">
                    {stat.icon}
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Technologies Grid */}
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01, y: -4 }}
                transition={{ duration: 0.3 }}
                className={`
                  relative p-8 rounded-3xl 
                  bg-gradient-to-br from-card/80 to-card/40
                  border border-white/5 
                  hover:border-primary/30 
                  backdrop-blur-xl
                  shadow-2xl ${tech.glowColor}
                  transition-all duration-500
                  overflow-hidden
                  group
                `}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Glow effect */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${tech.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />

                <div className="relative flex flex-col lg:flex-row gap-8">
                  {/* Left - Info */}
                  <div className="lg:w-1/3">
                    <motion.div 
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center mb-6 shadow-lg ${tech.glowColor}`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-4xl">{tech.icon}</span>
                    </motion.div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">{tech.name}</h3>
                    <p className="text-muted-foreground leading-relaxed">{tech.description}</p>
                  </div>
                  
                  {/* Middle - Features */}
                  <div className="lg:w-1/3">
                    <h4 className="font-semibold text-foreground mb-5 flex items-center gap-2 text-lg">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tech.color} flex items-center justify-center`}>
                        <Layers className="w-4 h-4 text-white" />
                      </div>
                      Key Features
                    </h4>
                    <ul className="space-y-3">
                      {tech.features.map((feature, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-center gap-3 text-muted-foreground group/item"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + i * 0.05 }}
                        >
                          <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${tech.color} group-hover/item:scale-150 transition-transform`} />
                          <span className="group-hover/item:text-foreground transition-colors">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Right - Use Cases */}
                  <div className="lg:w-1/3">
                    <h4 className="font-semibold text-foreground mb-5 flex items-center gap-2 text-lg">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tech.color} flex items-center justify-center`}>
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      Best For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tech.useCases.map((useCase, i) => (
                        <motion.span
                          key={i}
                          className={`
                            px-4 py-2 rounded-full 
                            bg-gradient-to-r ${tech.color} bg-opacity-10
                            border border-white/10
                            text-sm text-foreground
                            hover:border-primary/30 hover:bg-opacity-20
                            transition-all duration-300
                          `}
                          whileHover={{ scale: 1.05 }}
                        >
                          {useCase}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-accent-purple/10 border border-white/10 backdrop-blur-xl">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Build?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Choose your preferred technology stack and start building your application in minutes.
              </p>
              <Link to="/">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-primary to-accent-purple text-primary-foreground font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Technologies;
