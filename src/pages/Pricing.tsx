import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";

type PlanType = 'free' | 'pro' | 'enterprise';

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
    name: "Free",
    planKey: "free",
    price: 0,
    annualPrice: 0,
    popular: false,
    description: "For your hobby",
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
    description: "For small business",
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
    description: "For multiple teams",
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const PricingCard = ({ 
  plan, 
  isAnnual,
  currentPlan,
  onSelect,
  isLoading,
}: { 
  plan: typeof pricingPlans[0]; 
  isAnnual: boolean;
  currentPlan: PlanType | null;
  onSelect: (planKey: PlanType) => void;
  isLoading: boolean;
}) => {
  const displayPrice = isAnnual ? plan.annualPrice : plan.price;
  const isCurrentPlan = currentPlan === plan.planKey;
  const isDowngrade = currentPlan && (
    (currentPlan === 'enterprise' && plan.planKey !== 'enterprise') ||
    (currentPlan === 'pro' && plan.planKey === 'free')
  );
  
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className={`relative flex flex-col p-8 rounded-2xl bg-card/80 backdrop-blur-xl border transition-all duration-300 ${
        isCurrentPlan ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      }`}
    >
      {/* Most Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
            Most Popular
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <span className="px-3 py-1 text-xs font-medium bg-secondary text-foreground rounded-full border border-border">
            Current Plan
          </span>
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-xl font-semibold text-foreground mb-4">{plan.name}</h3>

      {/* Price */}
      <div className="flex items-baseline mb-2">
        {displayPrice !== null ? (
          <>
            <span className="text-4xl font-bold text-foreground">₹{displayPrice}</span>
            <span className="text-muted-foreground text-sm ml-2">per user/month</span>
          </>
        ) : (
          <span className="text-4xl font-bold text-foreground">Custom</span>
        )}
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={2} />
            <span className="text-muted-foreground text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button 
        onClick={() => onSelect(plan.planKey)}
        disabled={isCurrentPlan || isLoading}
        className={`w-full py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
          isCurrentPlan
            ? 'bg-secondary text-muted-foreground cursor-not-allowed'
            : isDowngrade
            ? 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
            : 'text-primary-foreground bg-primary hover:bg-primary/90'
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : (
          plan.buttonText
        )}
      </button>
    </motion.div>
  );
};

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, profile, updatePlan } = useAuth();

  const handleSelectPlan = async (planKey: PlanType) => {
    // If not logged in, redirect to signup
    if (!user) {
      // Store selected plan in localStorage for after signup
      localStorage.setItem('selected_plan', planKey);
      navigate('/signup');
      return;
    }

    // Enterprise requires contact
    if (planKey === 'enterprise') {
      toast.info('Contact our sales team for Enterprise pricing');
      return;
    }

    // Free plan selection
    if (planKey === 'free') {
      toast.info('You are already on the Free plan');
      return;
    }

    // For Pro plan, update immediately (in production, this would go through Stripe)
    setIsLoading(true);
    try {
      const { error } = await updatePlan(planKey);
      if (error) {
        toast.error('Failed to update plan');
      } else {
        toast.success(`Successfully upgraded to ${planKey.charAt(0).toUpperCase() + planKey.slice(1)} plan!`);
        navigate('/profile');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <main className="relative z-10 pt-28 pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
                Plans and Pricing
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                Receive unlimited credits when you pay yearly, and save on your plan
              </p>
            </motion.div>

            {/* Billing Toggle */}
            <motion.div 
              className="flex justify-center mb-16"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="inline-flex items-center bg-secondary rounded-full p-1 border border-border">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    !isAnnual 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isAnnual 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Annual
                </button>
              </div>
            </motion.div>

            {/* Pricing Grid - 3 columns */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {pricingPlans.map((plan) => (
                <PricingCard 
                  key={plan.name} 
                  plan={plan} 
                  isAnnual={isAnnual}
                  currentPlan={profile?.plan || null}
                  onSelect={handleSelectPlan}
                  isLoading={isLoading}
                />
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Pricing;
