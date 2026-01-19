import { Link } from "react-router-dom";
import { ArrowLeft, Database, Target, Lightbulb, Rocket, Users, Zap, Shield, Globe, Star, Code2, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState } from "react";

const stats = [
  { icon: <Users className="w-6 h-6" />, value: "10K+", label: "Active Users", color: "from-blue-500 to-cyan-500" },
  { icon: <Code2 className="w-6 h-6" />, value: "50K+", label: "Apps Generated", color: "from-purple-500 to-pink-500" },
  { icon: <Globe className="w-6 h-6" />, value: "120+", label: "Countries", color: "from-green-500 to-emerald-500" },
  { icon: <Star className="w-6 h-6" />, value: "4.9", label: "Rating", color: "from-yellow-500 to-orange-500" },
];

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Generate complete applications in minutes, not months. Our AI understands your vision instantly.",
    color: "from-yellow-500 to-orange-500",
    delay: 0,
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Production Ready",
    description: "Every line of code is optimized for performance, security, and scalability from day one.",
    color: "from-green-500 to-emerald-500",
    delay: 0.1,
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Clean Architecture",
    description: "Well-structured, maintainable code following industry best practices and design patterns.",
    color: "from-blue-500 to-cyan-500",
    delay: 0.2,
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multi-Stack Support",
    description: "Choose from PHP, Java, Python, .NET, or Node.js - we support your preferred technology.",
    color: "from-purple-500 to-pink-500",
    delay: 0.3,
  },
];

// Animated counter component
const AnimatedCounter = ({ value, suffix = "" }: { value: string; suffix?: string }) => {
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const prefix = value.replace(/[0-9.]/g, '').replace('+', '');
  const hasPlus = value.includes('+');
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {prefix}{numericValue}{hasPlus ? '+' : ''}{suffix}
    </motion.span>
  );
};

