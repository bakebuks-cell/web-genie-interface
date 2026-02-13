import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  driftX: number;
  driftY: number;
  baseX: number;
  baseY: number;
  brightness: number;
}

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 800);
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        // Right-side bias for brightness
        const rightBias = x / canvas.width;
        const isBright = Math.random() < rightBias * 0.4;
        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: isBright ? Math.random() * 2 + 0.8 : Math.random() * 1.2 + 0.3,
          opacity: isBright ? Math.random() * 0.6 + 0.4 : Math.random() * 0.5 + 0.1,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.15,
          driftY: (Math.random() - 0.5) * 0.08,
          brightness: isBright ? 1 : 0,
        });
      }
      starsRef.current = stars;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        // Parallax drift
        s.x = s.baseX + Math.sin(time * 0.0001 + i) * s.driftX * 30;
        s.y = s.baseY + Math.cos(time * 0.00008 + i) * s.driftY * 30;
        // Twinkle
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7;
        const alpha = s.opacity * twinkle;
        // Color: bright stars are slightly blue/white, others are warm white
        if (s.brightness > 0) {
          ctx.fillStyle = `rgba(0, 245, 212, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        // Glow for bright stars
        if (s.brightness > 0 && s.size > 1) {
          ctx.fillStyle = `rgba(0, 245, 212, ${alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      animFrameRef.current = requestAnimationFrame(draw);
    };

    resize();
    animFrameRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep black base with purple/violet gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 50%, hsla(168, 60%, 15%, 0.4) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 50% 40%, hsla(170, 50%, 12%, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 30% 60%, hsla(175, 40%, 10%, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 90% 70% at 80% 50%, hsla(168, 70%, 20%, 0.2) 0%, transparent 60%),
            linear-gradient(180deg, hsl(170, 20%, 3%) 0%, hsl(175, 15%, 1%) 100%)
          `,
        }}
      />
      {/* Nebula haze - right side brighter */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 40% 35% at 75% 45%, rgba(0, 245, 212, 0.1) 0%, transparent 100%),
            radial-gradient(ellipse 30% 30% at 65% 55%, rgba(0, 245, 212, 0.06) 0%, transparent 100%)
          `,
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, hsla(0, 0%, 0%, 0.6) 100%)",
        }}
      />
      {/* Canvas for star particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
