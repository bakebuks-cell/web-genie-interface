import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const HeroBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated grid lines */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main teal gradient blob - follows mouse subtly */}
      <motion.div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(0, 245, 212, 0.15) 0%, rgba(0, 245, 212, 0.06) 40%, transparent 70%)",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 1.08, 1],
        }}
        transition={{
          x: { type: "spring", stiffness: 50, damping: 30 },
          y: { type: "spring", stiffness: 50, damping: 30 },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Orbiting accent rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border border-primary/10 rounded-full" />
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary/40 blur-sm"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 w-[550px] h-[550px] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border border-primary/10 rounded-full" />
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/50 blur-sm"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>

      {/* Secondary teal accent - left */}
      <motion.div
        className="absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0, 245, 212, 0.12) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          y: [0, 30, 0],
          x: mousePosition.x * 0.5,
        }}
        transition={{
          scale: { duration: 14, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 },
          x: { type: "spring", stiffness: 30, damping: 30 },
        }}
      />

      {/* Tertiary teal glow - right */}
      <motion.div
        className="absolute top-1/2 -right-40 w-[350px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0, 255, 198, 0.1) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          y: [0, -40, 0],
          x: -mousePosition.x * 0.3,
        }}
        transition={{
          scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 },
          x: { type: "spring", stiffness: 30, damping: 30 },
        }}
      />

      {/* Animated shooting lines */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          style={{
            width: `${150 + i * 50}px`,
            top: `${25 + i * 20}%`,
            left: "-200px",
          }}
          animate={{
            x: [0, window.innerWidth + 400],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 2,
            ease: "linear",
          }}
        />
      ))}

      {/* Floating glowing orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${8 + (i % 3) * 4}px`,
            height: `${8 + (i % 3) * 4}px`,
            left: `${10 + i * 11}%`,
            top: `${15 + (i % 4) * 20}%`,
            background: i % 2 === 0 
              ? "radial-gradient(circle, rgba(0, 245, 212, 0.5), transparent)"
              : "radial-gradient(circle, rgba(0, 255, 198, 0.4), transparent)",
            boxShadow: i % 2 === 0
              ? "0 0 20px rgba(0, 245, 212, 0.3)"
              : "0 0 15px rgba(0, 255, 198, 0.25)",
          }}
          animate={{
            y: [0, -40 - i * 5, 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        />
      ))}

      {/* Pulsing center glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0, 245, 212, 0.08) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bottom accent glow */}
      <motion.div
        className="absolute -bottom-60 left-1/3 w-[600px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(0, 245, 212, 0.1) 0%, transparent 60%)",
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

      {/* Subtle light wave effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(0, 245, 212, 0.02) 50%, transparent 100%)",
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Very subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
