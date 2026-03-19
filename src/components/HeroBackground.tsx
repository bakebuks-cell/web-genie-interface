import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const HeroBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle grid */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.025]">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main electric blue blob - follows mouse */}
      <motion.div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, hsl(190 100% 50% / 0.14) 0%, hsl(190 100% 50% / 0.04) 40%, transparent 70%)",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 1.05, 1],
        }}
        transition={{
          x: { type: "spring", stiffness: 40, damping: 30 },
          y: { type: "spring", stiffness: 40, damping: 30 },
          scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Aurora glow behind the prompt box area - purple + cyan blend */}
      <motion.div
        className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, hsl(190 100% 50% / 0.10) 0%, hsl(258 100% 68% / 0.06) 50%, transparent 80%)",
          filter: "blur(40px)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scaleX: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Slow-moving electric blue blob - left */}
      <motion.div
        className="absolute top-1/4 -left-32 w-[350px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(190 100% 50% / 0.08) 0%, transparent 70%)",
        }}
        animate={{
          y: [0, 30, 0],
          x: mousePosition.x * 0.3,
        }}
        transition={{
          y: { duration: 16, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 30, damping: 30 },
        }}
      />

      {/* Slow-moving purple blob - right */}
      <motion.div
        className="absolute top-1/2 -right-32 w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(258 100% 68% / 0.07) 0%, transparent 70%)",
        }}
        animate={{
          y: [0, -30, 0],
          x: -mousePosition.x * 0.2,
        }}
        transition={{
          y: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 },
          x: { type: "spring", stiffness: 30, damping: 30 },
        }}
      />

      {/* Subtle cyan accent blob - bottom center */}
      <motion.div
        className="absolute bottom-0 left-1/3 w-[400px] h-[200px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, hsl(162 100% 50% / 0.05) 0%, transparent 70%)",
          filter: "blur(30px)",
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