// 3D Card component
const Card3D = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-50, 50], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / 4);
    y.set((e.clientY - centerY) / 4);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      className={`perspective-1000 ${className}`}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden" ref={containerRef}>
      {/* Enhanced background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-accent-purple/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-3xl"
          animate={{ 
            y: [0, -60, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        
        {/* Floating shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border/50 bg-background/60 backdrop-blur-xl z-50">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3 group">
            <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-bold text-xl text-foreground">About Us</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-28"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent-purple/20 border border-primary/30 text-primary mb-8 shadow-lg shadow-primary/10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-medium">AI-Powered Development</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Building the Future of
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
                Web Development
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              We're on a mission to make web application development accessible to everyone 
              through the power of artificial intelligence.
            </motion.p>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-28"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {stats.map((stat, index) => (
              <Card3D key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative p-8 rounded-2xl bg-gradient-to-br from-card/90 via-card/60 to-card/30 border border-white/10 backdrop-blur-xl text-center group overflow-hidden"
                >
                  {/* Animated gradient background */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  
                  {/* Glow effect */}
                  <motion.div
                    className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`}
                  />
                  
                  <div className="relative">
                    <motion.div 
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-5 shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <div className="text-4xl font-bold text-foreground mb-2">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              </Card3D>
            ))}
          </motion.div>

          {/* Mission Cards */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { icon: <Target className="w-8 h-8" />, title: "Our Mission", desc: "To democratize software development by enabling anyone to create professional web applications without extensive coding knowledge.", color: "from-blue-500 to-cyan-500" },
              { icon: <Lightbulb className="w-8 h-8" />, title: "Our Vision", desc: "A world where ideas transform into reality instantly, where the barrier between imagination and implementation disappears.", color: "from-yellow-500 to-orange-500" },
              { icon: <Rocket className="w-8 h-8" />, title: "Our Goal", desc: "To build intelligent tools that understand your vision and deliver production-ready code in minutes, not months.", color: "from-pink-500 to-purple-500" },
            ].map((item, index) => (
              <Card3D key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.9 + index * 0.15, duration: 0.6 }}
                  className="relative h-full p-10 rounded-3xl bg-gradient-to-br from-card/90 via-card/60 to-card/30 border border-white/10 backdrop-blur-xl group overflow-hidden"
                >
                  {/* Animated corner glow */}
                  <motion.div 
                    className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${item.color} opacity-10 blur-3xl`}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  />
                  
                  {/* Floating particles on hover */}
                  <motion.div
                    className={`absolute bottom-4 left-4 w-1.5 h-1.5 bg-gradient-to-r ${item.color} rounded-full opacity-0 group-hover:opacity-100`}
                    animate={{ y: [0, -40, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  
                  <div className="relative">
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-8 shadow-2xl`}
                      whileHover={{ 
                        rotate: 360, 
                        scale: 1.1,
                        boxShadow: '0 0 30px rgba(var(--primary-rgb), 0.5)',
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="text-white">{item.icon}</div>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              </Card3D>
            ))}
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="mb-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                Why Choose Us
              </motion.h2>
              <motion.p 
                className="text-muted-foreground max-w-2xl mx-auto text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Experience the next generation of application development with our cutting-edge AI platform.
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + feature.delay, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative p-8 rounded-2xl bg-gradient-to-br from-card/80 via-card/50 to-card/20 border border-white/10 backdrop-blur-xl group overflow-hidden cursor-default"
                >
                  {/* Hover gradient */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  
                  {/* Scan line */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ y: '-100%' }}
                    whileHover={{ y: '100%' }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  <div className="relative flex gap-6">
                    <motion.div 
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 text-white shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.15 }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {feature.title}
                        <ChevronRight className="inline w-5 h-5 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Story Section */}
          <motion.div 
            className="mb-28"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="relative p-12 rounded-3xl bg-gradient-to-br from-card/90 via-card/60 to-card/30 border border-white/10 backdrop-blur-xl overflow-hidden">
              {/* Animated background elements */}
              <motion.div 
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-accent-purple/10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Floating code symbols */}
              {['<>', '{}', '()', '[]'].map((symbol, i) => (
                <motion.span
                  key={i}
                  className="absolute text-primary/10 text-2xl font-mono font-bold"
                  style={{ right: `${10 + i * 8}%`, top: `${20 + i * 15}%` }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
                >
                  {symbol}
                </motion.span>
              ))}
              
              <div className="relative">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-foreground mb-10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 }}
                >
                  Our Story
                </motion.h2>
                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed max-w-4xl">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7 }}
                  >
                    <span className="text-foreground font-semibold text-xl">DataBuks Studio</span> was born from a simple observation: 
                    building web applications shouldn't require years of learning or expensive development teams. 
                    With advances in artificial intelligence, we saw an opportunity to bridge the gap between ideas and implementation.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                  >
                    Our platform leverages cutting-edge AI models to understand your requirements in plain language 
                    and generate complete, functional web applications. Whether you need a simple landing page or 
                    a complex e-commerce platform, our AI can help you build it.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.9 }}
                  >
                    We support multiple technology stacks including{' '}
                    <motion.span className="text-primary font-medium" whileHover={{ scale: 1.1 }}>PHP</motion.span>,{' '}
                    <motion.span className="text-primary font-medium" whileHover={{ scale: 1.1 }}>Java Spring Boot</motion.span>,{' '}
                    <motion.span className="text-primary font-medium" whileHover={{ scale: 1.1 }}>Python Django</motion.span>,{' '}
                    <motion.span className="text-primary font-medium" whileHover={{ scale: 1.1 }}>ASP.NET</motion.span>, and{' '}
                    <motion.span className="text-primary font-medium" whileHover={{ scale: 1.1 }}>Node.js with React</motion.span>, 
                    giving you the flexibility to choose the right tools for your project.
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Who We Serve</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                From startups to enterprises, we help teams of all sizes build faster.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "Startups", desc: "Quickly prototype and validate your ideas without a large development budget.", icon: "🚀", color: "from-orange-500 to-red-500" },
                { title: "Enterprises", desc: "Accelerate internal tool development and reduce time-to-market.", icon: "🏢", color: "from-blue-500 to-indigo-500" },
                { title: "Freelancers", desc: "Deliver more projects faster with AI-assisted development.", icon: "💻", color: "from-green-500 to-teal-500" },
                { title: "Students", desc: "Learn by seeing how AI structures and implements applications.", icon: "📚", color: "from-purple-500 to-pink-500" },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.1 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="relative p-8 rounded-2xl bg-gradient-to-br from-card/80 via-card/50 to-card/20 border border-white/10 backdrop-blur-xl group hover:border-primary/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover gradient */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  
                  <div className="relative flex items-start gap-5">
                    <motion.span 
                      className="text-4xl"
                      whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      {item.icon}
                    </motion.span>
                    <div>
                      <h4 className="font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors flex items-center gap-2">
                        {item.title}
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div 
            className="mt-24 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
          >
            <motion.div 
              className="relative p-16 rounded-3xl bg-gradient-to-br from-primary/15 via-accent-purple/10 to-cyan-500/10 border border-white/10 backdrop-blur-xl overflow-hidden"
              whileHover={{ scale: 1.01 }}
            >
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-50"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Top light beam */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Transform Your Ideas?</h2>
              <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg">
                Join thousands of developers and businesses who are building faster with AI.
              </p>
              <Link to="/">
                <motion.button
                  className="px-12 py-5 bg-gradient-to-r from-primary via-accent-purple to-primary bg-[length:200%_100%] text-primary-foreground font-semibold rounded-full shadow-2xl shadow-primary/30 text-lg"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 50px hsl(var(--primary) / 0.5)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ 
                    backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
                  }}
                >
                  Start Building Today
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default About;