import { motion } from 'framer-motion';

interface SpeechBubbleProps {
  text: string;
  position?: 'left' | 'right';
}

export function SpeechBubble({ text, position = 'right' }: SpeechBubbleProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{
        background: 'white',
        borderRadius: '20px',
        padding: '10px 16px',
        maxWidth: '200px',
        fontSize: '13px',
        fontFamily: 'var(--font-body)',
        color: '#333',
        position: 'relative',
        boxShadow: '0 2px 10px rgba(255, 105, 180, 0.2)',
        border: '2px solid #FFB6C1',
      }}
    >
      {text}
      {/* Tail */}
      <div style={{
        position: 'absolute',
        bottom: '-8px',
        [position === 'left' ? 'left' : 'right']: '20px',
        width: '0',
        height: '0',
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: '8px solid white',
      }} />
    </motion.div>
  );
}
