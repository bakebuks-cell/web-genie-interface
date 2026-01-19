import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Technologies", href: "/technologies" },
  { label: "About", href: "/about" },
];

// Letter animation variants
const letterVariants = {
  initial: { y: 0 },
  hover: { y: -3 },
};

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
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
        {/* Brand Name - Left side with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link 
            to="/" 
            className="group relative flex items-center gap-2"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Animated sparkle icon */}
            <motion.div
              animate={{ 
                rotate: isHovering ? [0, 15, -15, 0] : 0,
                scale: isHovering ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            
            {/* Animated letters */}
            <span className="font-bold text-lg sm:text-xl flex">
              {brandText.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    color: isHovering 
                      ? index < 8 ? "hsl(var(--primary))" : "hsl(var(--foreground))"
                      : "hsl(var(--foreground))"
                  }}
                  transition={{ 
                    delay: index * 0.03,
                    duration: 0.3,
                    y: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileHover={{
                    y: -5,
                    color: "hsl(var(--primary))",
                    transition: { duration: 0.1 }
                  }}
                  style={{ 
                    display: letter === " " ? "inline" : "inline-block",
                    width: letter === " " ? "0.25em" : "auto"
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>

            {/* Glowing underline on hover */}
            <motion.div 
              className="absolute -bottom-1 left-7 right-0 h-0.5 bg-gradient-to-r from-primary via-accent-purple to-primary rounded-full"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: isHovering ? 1 : 0,
                opacity: isHovering ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: "left" }}
            />
            
            {/* Glow effect behind text */}
            <motion.div
              className="absolute inset-0 -z-10 blur-xl"
              animate={{
                opacity: isHovering ? 0.3 : 0,
                background: isHovering 
                  ? "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" 
                  : "transparent"
              }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>

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
