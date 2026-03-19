import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Technology", href: "/technologies" },
  { label: "About", href: "/about" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleLogin = () => navigate("/login");
  const handleSignUp = () => navigate("/signup");
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="relative px-4 sm:px-6 lg:px-8 pt-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="group relative">
          <span className="font-bold text-lg sm:text-xl text-foreground transition-all duration-300">
            MyCodex
          </span>
          <span className="absolute -bottom-0.5 left-0 w-full h-px bg-primary/30" />
        </Link>

        <motion.div
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 bg-card/60 backdrop-blur-md border border-border rounded-full shadow-soft"
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
                className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block w-px h-5 bg-border mx-2" />

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/projects")}
                  className="text-muted-foreground hover:text-foreground rounded-full px-4 h-8 text-sm gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Projects
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-border text-primary hover:bg-primary/20 transition-colors"
                    >
                      <User className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-52 z-[9999] pointer-events-auto bg-card border border-border rounded-xl shadow-large"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground truncate">
                        {profile?.display_name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{profile?.plan || "free"} plan</p>
                    </div>
                    <div className="py-1">
                      <DropdownMenuItem onSelect={() => navigate("/profile")} className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => navigate("/projects")} className="cursor-pointer">
                        <LayoutDashboard className="w-4 h-4 mr-2" /> Projects
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => navigate("/pricing")} className="cursor-pointer">
                        <CreditCard className="w-4 h-4 mr-2" /> Billing & Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleLogin} className="text-muted-foreground hover:text-foreground rounded-full px-4 h-8 text-sm">
                  Login
                </Button>
                <Button size="sm" onClick={handleSignUp} className="rounded-full px-4 h-8 text-sm">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
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
            className="bg-card/90 backdrop-blur-md border border-border rounded-2xl p-4 w-64 shadow-large"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.label} to={item.href} className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-muted/50" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-border mt-2">
                {user ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => { navigate("/projects"); setIsMobileMenuOpen(false); }} className="justify-start text-muted-foreground rounded-lg gap-2">
                      Projects
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }} className="justify-start text-muted-foreground rounded-lg gap-2">
                      <User className="w-4 h-4" /> Profile
                    </Button>
                    <Button variant="ghost" size="sm" onClick={async () => { await signOut(); setIsMobileMenuOpen(false); navigate("/"); }} className="justify-start text-red-400 hover:bg-red-500/5 rounded-lg gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={handleLogin} className="justify-start text-muted-foreground rounded-lg">Login</Button>
                    <Button size="sm" onClick={handleSignUp} className="rounded-lg">Sign Up</Button>
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
