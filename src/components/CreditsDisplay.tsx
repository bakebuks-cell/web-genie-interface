import { Zap, Crown, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGuestCredits } from '@/hooks/useCredits';
import { Button } from '@/components/ui/button';

interface CreditsDisplayProps {
  onUpgradeClick?: () => void;
}

export function CreditsDisplay({ onUpgradeClick }: CreditsDisplayProps) {
  const { user, profile, userCredits } = useAuth();
  const { credits: guestCredits, isLoaded } = useGuestCredits();

  const isAuthenticated = !!user;
  const isUnlimited = profile?.plan === 'pro' || profile?.plan === 'enterprise';
  
  let creditsRemaining: number;
  let maxCredits = 5;
  
  if (isAuthenticated) {
    if (isUnlimited) {
      creditsRemaining = -1; // Unlimited
    } else {
      creditsRemaining = userCredits?.credits_remaining ?? 0;
    }
  } else {
    creditsRemaining = isLoaded ? guestCredits : 5;
  }

  const hasCredits = creditsRemaining > 0 || creditsRemaining === -1;
  const creditsPercentage = isUnlimited ? 100 : (creditsRemaining / maxCredits) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isUnlimited ? (
            <Crown className="w-4 h-4 text-amber-500" />
          ) : (
            <Zap className="w-4 h-4 text-primary" />
          )}
          <span className="text-sm font-medium text-foreground">
            {isUnlimited ? (
              <span className="text-amber-500">Unlimited</span>
            ) : (
              <>
                <span className={creditsRemaining > 0 ? 'text-primary' : 'text-destructive'}>
                  {creditsRemaining}
                </span>
                <span className="text-muted-foreground"> / {maxCredits} credits</span>
              </>
            )}
          </span>
        </div>
        
        {!isAuthenticated && (
          <Link to="/login" className="text-xs text-primary hover:underline flex items-center gap-1">
            <LogIn className="w-3 h-3" />
            Sign in
          </Link>
        )}
      </div>

      {!isUnlimited && (
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              creditsRemaining > 2 
                ? 'bg-gradient-to-r from-primary to-accent-purple' 
                : creditsRemaining > 0 
                  ? 'bg-amber-500' 
                  : 'bg-destructive'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${creditsPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {!hasCredits && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
        >
          <p className="text-xs text-destructive mb-2">
            You've used all your daily credits.
          </p>
          {!isAuthenticated ? (
            <div className="flex gap-2">
              <Link to="/login" className="flex-1">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Sign In
                </Button>
              </Link>
              <Link to="/pricing" className="flex-1">
                <Button size="sm" className="w-full text-xs">
                  Upgrade
                </Button>
              </Link>
            </div>
          ) : (
            <Button 
              size="sm" 
              onClick={onUpgradeClick}
              className="w-full text-xs"
            >
              Upgrade for Unlimited
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
