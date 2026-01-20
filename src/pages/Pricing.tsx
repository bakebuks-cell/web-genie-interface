import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const pricingPlans = [
  {
    name: "CREATORS SPECIAL",
    price: 19,
    recommended: true,
    description: "Perfect for individual bloggers, freelancers and entrepreneurs",
    features: [
      "AI-Powered editing tools",
      "Basic Analytics to track content performance",
      "Priority email support",
      "5 projects per month",
    ],
  },
  {
    name: "STARTERS",
    price: 0,
    recommended: false,
    description: "Perfect for beginners",
    features: [
      "Unlimited Content Generation",
      "AI-Powered editing tools",
      "Community support",
    ],
  },
  {
    name: "TEAMS",
    price: 49,
    recommended: false,
    description: "Ideal for small teams and agencies",
    features: [
      "Collaborative features like shared projects",
      "Advanced Analytics to optimize content strategy",
      "Priority support",
      "Unlimited projects",
    ],
  },
  {
    name: "ENTERPRISE",
    price: 99,
    recommended: false,
    description: "Designed for large companies and high-volume content creators",
    features: [
      "Dedicated account management",
      "Custom integrations",
      "SLA guarantees",
      "Unlimited everything",
    ],
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

const PricingCard = ({ plan }: { plan: typeof pricingPlans[0] }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -6,
        transition: { duration: 0.25, ease: "easeOut" }
      }}
      className={`group relative p-6 rounded-2xl 
        bg-white/[0.02]
        backdrop-blur-sm
        border border-white/[0.08]
        hover:border-white/[0.15]
        hover:bg-white/[0.04]
        transition-all duration-300 ease-out
        ${plan.recommended ? 'ring-1 ring-white/20' : ''}`}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header with badges */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 text-xs font-semibold tracking-wide bg-white/10 text-white rounded-full">
              {plan.name}
            </span>
            {plan.recommended && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/5 text-white/70 rounded-full border border-white/10">
                <Sparkles className="w-3 h-3" />
                Most Recommended
              </span>
            )}
          </div>
          <button className="px-5 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200">
            Subscribe
          </button>
        </div>

        {/* Price */}
        <div className="flex items-baseline mb-4">
          <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            ${plan.price}
          </span>
          <span className="text-white/40 text-base ml-1">/month</span>
        </div>

        {/* Features */}
        <ul className="space-y-3 mt-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-white/70" strokeWidth={2.5} />
              </div>
              <span className="text-white/50 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const Pricing = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dot grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient gradient at top */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center top, hsl(0 0% 100% / 0.03) 0%, transparent 70%)',
        }}
      />

      <main className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight">
              Data-Driven Growth
            </h1>
            <p className="text-white/40 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Are you tired of using outdated tools and insights that hold your team back? We built our pricing around modern teams, so you can focus on what matters most.
            </p>
          </motion.div>

          {/* Pricing Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
