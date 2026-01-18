import { Link } from "react-router-dom";
import { ArrowLeft, Code2, Server, Database, Globe, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const technologies = [
  {
    id: "php",
    name: "PHP",
    icon: "🐘",
    color: "from-indigo-500 to-purple-600",
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

const Technologies = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-lg z-50">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-bold text-xl text-foreground">Supported Technologies</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Code2 className="w-4 h-4" />
              <span className="text-sm font-medium">Technology Stack</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent"> Technology</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We support a variety of popular frameworks and languages to match your project requirements.
            </p>
          </div>

          {/* Technologies Grid */}
          <div className="space-y-8">
            {technologies.map((tech, index) => (
              <div
                key={tech.id}
                className="p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left - Info */}
                  <div className="lg:w-1/3">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center mb-4`}>
                      <span className="text-3xl">{tech.icon}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{tech.name}</h3>
                    <p className="text-muted-foreground">{tech.description}</p>
                  </div>
                  
                  {/* Middle - Features */}
                  <div className="lg:w-1/3">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" />
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {tech.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Right - Use Cases */}
                  <div className="lg:w-1/3">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      Best For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tech.useCases.map((useCase, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full bg-accent text-sm text-foreground"
                        >
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Technologies;
