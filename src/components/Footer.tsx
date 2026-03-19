import { Link } from "react-router-dom";
import { Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[hsl(222_47%_4%)] border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="text-lg font-bold text-foreground tracking-tight">
              MyCodex
            </Link>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-[220px]">
              Build production-ready apps from prompts.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1.5">AI-powered app builder</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4">Product</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "Pricing", to: "/pricing" },
                { label: "Projects", to: "/generate" },
                { label: "Generate App", to: "/generate" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {["Help Center", "FAQ", "Contact Support"].map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service"].map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-primary/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            © 2026 MyCodex. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground/50 hover:text-primary transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="text-muted-foreground/50 hover:text-primary transition-colors" aria-label="X (Twitter)">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
