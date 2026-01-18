import { ShoppingCart, MessageSquare, LayoutDashboard, Users, Calendar, FileText } from "lucide-react";

interface TemplateCardsProps {
  onSelectTemplate: (template: string) => void;
}

const templates = [
  {
    id: "ecommerce",
    name: "E-Commerce Store",
    description: "Full shopping cart with payments",
    icon: ShoppingCart,
  },
  {
    id: "chat",
    name: "Chat Application",
    description: "Real-time messaging platform",
    icon: MessageSquare,
  },
  {
    id: "dashboard",
    name: "Admin Dashboard",
    description: "Analytics and data management",
    icon: LayoutDashboard,
  },
  {
    id: "social",
    name: "Social Network",
    description: "User profiles and connections",
    icon: Users,
  },
  {
    id: "booking",
    name: "Booking System",
    description: "Appointments and reservations",
    icon: Calendar,
  },
  {
    id: "blog",
    name: "Blog Platform",
    description: "Content management system",
    icon: FileText,
  },
];

const TemplateCards = ({ onSelectTemplate }: TemplateCardsProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
        Discover Templates
      </h2>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.description)}
              className="flex-shrink-0 w-56 p-6 rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:bg-accent/30 transition-all duration-300 text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{template.name}</h3>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateCards;
