import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

const pricingPlans = [
  {
    name: "Free",
    price: 0,
    annualPrice: 0,
    popular: false,
    description: "For your hobby",
    features: [
      "Basic code generation",
      "Single technology stack",
      "Community support",
      "Access to documentation",
    ],
    buttonText: "Get Started",
  },
  {
    name: "Pro",
    price: 99,
    annualPrice: 79,
    popular: true,
    description: "For small business",
    features: [
      "Advanced code generation",
      "All technology stacks",
      "Priority support",
      "Access to premium templates",
      "High-quality architecture",
      "Code review suggestions",
    ],
    buttonText: "Upgrade to Pro",
  },
  {
    name: "Enterprise",
    price: null,
    annualPrice: null,
    popular: false,
    description: "For multiple teams",
    features: [
      "All pro features",
      "Custom integrations",
      "Dedicated account manager",
      "Enterprise-level support",
      "Custom API access",
      "Bulk project generation",
    ],
    buttonText: "Start with Enterprise",
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
  isAnnual 
}: { 
  plan: typeof pricingPlans[0]; 
  isAnnual: boolean;
}) => {
  const displayPrice = isAnnual ? plan.annualPrice : plan.price;
  
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className={`relative flex flex-col p-8 rounded-2xl bg-[#1a1a1a] border border-white/10 transition-all duration-300`}
    >
      {/* Most Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-[#2a2a2a] text-white rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-xl font-semibold text-white mb-4">{plan.name}</h3>

      {/* Price */}
      <div className="flex items-baseline mb-2">
        {displayPrice !== null ? (
          <>
            <span className="text-4xl font-bold text-white">₹{displayPrice}</span>
            <span className="text-white/50 text-sm ml-2">per user/month</span>
          </>
        ) : (
          <span className="text-4xl font-bold text-white">Custom</span>
        )}
      </div>

      {/* Description */}
      <p className="text-white/50 text-sm mb-6">{plan.description}</p>

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
            <span className="text-white/70 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button className="w-full py-3 px-4 text-sm font-medium text-black bg-white hover:bg-white/90 rounded-lg transition-all duration-200">
        {plan.buttonText}
      </button>
    </motion.div>
  );
};

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <main className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Plans and Pricing
            </h1>
            <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto">
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
            <div className="inline-flex items-center bg-[#1a1a1a] rounded-full p-1 border border-white/10">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  !isAnnual 
                    ? 'bg-white text-black' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isAnnual 
                    ? 'bg-white text-black' 
                    : 'text-white/70 hover:text-white'
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
              <PricingCard key={plan.name} plan={plan} isAnnual={isAnnual} />
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
