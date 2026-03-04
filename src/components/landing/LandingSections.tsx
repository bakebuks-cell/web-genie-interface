import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, CheckCircle, Lightbulb, Layers, Wand2, Rocket,
  Eye, Code, FolderKanban, Share2, CreditCard, Monitor,
  GraduationCap, Building2, Users, ArrowRight, LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import productScreenshot from "@/assets/product-screenshot.png";

/* ─── animation helpers ─── */
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`py-20 md:py-28 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function StaggerItem({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const glassCard = "rounded-xl border border-border/60 bg-card/60 backdrop-blur-md p-6 shadow-soft";

/* ─── 1. Why MyCodex ─── */
function WhySection() {
  const problems = [
    { icon: AlertTriangle, text: "Building from scratch takes weeks" },
    { icon: AlertTriangle, text: "Switching between tools kills flow" },
    { icon: AlertTriangle, text: "Deployment is still painful" },
  ];
  const solutions = [
    { icon: CheckCircle, text: "Generate production code in seconds" },
    { icon: CheckCircle, text: "Unified editor, preview & deploy" },
    { icon: CheckCircle, text: "One-click publish to the web" },
  ];

  return (
    <Section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Why <span className="gradient-text">MyCodex</span>?
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-14 text-sm md:text-base">
          Traditional development is slow, fragmented, and frustrating. We fixed that.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-14">
          {/* Problems */}
          <div className={`${glassCard} space-y-5`}>
            <h3 className="text-lg font-semibold text-destructive/80 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> The Problem
            </h3>
            {problems.map((p, i) => (
              <StaggerItem key={i} index={i}>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <p.icon className="w-4 h-4 mt-0.5 text-destructive/60 shrink-0" />
                  <span className="text-sm">{p.text}</span>
                </div>
              </StaggerItem>
            ))}
          </div>
          {/* Solutions */}
          <div className={`${glassCard} space-y-5 border-primary/30`}>
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> The Solution
            </h3>
            {solutions.map((s, i) => (
              <StaggerItem key={i} index={i}>
                <div className="flex items-start gap-3 text-foreground/80">
                  <s.icon className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <span className="text-sm">{s.text}</span>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>

        {/* Product screenshot */}
        <motion.div
          className="max-w-4xl mx-auto rounded-xl overflow-hidden border border-border/40 shadow-large"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <img src={productScreenshot} alt="MyCodex IDE with live preview" className="w-full" loading="lazy" />
        </motion.div>
      </div>
    </Section>
  );
}

/* ─── 2. How it Works ─── */
function HowItWorks() {
  const steps = [
    { icon: Lightbulb, title: "Describe your idea", desc: "Type a prompt describing what you want to build." },
    { icon: Layers, title: "Choose your stack", desc: "Pick a single language or a multi-program stack." },
    { icon: Wand2, title: "Generate & edit", desc: "AI writes the code — preview and edit in real time." },
    { icon: Rocket, title: "Publish", desc: "Deploy your project with one click and share it." },
  ];

  return (
    <Section className="bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-foreground">
          How it <span className="gradient-text">Works</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <StaggerItem key={i} index={i}>
              <div className={`${glassCard} text-center group hover:border-primary/40 transition-colors duration-300`}>
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary/60 mb-2 block">Step {i + 1}</span>
                <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── 3. What You Can Build ─── */
function TemplatesGrid() {
  const templates = [
    { name: "Portfolio", color: "from-primary/20 to-primary/5" },
    { name: "E-commerce", color: "from-primary/15 to-accent/5" },
    { name: "Dashboard", color: "from-accent/20 to-primary/5" },
    { name: "Landing Page", color: "from-primary/10 to-secondary" },
    { name: "SaaS Starter", color: "from-accent/15 to-primary/10" },
  ];

  return (
    <Section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          What you can <span className="gradient-text">build</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-lg mx-auto mb-14 text-sm md:text-base">
          From simple landing pages to full-stack SaaS — start with a template or your own idea.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {templates.map((t, i) => (
            <StaggerItem key={i} index={i}>
              <div
                className={`${glassCard} group cursor-pointer hover:shadow-glow hover:border-primary/40 transition-all duration-300`}
              >
                <div className={`h-28 rounded-lg bg-gradient-to-br ${t.color} mb-4 flex items-center justify-center`}>
                  <LayoutGrid className="w-8 h-8 text-primary/40 group-hover:text-primary/70 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground">{t.name}</h3>
              </div>
            </StaggerItem>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── 4. Key Features ─── */
function KeyFeatures() {
  const features = [
    { icon: Eye, title: "Live Preview", desc: "See your app render in real time as code is generated." },
    { icon: Code, title: "Built-in Code IDE", desc: "Edit, refine, and iterate — all in one window." },
    { icon: Layers, title: "Multi-program Stacks", desc: "Combine frontend, backend, and database in a single project." },
    { icon: FolderKanban, title: "Project Saving", desc: "Your work is saved and accessible from any device." },
    { icon: Share2, title: "Publish & Share", desc: "Deploy with one click and share a live URL." },
    { icon: CreditCard, title: "Flexible Plans", desc: "Start free. Scale when you're ready." },
  ];

  return (
    <Section className="bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-foreground">
          Key <span className="gradient-text">Features</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <StaggerItem key={i} index={i}>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── 5. Use Cases ─── */
function UseCases() {
  const cases = [
    { icon: GraduationCap, title: "Students", desc: "Learn by building. Turn class projects into real apps in minutes." },
    { icon: Building2, title: "Startups", desc: "Ship MVPs fast. Validate ideas without hiring a full dev team." },
    { icon: Users, title: "Teams", desc: "Prototype together. Iterate rapidly with shared project access." },
  ];

  return (
    <Section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-foreground">
          Built for <span className="gradient-text">everyone</span>
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {cases.map((c, i) => (
            <StaggerItem key={i} index={i}>
              <div className={`${glassCard} text-center relative overflow-hidden group hover:border-primary/30 transition-colors`}>
                {/* shimmer bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <c.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── 6. Pricing Teaser ─── */
function PricingTeaser() {
  const navigate = useNavigate();
  return (
    <Section className="bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Ready to start building?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm md:text-base">
          Start free with 5 daily credits. Upgrade anytime for unlimited access.
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/pricing")}
          className="gap-2 shadow-glow"
        >
          View Plans <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Section>
  );
}

/* ─── Export ─── */
export default function LandingSections() {
  return (
    <div>
      <WhySection />
      <HowItWorks />
      <TemplatesGrid />
      <KeyFeatures />
      <UseCases />
      <PricingTeaser />
    </div>
  );
}
