import { Link } from "react-router-dom";
import { ArrowLeft, Database, Target, Lightbulb, Rocket, Users, Zap, Shield, Globe, Star, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

const stats = [
  { icon: <Users className="w-6 h-6" />, value: "10K+", label: "Active Users" },
  { icon: <Code2 className="w-6 h-6" />, value: "50K+", label: "Apps Generated" },
  { icon: <Globe className="w-6 h-6" />, value: "120+", label: "Countries" },
  { icon: <Star className="w-6 h-6" />, value: "4.9", label: "Rating" },
];

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Generate complete applications in minutes, not months. Our AI understands your vision instantly.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Production Ready",
    description: "Every line of code is optimized for performance, security, and scalability from day one.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Clean Architecture",
    description: "Well-structured, maintainable code following industry best practices and design patterns.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multi-Stack Support",
    description: "Choose from PHP, Java, Python, .NET, or Node.js - we support your preferred technology.",
    color: "from-purple-500 to-pink-500",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-purple/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
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
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-accent-purple/20 border border-primary/20 text-primary mb-8"
              whileHover={{ scale: 1.02 }}
            >
              <Database className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Development</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              Building the Future of
              <span className="block bg-gradient-to-r from-primary via-accent-purple to-primary bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient">
                Web Development
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make web application development accessible to everyone 
              through the power of artificial intelligence.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-white/10 backdrop-blur-xl text-center group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission Cards */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: <Target />, title: "Our Mission", desc: "To democratize software development by enabling anyone to create professional web applications without extensive coding knowledge.", color: "from-blue-500 to-cyan-500" },
              { icon: <Lightbulb />, title: "Our Vision", desc: "A world where ideas transform into reality instantly, where the barrier between imagination and implementation disappears.", color: "from-yellow-500 to-orange-500" },
              { icon: <Rocket />, title: "Our Goal", desc: "To build intelligent tools that understand your vision and deliver production-ready code in minutes, not months.", color: "from-pink-500 to-purple-500" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -8 }}
                className="relative p-8 rounded-3xl bg-gradient-to-br from-card/80 to-card/40 border border-white/10 backdrop-blur-xl group overflow-hidden"
              >
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${item.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="relative">
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-7 h-7 text-white">{item.icon}</div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Us</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience the next generation of application development with our cutting-edge AI platform.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative p-8 rounded-2xl bg-gradient-to-br from-card/60 to-card/30 border border-white/10 backdrop-blur-xl group overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className="relative flex gap-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 text-white shadow-lg`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Story Section */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-card/80 to-card/40 border border-white/10 backdrop-blur-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent-purple/10 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-4xl font-bold text-foreground mb-8">Our Story</h2>
                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed max-w-4xl">
                  <p>
                    <span className="text-foreground font-semibold">DataBuks Studio</span> was born from a simple observation: 
                    building web applications shouldn't require years of learning or expensive development teams. 
                    With advances in artificial intelligence, we saw an opportunity to bridge the gap between ideas and implementation.
                  </p>
                  <p>
                    Our platform leverages cutting-edge AI models to understand your requirements in plain language 
                    and generate complete, functional web applications. Whether you need a simple landing page or 
                    a complex e-commerce platform, our AI can help you build it.
                  </p>
                  <p>
                    We support multiple technology stacks including <span className="text-primary">PHP</span>, 
                    <span className="text-primary"> Java Spring Boot</span>, <span className="text-primary">Python Django</span>, 
                    <span className="text-primary"> ASP.NET</span>, and <span className="text-primary">Node.js with React</span>, 
                    giving you the flexibility to choose the right tools for your project.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">Who We Serve</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From startups to enterprises, we help teams of all sizes build faster.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Startups", desc: "Quickly prototype and validate your ideas without a large development budget.", icon: "🚀" },
                { title: "Enterprises", desc: "Accelerate internal tool development and reduce time-to-market.", icon: "🏢" },
                { title: "Freelancers", desc: "Deliver more projects faster with AI-assisted development.", icon: "💻" },
                { title: "Students", desc: "Learn by seeing how AI structures and implements applications.", icon: "📚" },
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="p-6 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 border border-white/10 backdrop-blur-sm group hover:border-primary/30 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-accent-purple/10 border border-white/10 backdrop-blur-xl">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Ideas?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of developers and businesses who are building faster with AI.
              </p>
              <Link to="/">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-primary to-accent-purple text-primary-foreground font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Building Today
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default About;
