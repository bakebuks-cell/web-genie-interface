import { motion } from "framer-motion";
import { 
  Rocket, 
  Settings, 
  Bot, 
  BarChart3, 
  Shield, 
  Globe 
} from "lucide-react";

const technologies = [
  {
    name: "React",
    icon: "⚛️",
    description: "A powerful JavaScript library for building dynamic, interactive user interfaces with component-based architecture.",
    color: "from-cyan-500/20 to-cyan-600/10",
    glowColor: "group-hover:shadow-cyan-500/20",
    borderColor: "group-hover:border-cyan-500/50",
    useCases: [
      "Single Page Applications (SPAs)",
      "Progressive Web Apps (PWAs)",
      "Interactive dashboards & data visualization",
    ],
    benefits: [
      "Component reusability",
      "Virtual DOM for performance",
      "Rich ecosystem & community",
    ],
    projectTypes: "Web apps, Admin panels, E-commerce frontends, SaaS dashboards",
  },
  {
    name: "Node/TS",
    icon: "🟢",
    description: "Server-side JavaScript runtime with TypeScript for building fast, scalable, and type-safe backend applications.",
    color: "from-green-500/20 to-green-600/10",
    glowColor: "group-hover:shadow-green-500/20",
    borderColor: "group-hover:border-green-500/50",
    useCases: [
      "RESTful & GraphQL APIs",
      "Real-time applications (WebSockets)",
      "Microservices architecture",
    ],
    benefits: [
      "Type safety with TypeScript",
      "Non-blocking I/O for scalability",
      "Full-stack JavaScript ecosystem",
    ],
    projectTypes: "APIs, Real-time apps, Backend services, Serverless functions",
  },
  {
    name: "PHP",
    icon: "🐘",
    description: "A versatile server-side scripting language optimized for web development and rapid application building.",
    color: "from-blue-500/20 to-blue-600/10",
    glowColor: "group-hover:shadow-blue-500/20",
    borderColor: "group-hover:border-blue-500/50",
    useCases: [
      "Dynamic web applications",
      "Content management systems",
      "E-commerce platforms",
    ],
    benefits: [
      "Easy deployment & hosting",
      "Mature ecosystem & libraries",
      "Cost-effective development",
    ],
    projectTypes: "Websites, CMS, E-commerce, Custom web apps, APIs",
  },
  {
    name: "Golang",
    icon: "🐹",
    description: "A statically typed, compiled language designed for simplicity, performance, and building reliable concurrent systems.",
    color: "from-sky-500/20 to-sky-600/10",
    glowColor: "group-hover:shadow-sky-500/20",
    borderColor: "group-hover:border-sky-500/50",
    useCases: [
      "High-performance APIs & services",
      "Cloud-native applications",
      "CLI tools & DevOps automation",
    ],
    benefits: [
      "Exceptional performance",
      "Built-in concurrency",
      "Simple & clean syntax",
    ],
    projectTypes: "Microservices, CLI tools, Cloud infrastructure, APIs",
  },
  {
    name: "Python",
    icon: "🐍",
    description: "A versatile, readable programming language ideal for rapid development, automation, and data-driven applications.",
    color: "from-yellow-500/20 to-yellow-600/10",
    glowColor: "group-hover:shadow-yellow-500/20",
    borderColor: "group-hover:border-yellow-500/50",
    useCases: [
      "API development & backends",
      "Data processing & automation",
      "Scripting & task automation",
    ],
    benefits: [
      "Readable & maintainable code",
      "Extensive standard library",
      "Rapid prototyping",
    ],
    projectTypes: "APIs, Automation scripts, Data pipelines, Backend services",
  },
  {
    name: "HTML",
    icon: "📄",
    description: "The foundational markup language for creating and structuring web pages and applications.",
    color: "from-orange-500/20 to-orange-600/10",
    glowColor: "group-hover:shadow-orange-500/20",
    borderColor: "group-hover:border-orange-500/50",
    useCases: [
      "Web page structure & layout",
      "Semantic document markup",
      "Accessible content structure",
    ],
    benefits: [
      "Universal browser support",
      "Easy to learn & implement",
      "SEO-friendly structure",
    ],
    projectTypes: "Landing pages, Static websites, Email templates, Documentation",
  },
  {
    name: "CSS",
    icon: "🎨",
    description: "A styling language for designing beautiful, responsive, and visually engaging web interfaces.",
    color: "from-blue-400/20 to-indigo-500/10",
    glowColor: "group-hover:shadow-blue-400/20",
    borderColor: "group-hover:border-blue-400/50",
    useCases: [
      "Responsive web design",
      "Custom UI styling & theming",
      "Animations & transitions",
    ],
    benefits: [
      "Separation of concerns",
      "Powerful layout systems (Flexbox, Grid)",
      "Cross-browser compatibility",
    ],
    projectTypes: "UI themes, Design systems, Responsive layouts, Animated interfaces",
  },
  {
    name: "JavaScript",
    icon: "🟨",
    description: "The dynamic programming language of the web, enabling interactive and feature-rich applications.",
    color: "from-yellow-400/20 to-amber-500/10",
    glowColor: "group-hover:shadow-yellow-400/20",
    borderColor: "group-hover:border-yellow-400/50",
    useCases: [
      "Interactive web applications",
      "DOM manipulation & events",
      "Browser-based functionality",
    ],
    benefits: [
      "Runs in all browsers",
      "Event-driven programming",
      "Vast ecosystem & libraries",
    ],
    projectTypes: "Interactive sites, Browser tools, Form validation, Client-side apps",
  },
];

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
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {technologies.map((tech) => (
              <TechCard key={tech.name} tech={tech} />
            ))}
          </motion.div>

          {/* What You Can Build Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                What You Can Build with DataBuks Studio
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
