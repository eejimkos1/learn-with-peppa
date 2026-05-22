import { useMemo } from 'react';

interface FloatingElementsProps {
  elements?: string[];
  count?: number;
}

export function FloatingElements({ elements = ['💖', '⭐', '🦋', '✨', '🌸'], count = 12 }: FloatingElementsProps) {
  const items = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: elements[i % elements.length],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 14 + Math.random() * 18,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
    })),
  [elements, count]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {items.map(item => (
        <span
          key={item.id}
          style={{
            position: 'absolute',
            left: item.left,
            top: item.top,
            fontSize: `${item.size}px`,
            opacity: 0.6,
            animation: `float ${item.duration}s ease-in-out ${item.delay}s infinite`,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
