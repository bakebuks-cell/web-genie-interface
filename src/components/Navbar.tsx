import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Supported Tech", href: "/technologies" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      {/* Pill-style container - left aligned */}
      <div className="max-w-fit">
        <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-background/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]">
          {/* Brand Name */}
          <Link 
            to="/" 
            className="px-4 py-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
          >
            DataBuks Studio
          </Link>

          {/* Separator */}
          <div className="w-px h-4 bg-white/10" />

          {/* Navigation Items */}
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}

          {/* Separator */}
          <div className="w-px h-4 bg-white/10" />

          {/* Auth Buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogin}
            className="px-3 py-1.5 h-auto text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full"
          >
            Login
          </Button>
          <Button
            size="sm"
            onClick={handleSignUp}
            className="px-4 py-1.5 h-auto text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300"
          >
            Sign Up
          </Button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 p-3 bg-background/40 backdrop-blur-xl border border-white/10 rounded-full text-muted-foreground hover:text-foreground transition-colors z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 p-4 bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-fade-in">
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }}
              className="justify-start text-muted-foreground hover:text-foreground"
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => { handleSignUp(); setIsMobileMenuOpen(false); }}
              className="bg-primary text-primary-foreground rounded-full"
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
