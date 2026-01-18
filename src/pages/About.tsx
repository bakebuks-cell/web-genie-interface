import { Link } from "react-router-dom";
import { ArrowLeft, Database, Target, Lightbulb, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-lg z-50">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-bold text-xl text-foreground">About Us</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Database className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Development</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Building the Future of
              <span className="bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent"> Web Development</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make web application development accessible to everyone through the power of artificial intelligence.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To democratize software development by enabling anyone to create professional web applications without extensive coding knowledge.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Our Vision</h3>
              <p className="text-muted-foreground">
                A world where ideas transform into reality instantly, where the barrier between imagination and implementation disappears.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Our Goal</h3>
              <p className="text-muted-foreground">
                To build intelligent tools that understand your vision and deliver production-ready code in minutes, not months.
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                DataBuks Studio was born from a simple observation: building web applications shouldn't require years of learning or expensive development teams. With advances in artificial intelligence, we saw an opportunity to bridge the gap between ideas and implementation.
              </p>
              <p>
                Our platform leverages cutting-edge AI models to understand your requirements in plain language and generate complete, functional web applications. Whether you need a simple landing page or a complex e-commerce platform, our AI can help you build it.
              </p>
              <p>
                We support multiple technology stacks including PHP, Java Spring Boot, Python Django, ASP.NET, and Node.js with React, giving you the flexibility to choose the right tools for your project.
              </p>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Startups", desc: "Quickly prototype and validate your ideas without a large development budget." },
                { title: "Enterprises", desc: "Accelerate internal tool development and reduce time-to-market." },
                { title: "Freelancers", desc: "Deliver more projects faster with AI-assisted development." },
                { title: "Students", desc: "Learn by seeing how AI structures and implements applications." },
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-xl bg-accent/30 border border-border">
                  <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
