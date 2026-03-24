import { MessageCircle } from "lucide-react";

const Community = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-primary/70 mb-4">
        Community
      </span>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center leading-tight">
        Join the <span className="bg-gradient-to-r from-primary to-[#00f0ff] bg-clip-text text-transparent">MyCodex</span> Community
      </h1>
      <p className="text-muted-foreground text-center max-w-lg mb-12 text-base">
        Connect with builders, share ideas, get updates, and grow with the MyCodex community.
      </p>

      <div className="w-full max-w-md rounded-2xl border border-primary/15 bg-background/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(0,230,210,0.05)] p-8 flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <MessageCircle className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Discord Community</h2>
        <p className="text-muted-foreground text-center text-sm leading-relaxed">
          Our Discord community link will be added soon. Stay tuned.
        </p>
        <button
          disabled
          className="mt-2 rounded-full px-6 py-2.5 text-sm font-medium bg-primary/10 text-primary/50 border border-primary/15 cursor-not-allowed"
        >
          Discord Link Coming Soon
        </button>
      </div>
    </div>
  );
};

export default Community;
