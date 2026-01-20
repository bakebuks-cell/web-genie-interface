import { motion } from 'framer-motion';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface UpgradePromptProps {
  variant?: 'inline' | 'card';
}

export function UpgradePrompt({ variant = 'inline' }: UpgradePromptProps) {
  const { user } = useAuth();

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-primary/20 to-accent-purple/20 border border-primary/30 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Out of Credits</h3>
            <p className="text-sm text-muted-foreground">Upgrade to continue building</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          You've reached your daily limit. Upgrade to Pro for unlimited generations 
          and unlock powerful features.
        </p>

        <div className="flex gap-3">
          {!user && (
            <Link to="/login" className="flex-1">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          )}
          <Link to="/pricing" className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90 gap-2">
              <Zap className="w-4 h-4" />
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl border border-border"
    >
      <Zap className="w-5 h-5 text-amber-500" />
      <p className="text-sm text-muted-foreground flex-1">
        Credits exhausted.{' '}
        {!user ? (
          <>
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            {' or '}
          </>
        ) : null}
        <Link to="/pricing" className="text-primary hover:underline">upgrade</Link>
        {' for unlimited access.'}
      </p>
    </motion.div>
  );
}
