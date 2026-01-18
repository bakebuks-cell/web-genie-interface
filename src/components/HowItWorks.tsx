import { MessageSquare, Settings, Wand2, Download } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Describe Your App",
    description: "Write a detailed description of the web application you want to build.",
  },
  {
    icon: Settings,
    title: "Choose Technology",
    description: "Select your preferred programming language and framework.",
  },
  {
    icon: Wand2,
    title: "Generate Code",
    description: "Our AI analyzes your requirements and generates production-ready code.",
  },
  {
    icon: Download,
    title: "Download & Deploy",
    description: "Get your complete codebase and deploy it to your preferred hosting.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into working applications in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative text-center group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-border" />
              )}

              {/* Step number */}
              <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl bg-card shadow-medium flex items-center justify-center group-hover:shadow-large transition-shadow duration-300">
                <step.icon className="w-8 h-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
