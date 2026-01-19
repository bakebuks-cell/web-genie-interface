import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Technologies", href: "/technologies" },
  { label: "About", href: "/about" },
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
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-end">
        {/* Pill-style header container - positioned right */}
        <div className="
          flex items-center gap-1 sm:gap-2
          px-3 sm:px-5 py-2.5
          bg-background/40 backdrop-blur-2xl 
          border border-white/10 rounded-full
          shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
        ">
          {/* Brand Name */}
          <Link to="/" className="group relative mr-2 sm:mr-4">
            <span className="font-semibold text-sm sm:text-base text-foreground/90 transition-all duration-300 group-hover:text-primary">
              DataBuks Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="
                  px-3 py-1.5 rounded-full
                  text-muted-foreground hover:text-foreground 
                  hover:bg-white/5
                  transition-all duration-200 
                  text-sm font-medium
                "
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-white/10 mx-2" />

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogin}
              className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full px-4 h-8 text-sm"
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={handleSignUp}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 h-8 text-sm shadow-lg shadow-primary/20"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 flex justify-end">
          <div className="
            bg-background/60 backdrop-blur-2xl 
            border border-white/10 rounded-2xl
            p-4 w-64
            shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            animate-fade-in
          ">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-white/10 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                  className="justify-start text-muted-foreground hover:bg-white/5 rounded-lg"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={handleSignUp}
                  className="bg-primary text-primary-foreground rounded-lg"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};