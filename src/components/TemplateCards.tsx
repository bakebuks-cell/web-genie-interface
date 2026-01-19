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
  onSelectTemplate: (template: string) => void;
}

const templates = [
  {
    id: "ecommerce",
    name: "E-Commerce Store",
    description: "Online shopping platform with cart, checkout, and payment integration",
    icon: ShoppingCart,
  },
  {
    id: "chat",
    name: "Chat Application",
    description: "Real-time messaging with user presence and notifications",
    icon: MessageSquare,
  },
  {
    id: "dashboard",
    name: "Admin Dashboard",
    description: "Analytics dashboard with charts, tables, and data management",
    icon: LayoutDashboard,
  },
  {
    id: "social",
    name: "Social Network",
    description: "User profiles, posts, comments, and social interactions",
    icon: Users,
  },
  {
    id: "booking",
    name: "Booking System",
    description: "Appointment scheduling with calendar and notifications",
    icon: Calendar,
  },
  {
    id: "blog",
    name: "Blog Platform",
    description: "Content management with rich text editor and categories",
    icon: FileText,
  },
  {
    id: "finance",
    name: "Finance Tracker",
    description: "Personal finance management with budgets and reports",
    icon: Wallet,
  },
  {
    id: "lms",
    name: "Learning Platform",
    description: "Online courses with lessons, quizzes, and progress tracking",
    icon: GraduationCap,
  },
  {
    id: "restaurant",
    name: "Restaurant App",
    description: "Menu display, online ordering, and table reservations",
    icon: Utensils,
  },
  {
    id: "realestate",
    name: "Real Estate",
    description: "Property listings with search, filters, and virtual tours",
    icon: Building2,
  },
  {
    id: "portfolio",
    name: "Portfolio Site",
    description: "Professional portfolio showcasing projects and skills",
    icon: Briefcase,
  },
  {
    id: "healthcare",
    name: "Healthcare Portal",
    description: "Patient management with appointments and medical records",
    icon: Heart,
  },
];

const TemplateCards = ({ onSelectTemplate }: TemplateCardsProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
        Discover Templates
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.description)}
              className="p-5 rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:bg-accent/30 transition-all duration-300 text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5 text-sm">{template.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateCards;
