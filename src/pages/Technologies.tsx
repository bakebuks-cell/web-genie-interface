import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import techHeroVisual from "@/assets/tech-hero-visual.jpg";

/* ── animation helper ── */
const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ── all technologies in a single flat list ── */
const allTechnologies = [
  { name: "React", desc: "Component-driven UI library for building interactive interfaces." },
  { name: "Next.js", desc: "Full-stack React framework with SSR, routing, and API layers." },
  { name: "HTML", desc: "The foundational markup language of the web." },
  { name: "CSS", desc: "Styling language for layout, typography, and visual design." },
  { name: "JavaScript", desc: "The universal scripting language powering modern web apps." },
  { name: "Node.js", desc: "Server-side JavaScript runtime for scalable backend services." },
  { name: "Django", desc: "High-level Python framework for rapid, secure web development." },
  { name: "Spring Boot", desc: "Enterprise Java framework for production-grade microservices." },
  { name: "ASP.NET", desc: "Microsoft's cross-platform framework for high-performance APIs." },
  { name: "PHP", desc: "Battle-tested server language powering millions of web applications." },
  { name: "Supabase", desc: "Open-source backend with auth, storage, and real-time database." },
  { name: "PostgreSQL", desc: "Advanced relational database trusted by enterprise teams." },
  { name: "MongoDB", desc: "Flexible document database for modern application data." },
];

const flowSteps = [
  { label: "Prompt", sub: "Describe your app" },
  { label: "AI Engine", sub: "Analyze & plan" },
  { label: "Code Generation", sub: "Structured output" },
  { label: "Database Setup", sub: "Schema & tables" },
  { label: "Deploy Ready", sub: "Ship instantly" },
];

/* ── tech card ── */
const TechCard = ({ tech, index }: { tech: typeof allTechnologies[0]; index: number }) => (
  <FadeIn delay={index * 0.04}>
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative h-full p-6 rounded-xl
        bg-card/40 backdrop-blur-sm
        border border-border/30
        hover:border-primary/30
        hover:shadow-[0_0_40px_hsl(170_100%_47%/0.08)]
        transition-all duration-300 cursor-default"
    >
      {/* subtle top-edge glow on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/40 transition-all duration-500 rounded-t-xl" />

      <h3 className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors mb-2">
        {tech.name}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground/50 transition-colors">
        {tech.desc}
      </p>
    </motion.div>
  </FadeIn>
);

/* ── flow step ── */
const FlowStep = ({ step, index }: { step: typeof flowSteps[0]; index: number }) => (
  <FadeIn delay={0.1 * index} className="flex items-center gap-3 md:gap-4">
    <div className="flex flex-col items-center text-center min-w-[100px]">
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
        <span className="text-xs font-bold text-primary">{index + 1}</span>
      </div>
      <span className="text-sm font-medium text-foreground/90">{step.label}</span>
      <span className="text-[11px] text-muted-foreground mt-0.5">{step.sub}</span>
    </div>
    {index < flowSteps.length - 1 && (
      <ArrowRight className="w-4 h-4 text-primary/40 flex-shrink-0 hidden md:block" />
    )}
  </FadeIn>
);

/* ── page ── */
const Technologies = () => {
  return (
    <div className="relative overflow-hidden">
      {/* dot grid bg */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 0.5px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
          style={{
            background:
              "radial-gradient(ellipse, hsl(170 100% 47% / 0.07) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <main className="relative z-10 pt-16 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* ── Hero ── */}
          <FadeIn className="text-center mb-20">
            <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-primary/70 mb-4">
              Technology Stack
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight">
              Built on modern,{" "}
              <span className="gradient-text">reliable</span> technologies
            </h1>
            <p className="text-foreground/45 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              MyCodex uses modern technologies to generate fast, scalable
              applications — from frontend interfaces to backend APIs and
              databases.
            </p>
          </FadeIn>

          {/* ── Flat Technology Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-28">
            {allTechnologies.map((tech, i) => (
              <TechCard key={tech.name} tech={tech} index={i} />
            ))}
          </div>

          {/* ── Visual Section ── */}
          <FadeIn className="mb-28">
            <div className="relative rounded-2xl overflow-hidden border border-border/30">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <img
                src={techHeroVisual}
                alt="AI generating code architecture visualization"
                className="w-full h-auto object-cover opacity-80"
                loading="lazy"
              />
            </div>
          </FadeIn>

          {/* ── Architecture Flow ── */}
          <FadeIn className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-primary/70 mb-3">
                How it works
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                How MyCodex Generates Applications
              </h2>
            </div>
            <div className="flex flex-wrap justify-center items-start gap-4 md:gap-2">
              {flowSteps.map((step, i) => (
                <FlowStep key={step.label} step={step} index={i} />
              ))}
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
};

export default Technologies;
