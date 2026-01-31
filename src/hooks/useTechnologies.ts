import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Technology {
  id: string;
  name: string;
  type: string;
  icon: string | null;
  description: string | null;
  created_at: string;
}

// Hardcoded styling info that maps to DB entries
const techStyles: Record<string, {
  color: string;
  glowColor: string;
  borderColor: string;
  useCases: string[];
  benefits: string[];
  projectTypes: string;
}> = {
  "React": {
    color: "from-cyan-500/20 to-cyan-600/10",
    glowColor: "group-hover:shadow-cyan-500/20",
    borderColor: "group-hover:border-cyan-500/50",
    useCases: ["Single Page Applications (SPAs)", "Progressive Web Apps (PWAs)", "Interactive dashboards & data visualization"],
    benefits: ["Component reusability", "Virtual DOM for performance", "Rich ecosystem & community"],
    projectTypes: "Web apps, Admin panels, E-commerce frontends, SaaS dashboards",
  },
  "Node/TS": {
    color: "from-green-500/20 to-green-600/10",
    glowColor: "group-hover:shadow-green-500/20",
    borderColor: "group-hover:border-green-500/50",
    useCases: ["RESTful & GraphQL APIs", "Real-time applications (WebSockets)", "Microservices architecture"],
    benefits: ["Type safety with TypeScript", "Non-blocking I/O for scalability", "Full-stack JavaScript ecosystem"],
    projectTypes: "APIs, Real-time apps, Backend services, Serverless functions",
  },
  "PHP": {
    color: "from-blue-500/20 to-blue-600/10",
    glowColor: "group-hover:shadow-blue-500/20",
    borderColor: "group-hover:border-blue-500/50",
    useCases: ["Dynamic web applications", "Content management systems", "E-commerce platforms"],
    benefits: ["Easy deployment & hosting", "Mature ecosystem & libraries", "Cost-effective development"],
    projectTypes: "Websites, CMS, E-commerce, Custom web apps, APIs",
  },
  "Golang": {
    color: "from-sky-500/20 to-sky-600/10",
    glowColor: "group-hover:shadow-sky-500/20",
    borderColor: "group-hover:border-sky-500/50",
    useCases: ["High-performance APIs & services", "Cloud-native applications", "CLI tools & DevOps automation"],
    benefits: ["Exceptional performance", "Built-in concurrency", "Simple & clean syntax"],
    projectTypes: "Microservices, CLI tools, Cloud infrastructure, APIs",
  },
  "Python": {
    color: "from-yellow-500/20 to-yellow-600/10",
    glowColor: "group-hover:shadow-yellow-500/20",
    borderColor: "group-hover:border-yellow-500/50",
    useCases: ["API development & backends", "Data processing & automation", "Scripting & task automation"],
    benefits: ["Readable & maintainable code", "Extensive standard library", "Rapid prototyping"],
    projectTypes: "APIs, Automation scripts, Data pipelines, Backend services",
  },
  "HTML": {
    color: "from-orange-500/20 to-orange-600/10",
    glowColor: "group-hover:shadow-orange-500/20",
    borderColor: "group-hover:border-orange-500/50",
    useCases: ["Web page structure & layout", "Semantic document markup", "Accessible content structure"],
    benefits: ["Universal browser support", "Easy to learn & implement", "SEO-friendly structure"],
    projectTypes: "Landing pages, Static websites, Email templates, Documentation",
  },
  "CSS": {
    color: "from-blue-400/20 to-indigo-500/10",
    glowColor: "group-hover:shadow-blue-400/20",
    borderColor: "group-hover:border-blue-400/50",
    useCases: ["Responsive web design", "Custom UI styling & theming", "Animations & transitions"],
    benefits: ["Separation of concerns", "Powerful layout systems (Flexbox, Grid)", "Cross-browser compatibility"],
    projectTypes: "UI themes, Design systems, Responsive layouts, Animated interfaces",
  },
  "JavaScript": {
    color: "from-yellow-400/20 to-amber-500/10",
    glowColor: "group-hover:shadow-yellow-400/20",
    borderColor: "group-hover:border-yellow-400/50",
    useCases: ["Interactive web applications", "DOM manipulation & events", "Browser-based functionality"],
    benefits: ["Runs in all browsers", "Event-driven programming", "Vast ecosystem & libraries"],
    projectTypes: "Interactive sites, Browser tools, Form validation, Client-side apps",
  },
  "Plain HTML/CSS/JS": {
    color: "from-emerald-500/20 to-teal-600/10",
    glowColor: "group-hover:shadow-emerald-500/20",
    borderColor: "group-hover:border-emerald-500/50",
    useCases: ["Static websites", "Simple web applications", "Learning web fundamentals"],
    benefits: ["No build tools required", "Fast loading times", "Easy deployment"],
    projectTypes: "Landing pages, Portfolios, Simple web apps, Prototypes",
  },
};

const defaultStyle = {
  color: "from-gray-500/20 to-gray-600/10",
  glowColor: "group-hover:shadow-gray-500/20",
  borderColor: "group-hover:border-gray-500/50",
  useCases: ["General purpose development"],
  benefits: ["Flexible and versatile"],
  projectTypes: "Various applications",
};

export function useTechnologies() {
  return useQuery({
    queryKey: ["technologies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technologies")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching technologies:", error);
        throw error;
      }

      return data as Technology[];
    },
  });
}

// Get technologies with styling info for the Technologies page
export function useTechnologiesWithStyles() {
  const { data: technologies, isLoading, error } = useTechnologies();

  const technologiesWithStyles = technologies?.map((tech) => ({
    ...tech,
    ...(techStyles[tech.name] || defaultStyle),
  }));

  return { technologies: technologiesWithStyles, isLoading, error };
}

// Get languages for the dropdown (excludes stacks like "Plain HTML/CSS/JS" shown separately)
export function useLanguagesForDropdown() {
  const { data: technologies, isLoading, error } = useTechnologies();

  // Map DB entries to dropdown format
  const languages = technologies?.map((tech) => ({
    id: tech.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
    name: tech.name,
    icon: tech.icon || "📦",
    dbId: tech.id,
  }));

  return { languages, isLoading, error };
}
