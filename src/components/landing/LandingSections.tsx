import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap, Clock, Puzzle, Eye, Code, Layers, FolderKanban, Share2, CreditCard,
  GraduationCap, Building2, Users, ArrowRight, LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import productScreenshot from "@/assets/product-screenshot.png";

/* ─── animation helpers ─── */
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`py-24 md:py-32 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const card = "rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-border/60 hover:bg-card/50 hover:translate-y-[-2px]";

/* ─── 1. Why MyCodex ─── */
function WhySection() {
  const features = [
    { icon: Zap, title: "Instant generation", desc: "Describe your idea, get production-ready code in seconds." },
    { icon: Clock, title: "Ship faster", desc: "Skip weeks of boilerplate. Focus on what makes your product unique." },
    { icon: Puzzle, title: "All-in-one workspace", desc: "Editor, preview, and deployment in a single unified environment." },
  ];

  return (
    <Section>
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn>
              <p className="text-xs font-medium tracking-widest uppercase text-primary mb-4">Why MyCodex</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 leading-tight">
                Stop building from scratch.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-10 max-w-md">
                Traditional development is slow, fragmented, and frustrating. MyCodex unifies the entire workflow.
              </p>
            </FadeIn>
            <div className="space-y-5">
              {features.map((f, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-0.5">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <FadeIn delay={0.15}>
            <div className="rounded-xl overflow-hidden border border-border/30 shadow-lg">
              <img src={productScreenshot} alt="MyCodex IDE with live preview" className="w-full" loading="lazy" />
            </div>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}

/* ─── 2. How it Works ─── */
function HowItWorks() {
  const steps = [
    { num: "01", title: "Describe", desc: "Type what you want to build" },
    { num: "02", title: "Configure", desc: "Pick your language or stack" },
    { num: "03", title: "Generate", desc: "AI writes and previews code" },
    { num: "04", title: "Publish", desc: "Deploy with a single click" },
  ];

  return (
    <Section className="border-t border-border/20">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-4 text-center">How it works</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-16">
            Four steps to production.
          </h2>
        </FadeIn>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="text-center lg:text-left">
                <span className="text-2xl font-bold text-primary/30 block mb-3">{s.num}</span>
                <h3 className="text-sm font-medium text-foreground mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── 3. What You Can Build ─── */
function TemplatesGrid() {
  const templates = [
    "Portfolio", "E-commerce", "Dashboard", "Landing Page", "SaaS Starter", "Blog",
  ];

  return (
    <Section className="border-t border-border/20">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-4">Templates</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            What you can build.
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mb-14">
            From simple landing pages to full-stack applications — start with a template or your own idea.
          </p>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {templates.map((t, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div className={card}>
                <div className="h-20 rounded-lg bg-muted/30 mb-4 flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5 text-muted-foreground/40" />
                </div>
                <h3 className="text-sm font-medium text-foreground">{t}</h3>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── 4. Key Features ─── */
function KeyFeatures() {
  const features = [
    { icon: Eye, label: "Live preview" },
    { icon: Code, label: "Built-in code editor" },
    { icon: Layers, label: "Multi-program stacks" },
    { icon: FolderKanban, label: "Project management" },
    { icon: Share2, label: "One-click publish" },
    { icon: CreditCard, label: "Flexible plans" },
  ];

  return (
    <Section className="border-t border-border/20">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <FadeIn>
              <p className="text-xs font-medium tracking-widest uppercase text-primary mb-4">Features</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
                Everything you need to build and ship.
              </h2>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                A complete development environment designed for speed.
              </p>
            </FadeIn>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="flex items-center gap-3 py-3">
                  <f.icon className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm text-foreground/80">{f.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── 5. Use Cases ─── */
function UseCases() {
  const cases = [
    { icon: GraduationCap, title: "Students", desc: "Learn by building real apps, not toy examples." },
    { icon: Building2, title: "Startups", desc: "Ship MVPs fast without hiring a full team." },
    { icon: Users, title: "Teams", desc: "Prototype and iterate with shared access." },
  ];

  return (
    <Section className="border-t border-border/20">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-4 text-center">Use cases</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-14">
            Built for builders.
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className={card}>
                <c.icon className="w-5 h-5 text-primary mb-4" />
                <h3 className="text-sm font-medium text-foreground mb-2">{c.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            </FadeIn>
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
    <Section className="border-t border-border/20">
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
        <FadeIn>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Ready to start building?
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Start free with 5 daily credits. Upgrade anytime.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/pricing")}
            className="gap-2"
          >
            View Plans <ArrowRight className="w-4 h-4" />
          </Button>
        </FadeIn>
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
