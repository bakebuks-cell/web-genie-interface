import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap, Clock, Puzzle, Eye, Code, Layers, FolderKanban, Share2, CreditCard,
  GraduationCap, Building2, Users, ArrowRight, ListChecks, Monitor, Rocket,
  Timer, BarChart3, Workflow, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import productScreenshot from "@/assets/product-screenshot.png";
import builderPreview from "@/assets/builder-preview.png";

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

/* ─── 3. Live Builder Experience (replaces Templates) ─── */
function LiveBuilderExperience() {
  const bullets = [
    { icon: ListChecks, label: "Prompt → structured plan" },
    { icon: Layers, label: "Multi-program stacks (frontend + backend + database)" },
    { icon: Monitor, label: "Real-time Preview + Code IDE" },
    { icon: FolderKanban, label: "Projects reopen where you left off" },
    { icon: Rocket, label: "One-click Publish + Share link" },
  ];

  return (
    <Section className="border-t border-border/20">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-4">Workspace</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 leading-tight">
            Live builder experience
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mb-14">
            Generate, edit, preview, and publish — all in one workspace.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-center">
          <div className="space-y-4">
            {bullets.map((b, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="flex items-center gap-3 py-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <b.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/80">{b.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.12}>
            <div className="rounded-xl overflow-hidden border border-primary/20 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.15)]">
              <img
                src={builderPreview}
                alt="MyCodex builder workspace with code and live preview"
                className="w-full"
                loading="lazy"
              />
            </div>
          </FadeIn>
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

/* ─── 6. Built for Speed & Clarity (Metrics) ─── */
function MetricsSection() {
  const stats = [
    { icon: Timer, value: "Minutes", label: "to first draft", desc: "From idea to working code — not hours." },
    { icon: Workflow, value: "Multi-stack", label: "ready", desc: "Frontend, backend, and database in one project." },
    { icon: BarChart3, value: "Preview + Code", label: "workflow", desc: "See changes live as you build." },
  ];

  return (
    <Section className="border-t border-border/20">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-4 text-center">Performance</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-14">
            Built for speed & clarity.
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className={card}>
                <s.icon className="w-5 h-5 text-primary mb-4" />
                <p className="text-lg font-semibold text-foreground">{s.value}</p>
                <p className="text-xs font-medium text-primary/70 mb-2">{s.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── 7. FAQ ─── */
function FAQSection() {
  const faqs = [
    {
      q: "Do I need to pick a language every time?",
      a: "No. You can choose a default stack or switch between languages per project. Multi-Program mode also lets you combine multiple technologies in one build.",
    },
    {
      q: "What is Multi-Program mode?",
      a: "It lets you generate a full stack — frontend, backend, and database — in a single project instead of writing each layer separately.",
    },
    {
      q: "Can I reopen my projects later?",
      a: "Yes. All your projects are saved and accessible from the Projects page. They reopen exactly where you left off.",
    },
    {
      q: "How do credits work?",
      a: "Free accounts get 5 credits per day. Each generation uses one credit. Upgrading to Pro or Enterprise gives you more credits and additional features.",
    },
    {
      q: "Can I export code to GitHub?",
      a: "Not yet, but it's on the roadmap. For now you can copy code directly from the built-in editor or use the Publish feature to share a live link.",
    },
  ];

  return (
    <Section className="border-t border-border/20">
      <div className="container mx-auto px-6 lg:px-8 max-w-2xl">
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-4 text-center">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
            Common questions
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/30">
                <AccordionTrigger className="text-sm text-foreground hover:no-underline hover:text-primary transition-colors py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </Section>
  );
}

/* ─── 8. Pricing Teaser ─── */
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
      <LiveBuilderExperience />
      <KeyFeatures />
      <UseCases />
      <MetricsSection />
      <FAQSection />
      <PricingTeaser />
    </div>
  );
}
