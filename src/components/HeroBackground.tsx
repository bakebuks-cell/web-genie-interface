import { motion } from "framer-motion";

export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Main blue gradient blob - top center */}
      <motion.div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, hsl(217 91% 60% / 0.15) 0%, hsl(217 91% 60% / 0.05) 40%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary purple accent - left */}
      <motion.div
        className="absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(250 83% 60% / 0.12) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Tertiary blue glow - right */}
      <motion.div
        className="absolute top-1/2 -right-40 w-[350px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(200 100% 50% / 0.1) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Bottom accent glow */}
      <motion.div
        className="absolute -bottom-60 left-1/3 w-[600px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, hsl(217 91% 60% / 0.1) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Floating soft particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 6 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Subtle light wave effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, hsl(217 91% 60% / 0.02) 50%, transparent 100%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Very subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
