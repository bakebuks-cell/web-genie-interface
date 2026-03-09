import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Technology", href: "/technologies" },
  { label: "About", href: "/about" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogin = () => navigate("/login");
  const handleSignUp = () => navigate("/signup");
  const handleLogout = async () => {
    await signOut();
    setIsProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="relative px-4 sm:px-6 lg:px-8 pt-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="group relative">
          <span className="font-bold text-lg sm:text-xl text-foreground transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,230,210,0.5)]">
            MyCodex
          </span>
          <span className="absolute -bottom-0.5 left-0 w-full h-px bg-primary/50" />
        </Link>

        <motion.div
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 bg-background/40 backdrop-blur-2xl border border-primary/15 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(0,230,210,0.05)]"
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
                className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block w-px h-5 bg-primary/15 mx-2" />

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/projects")}
                  className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-full px-4 h-8 text-sm gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Projects
                </Button>
                <div ref={profileRef} className="relative z-50">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="fixed right-4 mt-2 w-52 z-[100] bg-background backdrop-blur-2xl border border-primary/15 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                        style={{ top: profileRef.current ? profileRef.current.getBoundingClientRect().bottom + 4 : undefined }}
                      >
                        <div className="px-4 py-3 border-b border-primary/10">
                          <p className="text-sm font-medium text-foreground truncate">
                            {profile?.display_name || user.email}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{profile?.plan || "free"} plan</p>
                        </div>
                        <div className="py-1">
                          <button onClick={() => { navigate("/profile"); setIsProfileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors cursor-pointer">
                            <User className="w-4 h-4" /> Profile
                          </button>
                          <button onClick={() => { navigate("/pricing"); setIsProfileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors cursor-pointer">
                            <CreditCard className="w-4 h-4" /> Billing & Plan
                          </button>
                          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors cursor-pointer">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleLogin} className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-full px-4 h-8 text-sm">
                  Login
                </Button>
                <button onClick={handleSignUp} className="rounded-full px-4 h-8 text-sm font-medium text-primary-foreground shadow-[0_0_15px_rgba(0,255,200,0.25)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,200,0.4)] hover:opacity-90" style={{ background: "linear-gradient(90deg, #00f0ff, #00c8a0)" }}>
                  Sign Up
                </button>
              </>
            )}
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
            className="bg-background/60 backdrop-blur-2xl border border-primary/15 rounded-2xl p-4 w-64 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.label} to={item.href} className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-primary/5" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-primary/15 mt-2">
                {user ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => { navigate("/projects"); setIsMobileMenuOpen(false); }} className="justify-start text-muted-foreground hover:bg-primary/5 rounded-lg gap-2">
                      Projects
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }} className="justify-start text-muted-foreground hover:bg-primary/5 rounded-lg gap-2">
                      <User className="w-4 h-4" /> Profile
                    </Button>
                    <Button variant="ghost" size="sm" onClick={async () => { await signOut(); setIsMobileMenuOpen(false); navigate("/"); }} className="justify-start text-red-400 hover:bg-red-500/5 rounded-lg gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={handleLogin} className="justify-start text-muted-foreground hover:bg-primary/5 rounded-lg">Login</Button>
                    <button onClick={handleSignUp} className="rounded-lg px-4 h-9 text-sm font-medium text-primary-foreground" style={{ background: "linear-gradient(90deg, #00f0ff, #00c8a0)" }}>Sign Up</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </nav>
  );
};
