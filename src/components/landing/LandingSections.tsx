import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap, Clock, Puzzle, ArrowRight, ListChecks, Monitor, Rocket,
  Layers, FolderKanban, Share2, Code, Eye, CreditCard,
  Check, MessageSquare, Settings2, Sparkles, Send,
  HelpCircle, User, Briefcase, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import productScreenshot from "@/assets/product-screenshot.png";
import builderPreview from "@/assets/builder-preview.png";

/* ─── animation helpers ─── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const glassCard = "rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/20 hover:translate-y-[-2px]";

/* ─── 1. Why MyCodex ─── */
function WhySection() {
  const features = [
    { icon: Zap, title: "Instant generation", desc: "From idea to working code in seconds." },
    { icon: Clock, title: "Ship faster", desc: "Skip boilerplate. Focus on what's unique." },
    { icon: Puzzle, title: "All-in-one workspace", desc: "Editor, preview, deploy — unified." },
  ];

  return (
    <section className="py-28 md:py-36">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-20 items-center">
          <div>
            <FadeIn>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-5">Why MyCodex</p>
              <h2 className="text-2xl md:text-[1.75rem] font-semibold text-foreground mb-5 leading-snug">
                Stop building from scratch.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Traditional development is slow and fragmented. MyCodex unifies the entire workflow.
              </p>
            </FadeIn>
            <div className="mt-10 space-y-6">
              {features.map((f, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="flex items-start gap-4 group">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/15">
                      <f.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-0.5">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <FadeIn delay={0.15}>
            <div className="rounded-xl overflow-hidden border border-border/20 shadow-lg">
              <img src={productScreenshot} alt="MyCodex workspace" className="w-full" loading="lazy" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── 2. How MyCodex Works (animated stepper) ─── */
function HowItWorks() {
  const steps = [
    { icon: MessageSquare, title: "Describe your idea", desc: "Type what you want to build in plain language." },
    { icon: Settings2, title: "Choose your stack", desc: "Pick a single language or go multi-program." },
    { icon: Sparkles, title: "Generate & refine", desc: "AI writes structured code with live preview." },
    { icon: Code, title: "Edit in IDE", desc: "Fine-tune code directly in the built-in editor." },
    { icon: Send, title: "Publish & share", desc: "Deploy with one click and share a live link." },
  ];

  return (
    <section className="py-28 md:py-36 border-t border-border/10">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <FadeIn>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-5 text-center">Workflow</p>
          <h2 className="text-2xl md:text-[1.75rem] font-semibold text-foreground text-center mb-4">
            How MyCodex works
          </h2>
          <p className="text-muted-foreground text-sm text-center max-w-md mx-auto mb-16">
            Five steps from idea to deployed application.
          </p>
        </FadeIn>

        {/* Desktop: horizontal */}
        <div className="hidden md:grid grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <StepCard step={s} index={i} total={steps.length} />
            </FadeIn>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden space-y-4">
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  {i < steps.length - 1 && <div className="w-px h-8 bg-border/30 mt-2" />}
                </div>
                <div className="pt-1">
                  <p className="text-xs text-primary/60 font-medium mb-0.5">Step {i + 1}</p>
                  <h3 className="text-sm font-medium text-foreground mb-0.5">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, index, total }: { step: { icon: any; title: string; desc: string }; index: number; total: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="relative text-center group">
      {/* Connector line */}
      {index < total - 1 && (
        <motion.div
          className="absolute top-5 left-[60%] right-0 h-px bg-gradient-to-r from-primary/30 to-primary/10 hidden md:block"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
          style={{ transformOrigin: "left" }}
        />
      )}
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3 transition-all group-hover:bg-primary/15 group-hover:border-primary/30">
        <step.icon className="w-4 h-4 text-primary" />
      </div>
      <p className="text-[10px] text-primary/50 font-medium mb-1">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="text-xs font-medium text-foreground mb-1">{step.title}</h3>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{step.desc}</p>
    </div>
  );
}

/* ─── 3. Inside the Builder ─── */
function InsideTheBuilder() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const bullets = [
    { icon: ListChecks, label: "Structured generation steps" },
    { icon: Layers, label: "Multi-Program stack selection" },
    { icon: Monitor, label: "Preview + IDE Code view" },
    { icon: FolderKanban, label: "Projects reopen anytime" },
    { icon: Rocket, label: "Publish + Share link" },
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 4;
    setTilt({ x: -y, y: x });
  };

  return (
    <section className="py-28 md:py-36 border-t border-border/10">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <FadeIn>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-5">Workspace</p>
          <h2 className="text-2xl md:text-[1.75rem] font-semibold text-foreground mb-3">
            Inside the Builder
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mb-14">
            Prompt → Plan → Preview → Code → Publish — without leaving the workspace.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-center">
          <div className="space-y-2">
            {bullets.map((b, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div
                  className="flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200 cursor-default hover:bg-primary/5"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                    hoveredIndex === i ? "bg-primary/20" : "bg-primary/10"
                  }`}>
                    <b.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/80">{b.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.1}>
            <div
              ref={imageRef}
              className="rounded-xl overflow-hidden border border-primary/15 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.12)] transition-shadow duration-300 hover:shadow-[0_0_80px_-15px_hsl(var(--primary)/0.18)]"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            >
              <motion.img
                src={builderPreview}
                alt="MyCodex builder workspace"
                className="w-full"
                loading="lazy"
                animate={{ rotateX: tilt.x, rotateY: tilt.y }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                style={{ transformStyle: "preserve-3d" }}
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
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
    <section className="py-28 md:py-36 border-t border-border/10">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <FadeIn>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-5">Features</p>
              <h2 className="text-2xl md:text-[1.75rem] font-semibold text-foreground mb-4 leading-snug">
                Everything you need to build and ship.
              </h2>
              <p className="text-muted-foreground text-sm max-w-sm">
                A complete development environment designed for speed.
              </p>
            </FadeIn>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="flex items-center gap-3 py-2 group">
                  <f.icon className="w-4 h-4 text-primary shrink-0 transition-colors group-hover:text-primary/80" />
                  <span className="text-sm text-foreground/80">{f.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Why Developers Love It (testimonials) ─── */
function TestimonialsSection() {
  const testimonials = [
    {
      icon: User,
      role: "Frontend Developer",
      quote: "I prototype UI ideas in minutes instead of days. The live preview alone saves me hours of context switching.",
    },
    {
      icon: Briefcase,
      role: "Startup Founder",
      quote: "We shipped our MVP in a weekend. Multi-program mode let us scaffold frontend and backend together.",
    },
    {
      icon: GraduationCap,
      role: "Student Builder",
      quote: "Learning by building real apps changed everything. I can experiment with stacks I've never tried before.",
    },
  ];

  return (
    <section className="py-28 md:py-36 border-t border-border/10">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <FadeIn>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-5 text-center">Community</p>
          <h2 className="text-2xl md:text-[1.75rem] font-semibold text-foreground text-center mb-14">
            Why developers love it
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className={glassCard}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <t.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-primary/70">{t.role}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 6. FAQ ─── */
function FAQSection() {
  const faqs = [
    {
      q: "Do I need to select a language every time?",
      a: "No. You can choose a default stack or switch per project. Multi-Program mode combines multiple technologies in one build.",
    },
    {
      q: "What is Multi-Program mode?",
      a: "It generates a full stack — frontend, backend, and database — in a single project instead of separate layers.",
    },
    {
      q: "Where do my projects save?",
      a: "All projects are saved to your account and accessible from the Projects page. They reopen exactly where you left off.",
    },
    {
      q: "How do credits work?",
      a: "Free accounts get 5 credits per day. Each generation uses one credit. Pro and Enterprise plans include more credits.",
    },
    {
      q: "Can I export code?",
      a: "GitHub export is on the roadmap. For now, copy code from the built-in editor or use Publish to share a live link.",
    },
  ];

  return (
    <section className="py-28 md:py-36 border-t border-border/10">
      <div className="container mx-auto px-6 lg:px-8 max-w-2xl">
        <FadeIn>
          <div className="flex items-center justify-center gap-2 mb-5">
            <HelpCircle className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary">FAQ</p>
          </div>
          <h2 className="text-2xl md:text-[1.75rem] font-semibold text-foreground text-center mb-12">
            Common questions
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/20">
                <AccordionTrigger className="text-sm text-foreground hover:no-underline hover:text-primary transition-colors py-5 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── 7. Final CTA ─── */
function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section className="py-28 md:py-36 border-t border-border/10 relative overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(ellipse, hsl(170 100% 47% / 0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 max-w-xl text-center relative z-10">
        <FadeIn>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Ready to build?
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
            Start free with 5 daily credits. No setup required.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="gap-2"
            >
              Start building <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
            >
              View pricing
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Export ─── */
export default function LandingSections() {
  return (
    <div>
      <WhySection />
      <HowItWorks />
      <InsideTheBuilder />
      <KeyFeatures />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}
