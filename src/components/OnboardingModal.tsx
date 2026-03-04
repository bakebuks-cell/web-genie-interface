import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, Rocket, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const steps = [
  {
    icon: Sparkles,
    title: 'Welcome to MyCodex',
    description: 'Generate production-ready web applications with AI-powered code generation.',
  },
  {
    icon: Zap,
    title: 'Your Free Plan',
    description: 'Start with 5 daily credits. Each generation uses 1 credit. Credits reset at midnight.',
  },
  {
    icon: Rocket,
    title: 'Ready to Build?',
    description: 'Head to the generator and describe your application to get started instantly.',
  },
];

export const OnboardingModal = ({ isOpen, onClose, userName }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
    navigate('/generate');
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-md bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="text-center space-y-6 pt-4">
              {/* Icon */}
              <motion.div
                key={currentStep}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center"
              >
                <CurrentIcon className="w-8 h-8 text-primary-foreground" />
              </motion.div>

              {/* Greeting (only on first step) */}
              {currentStep === 0 && userName && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-primary font-medium"
                >
                  Hey, {userName}! 👋
                </motion.p>
              )}

              {/* Title & Description */}
              <motion.div
                key={`content-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <h2 className="text-2xl font-bold text-foreground">
                  {steps[currentStep].title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {steps[currentStep].description}
                </p>
              </motion.div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-primary w-6'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="flex-1 text-muted-foreground hover:text-foreground"
                >
                  Skip
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-primary hover:bg-primary/90 gap-2"
                >
                  {currentStep < steps.length - 1 ? (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Start Building
                      <Rocket className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
