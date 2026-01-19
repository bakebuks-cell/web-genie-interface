import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

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

  const brandText = "DataBuks Studio";

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        {/* Brand Name - Left side with subtle effect */}
        <Link to="/" className="group relative">
          <motion.span
            className="font-bold text-lg sm:text-xl text-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            {brandText}
          </motion.span>
          
          {/* Subtle underline on hover */}
          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
        </Link>

        {/* Pill-style navigation container - Right side */}
        <motion.div 
          className="
            flex items-center gap-1 sm:gap-2
            px-3 sm:px-5 py-2.5
            bg-background/40 backdrop-blur-2xl 
            border border-white/10 rounded-full
            shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
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
        </motion.div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 flex justify-end">
          <motion.div 
            className="
              bg-background/60 backdrop-blur-2xl 
              border border-white/10 rounded-2xl
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
          </motion.div>
        </div>
      )}
    </nav>
  );
};
