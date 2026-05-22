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
    small: { padding: '8px 16px', fontSize: '14px' },
    medium: { padding: '12px 24px', fontSize: '16px' },
    large: { padding: '16px 36px', fontSize: '20px' },
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
