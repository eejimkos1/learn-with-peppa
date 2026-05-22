import { motion, AnimatePresence } from 'framer-motion';

interface HeartsProps {
  lives: number;
  maxLives?: number;
}

export function Hearts({ lives, maxLives = 3 }: HeartsProps) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {Array.from({ length: maxLives }).map((_, i) => (
        <AnimatePresence key={i} mode="wait">
          {i < lives ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{ fontSize: '24px' }}
            >
              💖
            </motion.span>
          ) : (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ fontSize: '24px', opacity: 0.3 }}
            >
              🤍
            </motion.span>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}
