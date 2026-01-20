import { motion } from "framer-motion";

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

      <main className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pricing
            </h1>
            <p className="text-white/40 text-base">
              Coming soon...
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
