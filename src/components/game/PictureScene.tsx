import { motion } from 'framer-motion';
import { SceneObject } from '../../types';

interface PictureSceneProps {
  objects: SceneObject[];
  foundWords: string[];
  activeOnly?: string; // if set, only this word is tappable
  onTap: (obj: SceneObject) => void;
}

export function PictureScene({ objects, foundWords, activeOnly, onTap }: PictureSceneProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px' }}>
      {objects.map(obj => {
        const isFound = foundWords.includes(obj.word);
        const isActive = !activeOnly || activeOnly === obj.word;
        return (
          <motion.button
            key={obj.id}
            onClick={() => isActive && !isFound && onTap(obj)}
            whileTap={isActive && !isFound ? { scale: 1.3 } : {}}
            style={{
              position: 'absolute',
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: '32px',
              background: isFound ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: isFound ? '2px solid #4CAF50' : '2px solid transparent',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isActive && !isFound ? 'pointer' : 'default',
              opacity: isActive || isFound ? 1 : 0.4,
              transition: 'all 0.3s',
            }}
          >
            {obj.emoji}
            {isFound && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -25 }}
                style={{
                  position: 'absolute', top: '-20px',
                  fontSize: '11px', fontFamily: 'var(--font-body)',
                  color: '#E91E63', fontWeight: 700,
                  background: 'rgba(255,255,255,0.9)',
                  padding: '2px 6px', borderRadius: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                {obj.word}
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
