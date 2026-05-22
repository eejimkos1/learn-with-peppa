import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ConfettiProps {
  active: boolean;
  count?: number;
}

export function Confetti({ active, count = 30 }: ConfettiProps) {
  const particles = useMemo(() => {
    const emojis = ['💖', '⭐', '🦋', '✨', '🌸', '💫', '🎀', '🌈'];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      size: 16 + Math.random() * 16,
    }));
  }, [count]);

  if (!active) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1000, overflow: 'hidden' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '-10vh', x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: 720 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
          style={{ position: 'absolute', fontSize: `${p.size}px` }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
