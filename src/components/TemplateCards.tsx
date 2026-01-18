import { 
  ShoppingCart, 
  MessageSquare, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText,
  Wallet,
  GraduationCap,
  Utensils,
  Building2,
  Briefcase,
  Heart
} from "lucide-react";

interface TemplateCardsProps {
  onSelectTemplate: (template: string, language?: string) => void;
}

const templates = [
  {
    id: "ecommerce",
    name: "E-Commerce Store",
    description: "Online shopping platform with cart, checkout, and payments",
    icon: ShoppingCart,
    language: "node-react",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "chat",
    name: "Chat Application",
    description: "Real-time messaging with user presence",
    icon: MessageSquare,
    language: "node-react",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "dashboard",
    name: "Admin Dashboard",
    description: "Analytics dashboard with charts and data management",
    icon: LayoutDashboard,
    language: "python",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "social",
    name: "Social Network",
    description: "User profiles, posts, and social interactions",
    icon: Users,
    language: "java",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "booking",
    name: "Booking System",
    description: "Appointment scheduling with calendar",
    icon: Calendar,
    language: "php",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "blog",
    name: "Blog Platform",
    description: "Content management with rich text editor",
    icon: FileText,
    language: "python",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    id: "finance",
    name: "Finance Tracker",
    description: "Personal finance with budgets and reports",
    icon: Wallet,
    language: "dotnet",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "lms",
    name: "Learning Platform",
    description: "Online courses with progress tracking",
    icon: GraduationCap,
    language: "node-react",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: "restaurant",
    name: "Restaurant App",
    description: "Menu display and online ordering",
    icon: Utensils,
    language: "php",
    gradient: "from-red-500 to-orange-600",
  },
  {
    id: "realestate",
    name: "Real Estate",
    description: "Property listings with search and filters",
    icon: Building2,
    language: "java",
    gradient: "from-slate-500 to-gray-600",
  },
  {
    id: "portfolio",
    name: "Portfolio Site",
    description: "Professional portfolio showcasing work",
    icon: Briefcase,
    language: "node-react",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "healthcare",
    name: "Healthcare Portal",
    description: "Patient management with appointments",
    icon: Heart,
    language: "dotnet",
    gradient: "from-rose-500 to-red-600",
  },
];

const TemplateCards = ({ onSelectTemplate }: TemplateCardsProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Discover Templates
        </h2>
        <p className="text-muted-foreground text-sm">
          Start with a pre-built template to accelerate your development
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.description, template.language)}
              className="group relative p-5 rounded-2xl glass-card border border-border/50 hover:border-primary/30 transition-all duration-300 text-left overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300
              `} />
              
              {/* Glow effect on hover */}
              <div className={`
                absolute -inset-1 bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300
              `} />
              
              <div className="relative z-10">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4 
                  bg-gradient-to-br ${template.gradient} bg-opacity-20
                  group-hover:scale-110 group-hover:shadow-lg transition-all duration-300
                `}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5 text-sm group-hover:text-primary transition-colors duration-300">
                  {template.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateCards;
