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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 py-4">
      <div className="flex items-center justify-between">
        {/* Brand Name - Left */}
        <Link to="/" className="relative">
          <span className="font-bold text-lg text-white tracking-wide">
            MyCodex
          </span>
          <span className="absolute -bottom-0.5 left-0 w-full h-px bg-white/80" />
        </Link>

        {/* Right side nav */}
        <motion.div
          className="flex items-center gap-1 sm:gap-2 px-4 py-2.5 rounded-full border"
          style={{
            background: "hsl(0 0% 0% / 0.3)",
            backdropFilter: "blur(16px)",
            borderColor: "hsl(0 0% 100% / 0.08)",
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{ color: "hsl(0 0% 60%)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "hsl(0 0% 90%)";
                  e.currentTarget.style.backgroundColor = "hsl(0 0% 100% / 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "hsl(0 0% 60%)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block w-px h-5 mx-2" style={{ background: "hsl(0 0% 100% / 0.1)" }} />

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogin}
              className="rounded-full px-4 h-8 text-sm"
              style={{ color: "hsl(0 0% 60%)" }}
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={handleSignUp}
              className="rounded-full px-4 h-8 text-sm text-white border-0"
              style={{
                background: "hsl(250 83% 60%)",
                boxShadow: "0 0 12px hsl(250 83% 60% / 0.3)",
              }}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1.5 rounded-full transition-colors"
            style={{ color: "hsl(0 0% 60%)" }}
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
            className="p-4 w-64 rounded-2xl border"
            style={{
              background: "hsl(0 0% 4% / 0.9)",
              backdropFilter: "blur(24px)",
              borderColor: "hsl(0 0% 100% / 0.08)",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                  style={{ color: "hsl(0 0% 60%)" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t" style={{ borderColor: "hsl(0 0% 100% / 0.1)" }}>
                <Button variant="ghost" size="sm" onClick={handleLogin} className="justify-start" style={{ color: "hsl(0 0% 60%)" }}>
                  Login
                </Button>
                <Button size="sm" onClick={handleSignUp} className="text-white" style={{ background: "hsl(250 83% 60%)" }}>
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
