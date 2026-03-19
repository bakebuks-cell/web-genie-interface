import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Layers, Code2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import aboutVisionVisual from "@/assets/about-vision-visual.jpg";

/* ── FadeIn helper ── */
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

/* ── Mission cards ── */
const missionCards = [
  {
    icon: Zap,
    title: "Speed",
    description: "Build applications in minutes instead of hours.",
  },
  {
    icon: Layers,
    title: "Flexibility",
    description: "Choose single language or multi-program stacks.",
  },
  {
    icon: Code2,
    title: "Developer-friendly",
    description: "Preview, edit, and publish from one workspace.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* grid bg */}
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
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[450px]"
          style={{
            background:
              "radial-gradient(ellipse, hsl(170 100% 47% / 0.06) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[400px]"
          style={{
            background:
              "radial-gradient(ellipse, hsl(170 80% 40% / 0.04) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <main className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* ── Hero ── */}
          <FadeIn className="text-center mb-20">
            <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-primary/70 mb-4">
              Company
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              <span className="gradient-text">MyCodex</span>
            </h1>
            <p className="text-foreground/45 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              MyCodex is an AI-powered builder that transforms simple prompts
              into full applications — from frontend to backend to database.
            </p>
          </FadeIn>

          {/* ── divider ── */}
          <motion.div
            className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          {/* ── Story ── */}
          <FadeIn className="mb-20">
            <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-primary/70 mb-3">
              The Problem
            </span>
            <div className="space-y-5 max-w-3xl">
              <p className="text-lg text-foreground/55 leading-relaxed">
                Developers spend too much time setting up projects, wiring
                stacks, and writing repetitive code. Boilerplate eats into the
                hours meant for building real features.
              </p>
              <p className="text-lg text-foreground/45 leading-relaxed">
                MyCodex solves this by turning natural language prompts into
                structured applications with modern stacks — clean
                architecture, sensible defaults, and production-ready output
                from the first line.
              </p>
            </div>
          </FadeIn>

          {/* ── Mission Cards ── */}
          <FadeIn className="mb-24">
            <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-primary/70 mb-6">
              Core Principles
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {missionCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group p-6 rounded-xl bg-secondary/30 backdrop-blur-sm
                      border border-border/40 hover:border-primary/30
                      hover:shadow-[0_0_30px_hsl(170_100%_47%/0.06)]
                      transition-all duration-300 cursor-default"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                      <Icon
                        className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground/90 mb-1.5 group-hover:text-foreground transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground/50 transition-colors">
                      {card.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </FadeIn>

          {/* ── Vision ── */}
          <FadeIn className="mb-24">
            <div className="text-center mb-10">
              <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-primary/70 mb-3">
                Vision
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                The Future of Building Software
              </h2>
              <p className="text-foreground/40 text-base max-w-xl mx-auto">
                MyCodex aims to make application development as simple as
                describing what you want — letting AI handle the architecture,
                boilerplate, and wiring.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-border/30">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <img
                src={aboutVisionVisual}
                alt="The future of AI-powered software development"
                className="w-full h-auto object-cover opacity-75"
                loading="lazy"
              />
            </div>
          </FadeIn>

          {/* ── CTA ── */}
          <FadeIn className="text-center">
            <div className="relative py-16 px-8 rounded-2xl border border-border/30 bg-secondary/20 backdrop-blur-sm overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, hsl(170 100% 47% / 0.04), transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Start building with MyCodex
                </h2>
                <p className="text-foreground/40 text-sm mb-8 max-w-md mx-auto">
                  Turn your ideas into production-ready applications.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium
                    text-primary-foreground
                    bg-[image:var(--gradient-primary)]
                    hover:brightness-110 transition-all duration-200
                    shadow-[0_0_20px_hsl(170_100%_47%/0.2)]"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
};

export default About;
