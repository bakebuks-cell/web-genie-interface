import { motion, useInView } from "framer-motion";
import { Check, Loader2, Minus } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";


type PlanType = "free" | "pro" | "enterprise";

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
};

const pricingPlans: Array<{
  name: string;
  planKey: PlanType;
  price: number | null;
  annualPrice: number | null;
  popular: boolean;
  description: string;
  features: string[];
  buttonText: string;
}> = [
  {
    name: "Starter",
    planKey: "free",
    price: 0,
    annualPrice: 0,
    popular: false,
    description: "Perfect for side projects and experimentation.",
    features: [
      "5 daily credits",
      "Basic code generation",
      "Single technology stack",
      "Community support",
    ],
    buttonText: "Get Started",
  },
  {
    name: "Pro",
    planKey: "pro",
    price: 99,
    annualPrice: 79,
    popular: true,
    description: "For developers shipping real products.",
    features: [
      "Unlimited credits",
      "Advanced code generation",
      "All technology stacks",
      "Priority support",
      "Premium templates",
      "Code review suggestions",
    ],
    buttonText: "Upgrade to Pro",
  },
  {
    name: "Enterprise",
    planKey: "enterprise",
    price: null,
    annualPrice: null,
    popular: false,
    description: "For teams that need scale and control.",
    features: [
      "Unlimited credits",
      "All Pro features",
      "Custom integrations",
      "Dedicated account manager",
      "Enterprise-level support",
      "Custom API access",
    ],
    buttonText: "Contact Sales",
  },
];

