import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Plus, FolderOpen, User, CreditCard, Settings, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Technology", href: "/technologies" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Showcase", href: "/showcase" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setIsAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsAvatarOpen(false);
    navigate("/");
  };

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "U";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="group relative">
          <span className="font-bold text-lg sm:text-xl text-foreground transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,230,210,0.5)]">
            MyCodex.Dev
          </span>
          <span className="absolute -bottom-0.5 left-0 w-full h-px bg-primary/50" />
        </Link>

        {/* Pill-style navigation container */}
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

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-primary/15 mx-2" />

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/generate")}
                  className="text-primary hover:bg-primary/10 rounded-full px-3 h-8 text-sm gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Project
                </Button>

                {/* Avatar dropdown */}
                <div className="relative" ref={avatarRef}>
                  <button
                    onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                    className="flex items-center gap-1.5 rounded-full px-1.5 py-1 hover:bg-primary/5 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary">
                      {initials}
                    </div>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>

                  <AnimatePresence>
                    {isAvatarOpen && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-52 bg-background/80 backdrop-blur-2xl border border-primary/15 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-1.5 z-50"
                        initial={{ opacity: 0, y: -6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="px-3 py-2 border-b border-primary/10 mb-1">
                          <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <DropdownItem icon={<User className="w-4 h-4" />} label="Profile" onClick={() => { navigate("/profile"); setIsAvatarOpen(false); }} />
                        <DropdownItem icon={<FolderOpen className="w-4 h-4" />} label="Projects" onClick={() => { navigate("/generate"); setIsAvatarOpen(false); }} />
                        <DropdownItem icon={<CreditCard className="w-4 h-4" />} label="Billing" onClick={() => { navigate("/pricing"); setIsAvatarOpen(false); }} />
                        <DropdownItem icon={<Settings className="w-4 h-4" />} label="Settings" onClick={() => { navigate("/profile"); setIsAvatarOpen(false); }} />
                        <div className="border-t border-primary/10 mt-1 pt-1">
                          <DropdownItem icon={<LogOut className="w-4 h-4" />} label="Log out" onClick={handleLogout} danger />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-full px-4 h-8 text-sm"
                >
                  Login
                </Button>
                <button
                  onClick={() => navigate("/signup")}
                  className="rounded-full px-4 h-8 text-sm font-medium text-primary-foreground shadow-[0_0_15px_rgba(0,255,200,0.25)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,200,0.4)] hover:opacity-90"
                  style={{ background: "linear-gradient(90deg, #00f0ff, #00c8a0)" }}
                >
                  Get Started
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 flex justify-end">
            <motion.div
              className="bg-background/60 backdrop-blur-2xl border border-primary/15 rounded-2xl p-4 w-64 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
                  {user ? (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => { navigate("/generate"); setIsMobileMenuOpen(false); }} className="justify-start text-primary hover:bg-primary/5 rounded-lg gap-2">
                        <Plus className="w-4 h-4" /> New Project
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }} className="justify-start text-muted-foreground hover:bg-primary/5 rounded-lg gap-2">
                        <User className="w-4 h-4" /> Profile
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="justify-start text-muted-foreground hover:bg-primary/5 rounded-lg gap-2">
                        <LogOut className="w-4 h-4" /> Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }} className="justify-start text-muted-foreground hover:bg-primary/5 rounded-lg">
                        Login
                      </Button>
                      <button
                        onClick={() => { navigate("/signup"); setIsMobileMenuOpen(false); }}
                        className="rounded-lg px-4 h-9 text-sm font-medium text-primary-foreground"
                        style={{ background: "linear-gradient(90deg, #00f0ff, #00c8a0)" }}
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

function DropdownItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
