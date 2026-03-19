export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 0.5px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Very subtle radial light behind hero content */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, hsl(217 91% 60% / 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Secondary subtle glow */}
      <div
        className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[180px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, hsl(263 70% 58% / 0.04) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
};
