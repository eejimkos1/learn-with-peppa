import { motion } from 'framer-motion';

interface StarDisplayProps {
  count: number;
  size?: 'small' | 'large';
}

export function StarDisplay({ count, size = 'small' }: StarDisplayProps) {
  const fontSize = size === 'large' ? '24px' : '16px';
  return (
    <motion.div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'var(--font-numbers)',
        fontSize,
        color: '#FFD700',
      }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
      key={count}
    >
      <span>⭐</span>
      <span>{count}</span>
    </motion.div>
  );
}