/* comparison table data */
const comparisonFeatures = [
  { name: "Daily credits", starter: "5", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Technology stacks", starter: "Single", pro: "All", enterprise: "All + Custom" },
  { name: "Code generation", starter: "Basic", pro: "Advanced", enterprise: "Advanced" },
  { name: "Multi-program mode", starter: false, pro: true, enterprise: true },
  { name: "Priority support", starter: false, pro: true, enterprise: true },
  { name: "Premium templates", starter: false, pro: true, enterprise: true },
  { name: "Custom integrations", starter: false, pro: false, enterprise: true },
  { name: "Dedicated account manager", starter: false, pro: false, enterprise: true },
  { name: "Custom API access", starter: false, pro: false, enterprise: true },
];

const PricingCard = ({
  plan,
  isAnnual,
  currentPlan,
  onSelect,
  isLoading,
  index,
}: {
  plan: (typeof pricingPlans)[0];
  isAnnual: boolean;
  currentPlan: PlanType | null;
  onSelect: (planKey: PlanType) => void;
  isLoading: boolean;
  index: number;
}) => {
  const displayPrice = isAnnual ? plan.annualPrice : plan.price;
  const isCurrentPlan = currentPlan === plan.planKey;
  const isDowngrade =
    currentPlan &&
    ((currentPlan === "enterprise" && plan.planKey !== "enterprise") ||
      (currentPlan === "pro" && plan.planKey === "free"));

  return (
    <FadeIn delay={index * 0.1}>
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={`relative flex flex-col h-full p-8 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
          plan.popular
            ? "bg-card/60 border-2 border-primary/40 shadow-[0_0_60px_hsl(170_100%_47%/0.1)]"
            : isCurrentPlan
            ? "bg-card/50 border-2 border-primary/30 ring-1 ring-primary/10"
            : "bg-card/30 border border-border/30 hover:border-primary/20"
        }`}
      >
        {/* top edge glow for popular */}
        {plan.popular && (
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-2xl" />
        )}

        {plan.popular && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="flex items-center gap-1.5 px-4 py-1 text-[11px] font-semibold tracking-wide uppercase bg-primary text-primary-foreground rounded-full">
              Most Popular
            </span>
          </div>
        )}

        {isCurrentPlan && (
          <div className="absolute -top-3.5 right-4">
            <span className="px-3 py-1 text-[11px] font-medium bg-secondary text-foreground rounded-full border border-border/50">
              Current Plan
            </span>
          </div>
        )}

        <h3 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
        <p className="text-xs text-muted-foreground mb-6">{plan.description}</p>

        <div className="flex items-baseline mb-8">
          {displayPrice !== null ? (
            <>
              <span className="text-4xl font-bold text-foreground tracking-tight">
                ₹{displayPrice}
              </span>
              <span className="text-muted-foreground text-xs ml-2">/month</span>
            </>
          ) : (
            <span className="text-3xl font-bold text-foreground">Custom</span>
          )}
        </div>

        <ul className="space-y-3 flex-1 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" strokeWidth={2.5} />
              <span className="text-muted-foreground text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onSelect(plan.planKey)}
          disabled={isCurrentPlan || isLoading}
          className={`w-full py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            isCurrentPlan
              ? "bg-secondary text-muted-foreground cursor-not-allowed"
              : plan.popular
              ? "bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(170_100%_47%/0.3)] hover:bg-primary/90"
              : isDowngrade
              ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border/50"
              : "bg-secondary text-foreground hover:bg-secondary/80 border border-border/50 hover:border-primary/30"
          }`}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isCurrentPlan ? "Current Plan" : plan.buttonText}
        </button>
      </motion.div>
    </FadeIn>
  );
};

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, profile, updatePlan } = useAuth();

  const handleSelectPlan = async (planKey: PlanType) => {
    if (!user) {
      localStorage.setItem("selected_plan", planKey);
      navigate("/signup");
      return;
    }
    if (planKey === "enterprise") {
      toast.info("Contact our sales team for Enterprise pricing");
      return;
    }
    if (planKey === "free") {
      toast.info("You are already on the Free plan");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await updatePlan(planKey);
      if (error) {
        toast.error("Failed to update plan");
      } else {
        toast.success(`Successfully upgraded to ${planKey.charAt(0).toUpperCase() + planKey.slice(1)} plan!`);
        navigate("/profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen relative overflow-hidden">
        {/* ambient glow */}
        <div className="fixed inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
            style={{ background: "radial-gradient(ellipse, hsl(170 100% 47% / 0.06) 0%, transparent 70%)" }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* dot grid */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 0.5px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        <main className="relative z-10 pt-28 pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <FadeIn className="text-center mb-6">
              <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-primary/70 mb-4">
                Pricing
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
                Plans that <span className="gradient-text">scale</span> with you
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                Start free. Upgrade when you're ready to ship faster.
              </p>
            </FadeIn>

            {/* Billing Toggle */}
            <FadeIn delay={0.15} className="flex justify-center mb-16">
              <div className="inline-flex items-center bg-secondary/50 rounded-full p-1 border border-border/30">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    !isAnnual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isAnnual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Annual
                </button>
              </div>
            </FadeIn>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-28">
              {pricingPlans.map((plan, i) => (
                <PricingCard
                  key={plan.name}
                  plan={plan}
                  isAnnual={isAnnual}
                  currentPlan={profile?.plan || null}
                  onSelect={handleSelectPlan}
                  isLoading={isLoading}
                  index={i}
                />
              ))}
            </div>

            {/* ── Comparison Table ── */}
            <FadeIn className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-primary/70 mb-3">
                  Compare
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Feature comparison
                </h2>
              </div>

              <div className="rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm overflow-hidden">
                {/* header row */}
                <div className="grid grid-cols-4 border-b border-border/20">
                  <div className="p-4" />
                  {["Starter", "Pro", "Enterprise"].map((name) => (
                    <div key={name} className="p-4 text-center">
                      <span className="text-sm font-semibold text-foreground">{name}</span>
                    </div>
                  ))}
                </div>

                {/* feature rows */}
                {comparisonFeatures.map((feat, i) => (
                  <div
                    key={feat.name}
                    className={`grid grid-cols-4 ${i < comparisonFeatures.length - 1 ? "border-b border-border/10" : ""}`}
                  >
                    <div className="p-4 text-sm text-muted-foreground">{feat.name}</div>
                    {(["starter", "pro", "enterprise"] as const).map((tier) => {
                      const val = feat[tier];
                      return (
                        <div key={tier} className="p-4 flex items-center justify-center">
                          {typeof val === "boolean" ? (
                            val ? (
                              <Check className="w-4 h-4 text-primary" />
                            ) : (
                              <Minus className="w-4 h-4 text-muted-foreground/30" />
                            )
                          ) : (
                            <span className="text-sm text-foreground/80">{val}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </main>
      </div>
  );
};

export default Pricing;
