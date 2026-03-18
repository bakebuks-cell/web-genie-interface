import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  Check,
  Layers3,
  MousePointerClick,
  Rocket,
  Sparkles,
  Wand2,
  Workflow,
  Gauge,
  Braces,
} from "lucide-react";
import { Link } from "react-router-dom";
import aboutVisionVisual from "@/assets/about-vision-visual.jpg";
import builderPreview from "@/assets/builder-preview.png";
import dashboardPreview from "@/assets/dashboard-preview.png";
import productScreenshot from "@/assets/product-screenshot.png";

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
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ParallaxVisual = ({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [36, -36]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
};

const whatWeDoCards = [
  {
    icon: Wand2,
    title: "Prompt to product",
    description: "Turn a plain-language idea into a structured application flow in a single workspace.",
  },
  {
    icon: Gauge,
    title: "Ship faster",
    description: "Move from concept to working output quickly without losing momentum on setup and boilerplate.",
  },
  {
    icon: Braces,
    title: "Less manual coding",
    description: "Reduce repetitive implementation work so developers can focus on product decisions and refinement.",
  },
  {
    icon: Layers3,
    title: "Stack-aware generation",
    description: "Work across frontend, backend, and data flows with one clear prompt-driven starting point.",
  },
];

const whyMyCodexPoints = [
  {
    title: "Speed",
    description: "Generate real application structure in minutes instead of spending hours assembling the baseline.",
  },
  {
    title: "Simplicity",
    description: "Start with a prompt, not a maze of configuration screens, package installs, and setup decisions.",
  },
  {
    title: "Flexibility",
    description: "Support single-language builds or multi-stack workflows without forcing one rigid way of working.",
  },
  {
    title: "Real-time editing",
    description: "Refine the result visually and iteratively so the output keeps improving as the product evolves.",
  },
];

const workflowSteps = [
  {
    icon: Sparkles,
    title: "Describe your idea",
    description: "Start with the product you want to build, in plain language.",
  },
  {
    icon: Layers3,
    title: "Select stack",
    description: "Choose a focused language path or combine technologies for a broader build.",
  },
  {
    icon: Rocket,
    title: "Generate app",
    description: "MyCodex transforms the prompt into a working application foundation.",
  },
  {
    icon: MousePointerClick,
    title: "Edit & deploy",
    description: "Refine details, polish the experience, and move toward launch faster.",
  },
];

const About = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 0.5px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-0 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.14) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.04, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-28 top-[28rem] h-[24rem] w-[24rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.09) 0%, transparent 72%)",
          }}
          animate={{ opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <main className="relative z-10 px-6 pb-24 pt-20 md:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-24 md:space-y-28">
          <section className="pt-8 md:pt-12">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
              <FadeIn>
                <span className="mb-5 inline-flex items-center rounded-full border border-border/60 bg-secondary/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-primary/75 backdrop-blur-sm">
                  About
                </span>
                <h1 className="max-w-xl text-4xl font-semibold leading-[1.02] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  About <span className="gradient-text">MyCodex</span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-foreground/60 md:text-lg">
                  MyCodex is an AI-powered prompt-to-app builder designed to turn ideas into production-ready software faster, with less setup, less repetition, and a much smoother path from concept to launch.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    "AI-powered application generation",
                    "Built for faster product iteration",
                    "Multi-stack friendly workflows",
                    "A cleaner path from prompt to product",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/20 px-4 py-3 backdrop-blur-sm"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                        <Check className="h-4 w-4 text-primary" strokeWidth={2} />
                      </div>
                      <p className="text-sm text-foreground/70">{item}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.08} className="relative">
                <div className="absolute inset-0 rounded-[2rem] bg-primary/10 blur-3xl" />
                <motion.div
                  className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-secondary/25 p-3 shadow-[0_20px_80px_hsl(var(--background)/0.5)] backdrop-blur-xl"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                >
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      background:
                        "radial-gradient(circle at 70% 20%, hsl(var(--primary) / 0.15), transparent 28%)",
                    }}
                  />
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-border/50 bg-card/70">
                    <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/10 to-transparent" />
                    <motion.img
                      src={aboutVisionVisual}
                      alt="Abstract AI and code-inspired visual representing MyCodex"
                      loading="eager"
                      className="h-[28rem] w-full object-cover opacity-85 md:h-[32rem]"
                      animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
                      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              </FadeIn>
            </div>
          </section>

          <section>
            <FadeIn className="mb-10 md:mb-12">
              <div className="max-w-2xl">
                <span className="mb-4 inline-block text-[11px] font-medium uppercase tracking-[0.24em] text-primary/70">
                  What we do
                </span>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Built to remove the drag between an idea and a working product.
                </h2>
                <p className="mt-4 text-base leading-8 text-foreground/55">
                  MyCodex helps teams move faster by converting prompts into real application direction, reducing manual coding overhead, and keeping the build experience practical, modern, and focused.
                </p>
              </div>
            </FadeIn>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {whatWeDoCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <FadeIn key={card.title} delay={index * 0.06}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="group h-full rounded-[1.35rem] border border-border/60 bg-secondary/25 p-6 backdrop-blur-xl shadow-[0_10px_40px_hsl(var(--background)/0.35)]"
                    >
                      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15">
                        <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                      </div>
                      <h3 className="text-lg font-medium text-foreground">{card.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-foreground/55">
                        {card.description}
                      </p>
                    </motion.div>
                  </FadeIn>
                );
              })}
            </div>
          </section>

          <section>
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
              <FadeIn>
                <span className="mb-4 inline-block text-[11px] font-medium uppercase tracking-[0.24em] text-primary/70">
                  Why MyCodex
                </span>
                <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  A faster, cleaner workflow for building modern applications.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-foreground/55">
                  MyCodex combines velocity with structure, giving teams a more realistic way to go from idea to implementation without the usual setup friction.
                </p>

                <div className="mt-8 space-y-4">
                  {whyMyCodexPoints.map((point, index) => (
                    <FadeIn key={point.title} delay={index * 0.05}>
                      <div className="flex gap-4 rounded-2xl border border-border/50 bg-secondary/18 px-5 py-4 backdrop-blur-sm">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                          <Check className="h-4 w-4 text-primary" strokeWidth={2.2} />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-foreground">{point.title}</h3>
                          <p className="mt-1 text-sm leading-7 text-foreground/55">{point.description}</p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <div className="relative rounded-[2rem] border border-border/60 bg-secondary/20 p-4 backdrop-blur-xl">
                  <div className="absolute left-12 top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-border/50 bg-card/70 p-4 md:p-5">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-primary/70">Live builder flow</p>
                        <h3 className="mt-2 text-lg font-medium text-foreground">Real-time app generation</h3>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                        <Workflow className="h-5 w-5 text-primary" strokeWidth={1.8} />
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                      <div className="space-y-3">
                        {[
                          "Prompt-first workflow",
                          "Multi-stack friendly",
                          "Refine output quickly",
                        ].map((item) => (
                          <div
                            key={item}
                            className="rounded-xl border border-border/50 bg-background/35 px-4 py-3 text-sm text-foreground/70"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                      <motion.div
                        className="overflow-hidden rounded-[1.25rem] border border-border/50"
                        whileHover={{ scale: 1.015 }}
                        transition={{ duration: 0.25 }}
                      >
                        <img
                          src={builderPreview}
                          alt="MyCodex builder interface preview"
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          <section>
            <FadeIn className="mb-10 md:mb-12">
              <div className="max-w-2xl">
                <span className="mb-4 inline-block text-[11px] font-medium uppercase tracking-[0.24em] text-primary/70">
                  Visual showcase
                </span>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Examples of the product experiences teams can shape with MyCodex.
                </h2>
              </div>
            </FadeIn>

            <div className="grid gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
              <FadeIn className="lg:col-span-7 lg:row-span-2">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="group relative h-full min-h-[22rem] overflow-hidden rounded-[2rem] border border-border/60 bg-secondary/20 p-3 backdrop-blur-xl"
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-border/50">
                    <ParallaxVisual
                      src={dashboardPreview}
                      alt="Dashboard-style application preview generated with MyCodex"
                      className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </motion.div>
              </FadeIn>

              <FadeIn delay={0.05} className="lg:col-span-5">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-secondary/20 p-3 backdrop-blur-xl"
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-border/50">
                    <ParallaxVisual
                      src={productScreenshot}
                      alt="Modern UI application preview created with MyCodex"
                      className="transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </motion.div>
              </FadeIn>

              <FadeIn delay={0.1} className="lg:col-span-5 lg:translate-y-6">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-secondary/20 p-3 backdrop-blur-xl"
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-border/50">
                    <ParallaxVisual
                      src={builderPreview}
                      alt="Builder workspace showing prompt-driven application creation"
                      className="transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </motion.div>
              </FadeIn>
            </div>
          </section>

          <section>
            <FadeIn className="mb-10 md:mb-12 text-center">
              <span className="mb-4 inline-block text-[11px] font-medium uppercase tracking-[0.24em] text-primary/70">
                How it works
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                A clearer path from prompt to shipped application.
              </h2>
            </FadeIn>

            <div className="grid gap-4 lg:grid-cols-4">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <FadeIn key={step.title} delay={index * 0.06}>
                    <div className="relative h-full rounded-[1.5rem] border border-border/60 bg-secondary/20 p-6 backdrop-blur-xl">
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                        </div>
                        <span className="text-sm font-medium text-primary/75">0{index + 1}</span>
                      </div>
                      <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-foreground/55">{step.description}</p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </section>

          <section>
            <FadeIn>
              <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-secondary/20 px-6 py-14 text-center backdrop-blur-xl md:px-10 md:py-16">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.12),transparent_60%)]" />
                <motion.div
                  className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative z-10 mx-auto max-w-2xl">
                  <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    Start building your app with MyCodex today
                  </h2>
                  <p className="mt-4 text-base leading-8 text-foreground/55">
                    Move from idea to execution with a workflow that feels fast, modern, and built for real product teams.
                  </p>
                  <Link
                    to="/"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)/0.25)] transition-all duration-200 hover:brightness-110"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;
