import { motion } from 'framer-motion';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export function Button({ onClick, children, variant = 'primary', size = 'medium', disabled = false }: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const sizes = {
    small: { padding: 'clamp(6px, 1.5vh, 8px) clamp(12px, 4vw, 16px)', fontSize: 'clamp(12px, 3vw, 14px)' },
    medium: { padding: 'clamp(10px, 2vh, 12px) clamp(18px, 5vw, 24px)', fontSize: 'clamp(14px, 3.5vw, 16px)' },
    large: { padding: 'clamp(12px, 2.5vh, 16px) clamp(28px, 8vw, 36px)', fontSize: 'clamp(16px, 4.5vw, 20px)' },
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #FF69B4, #E91E63)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)',
    },
    secondary: {
      background: 'linear-gradient(135deg, #CE93D8, #9C27B0)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(206, 147, 216, 0.4)',
    },
    gold: {
      background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
    },
  };

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      style={{ ...baseStyle, ...sizes[size], ...variants[variant] }}
    >
      {children}
    </motion.button>
  );
}
