import { Link } from "react-router-dom";
import { ArrowLeft, MousePointer, MessageSquare, Code, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Choose Your Technology",
    description: "Select from our supported tech stacks including PHP, Java Spring Boot, Python Django, ASP.NET, and Node.js + React. Pick the one that best fits your project needs.",
    icon: MousePointer,
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "Describe Your Idea",
    description: "Use natural language to describe what you want to build. Be as detailed or as simple as you like - our AI understands context and requirements.",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    title: "Generate Your App",
    description: "Click generate and watch as AI creates your complete web application with proper architecture, styling, and functionality.",
    icon: Code,
    color: "from-orange-500 to-red-500",
  },
  {
    number: "04",
    title: "Refine with Chat",
    description: "Use the built-in chat to make changes, add features, or adjust the design. Simply type what you want and the AI updates your app in real-time.",
    icon: Rocket,
    color: "from-green-500 to-teal-500",
  },
];

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-lg z-50">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-bold text-xl text-foreground">How It Works</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              From Idea to App in
              <span className="bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent"> Minutes</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform makes building web applications as simple as having a conversation.
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent-purple to-primary/30 hidden md:block" />
            
            <div className="space-y-16">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Step Number */}
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 md:pt-2">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-sm font-bold text-primary">{step.number}</span>
                        <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-lg text-muted-foreground max-w-2xl">{step.description}</p>
                      
                      {index < steps.length - 1 && (
                        <div className="mt-6 flex items-center gap-2 text-muted-foreground md:hidden">
                          <ArrowRight className="w-4 h-4" />
                          <span className="text-sm">Next step</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent-purple/10 border border-primary/20">
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6">
                Turn your ideas into reality with our AI-powered web app builder.
              </p>
              <Link to="/">
                <Button size="lg" className="px-8 rounded-xl bg-gradient-to-r from-primary to-accent-purple hover:opacity-90">
                  Start Building Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorksPage;
