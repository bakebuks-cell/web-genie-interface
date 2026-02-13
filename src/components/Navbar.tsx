import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Technology", href: "/technologies" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
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

  const brandText = "MyCodex.Dev";

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        {/* Brand Name */}
        <Link to="/" className="group relative">
          <span className="font-bold text-lg sm:text-xl text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,230,210,0.5)]">
            {brandText}
          </span>
          <span className="absolute -bottom-0.5 left-0 w-full h-px bg-primary/50" />
        </Link>

        {/* Pill-style navigation container */}
        <motion.div 
          className="
            flex items-center gap-1 sm:gap-2
            px-3 sm:px-5 py-2.5
            bg-background/40 backdrop-blur-2xl 
            border border-primary/15 rounded-full
            shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(0,230,210,0.05)]
          "
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="
                  px-3 py-1.5 rounded-full
                  text-muted-foreground hover:text-primary 
                  hover:bg-primary/5
                  transition-all duration-200 
                  text-sm font-medium
                "
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-primary/15 mx-2" />

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogin}
              className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-full px-4 h-8 text-sm"
            >
              Login
            </Button>
            <button
              onClick={handleSignUp}
              className="rounded-full px-4 h-8 text-sm font-medium text-primary-foreground shadow-[0_0_15px_rgba(0,255,200,0.25)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,200,0.4)] hover:opacity-90"
              style={{
                background: "linear-gradient(90deg, #00f0ff, #00c8a0)",
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-primary/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 flex justify-end">
          <motion.div 
            className="
              bg-background/60 backdrop-blur-2xl 
              border border-primary/15 rounded-2xl
              p-4 w-64
              shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            "
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-primary/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-primary/15 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                  className="justify-start text-muted-foreground hover:bg-primary/5 rounded-lg"
                >
                  Login
                </Button>
                <button
                  onClick={handleSignUp}
                  className="rounded-lg px-4 h-9 text-sm font-medium text-primary-foreground"
                  style={{
                    background: "linear-gradient(90deg, #00f0ff, #00c8a0)",
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </nav>
  );
};
