import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

interface TextRotateProps {
  words: string[];
  className?: string;
  interval?: number;
  staggerDelay?: number;
}

const TextRotate = React.forwardRef<HTMLSpanElement, TextRotateProps>(
  ({ words, className, interval = 2000, staggerDelay = 0.03 }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, interval);
      return () => clearInterval(timer);
    }, [words.length, interval]);

    const currentWord = words[currentIndex];
    const letters = currentWord.split("");

    return (
      <span
        ref={ref}
        className={cn("inline-flex overflow-hidden relative", className)}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            className="inline-flex"
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ staggerChildren: staggerDelay }}
          >
            {letters.map((letter, i) => (
              <motion.span
                key={`${currentIndex}-${i}`}
                className="inline-block"
                variants={{
                  hidden: { y: "100%", opacity: 0, filter: "blur(4px)" },
                  visible: {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: {
                      type: "spring",
                      stiffness: 200,
                      damping: 28,
                    },
                  },
                  exit: {
                    y: "-100%",
                    opacity: 0,
                    filter: "blur(4px)",
                    transition: {
                      type: "spring",
                      stiffness: 200,
                      damping: 28,
                    },
                  },
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </span>
    );
  }
);

TextRotate.displayName = "TextRotate";

export { TextRotate };
export type { TextRotateProps };
