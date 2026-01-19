import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import databuksLogo from "@/assets/databuks_logo.jfif";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Supported Technologies", href: "/technologies" },
  { label: "Contact", href: "#contact" },
];

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-border/30">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-card/40 backdrop-blur-xl" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      
      {/* Floating accent orbs */}
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary/5 blur-[80px]" />
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-accent/5 blur-[60px]" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Brand Section */}
          <motion.div 
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={databuksLogo}
                alt="DataBuks Logo"
                className="w-12 h-12 rounded-xl object-cover shadow-medium group-hover:shadow-glow transition-all duration-300"
              />
              <span className="font-bold text-xl text-foreground">
                DataBuks Studio
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Transform your ideas into production-ready web applications with the power of AI.
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.nav 
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {footerLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                {link.href.startsWith("/") ? (
                  <Link
                    to={link.href}
                    className="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                  </a>
                )}
              </motion.div>
            ))}
          </motion.nav>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Copyright & Social */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-between w-full gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xs text-muted-foreground/70">
              © 2026 DataBuks Studio. All rights reserved.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
