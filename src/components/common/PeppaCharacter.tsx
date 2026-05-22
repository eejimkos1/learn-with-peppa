import { motion } from 'framer-motion';
import { ItemSlot } from '../../types';

interface PeppaCharacterProps {
  mood?: 'happy' | 'excited' | 'encouraging' | 'teaching' | 'idle';
  size?: 'small' | 'medium' | 'large';
  equippedItems?: Record<ItemSlot, string | null>;
}

export function PeppaCharacter({ mood = 'idle', size = 'medium', equippedItems }: PeppaCharacterProps) {
  const scales = { small: 0.6, medium: 1, large: 1.4 };
  const scale = scales[size];

  const animations = {
    happy: { y: [0, -10, 0], rotate: [0, 5, -5, 0] },
    excited: { y: [0, -20, 0], scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] },
    encouraging: { rotate: [0, 10, -10, 0] },
    teaching: { y: [0, -3, 0] },
    idle: { y: [0, -5, 0] },
  };

  const headItem = equippedItems?.head;
  const bodyItem = equippedItems?.body;
  const feetItem = equippedItems?.feet;
  const backItem = equippedItems?.back;
  const handItem = equippedItems?.hand;

  const bodyColor = bodyItem === 'reward-ballet-tutu'
    ? '#CE93D8'
    : bodyItem === 'reward-superstar-outfit'
      ? 'linear-gradient(135deg, #FFD700, #FF8C00)'
      : bodyItem === 'reward-peppa-dress'
        ? '#FF4081'
        : '#E91E63';

  const bodyBackground = bodyItem === 'reward-superstar-outfit'
    ? 'linear-gradient(135deg, #FFD700, #FF8C00)'
    : bodyColor;

  return (
    <motion.div
      animate={animations[mood]}
      transition={{ duration: mood === 'idle' ? 3 : 0.6, repeat: mood === 'idle' ? Infinity : 0, ease: 'easeInOut' }}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${scale})`,
        position: 'relative',
      }}
    >
      {/* Wings (behind everything) */}
      {backItem === 'reward-fairy-wings' && (
        <div style={{
          position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 0, fontSize: '28px', opacity: 0.8,
          filter: 'drop-shadow(0 0 4px rgba(206,147,216,0.6))',
        }}>
          🧚
        </div>
      )}

      {/* Head item (crown/tiara) */}
      {headItem && (
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
            fontSize: '20px', zIndex: 10,
            filter: 'drop-shadow(0 2px 4px rgba(255,215,0,0.5))',
          }}
        >
          {headItem === 'reward-golden-crown' ? '👑' : '💎'}
        </motion.div>
      )}

      {/* Peppa face */}
      <div style={{
        width: '60px',
        height: '50px',
        background: '#FFB6C1',
        borderRadius: '50% 50% 45% 45%',
        position: 'relative',
        border: '2px solid #E91E63',
        zIndex: 2,
      }}>
        {/* Ears */}
        <div style={{
          position: 'absolute', top: '-8px', left: '10px',
          width: '12px', height: '16px', background: '#FFB6C1',
          borderRadius: '50%', border: '2px solid #E91E63',
        }} />
        <div style={{
          position: 'absolute', top: '-8px', right: '10px',
          width: '12px', height: '16px', background: '#FFB6C1',
          borderRadius: '50%', border: '2px solid #E91E63',
        }} />
        {/* Eyes */}
        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          width: '8px', height: '8px', background: '#333',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          width: '8px', height: '8px', background: '#333',
          borderRadius: '50%',
        }} />
        {/* Snout */}
        <div style={{
          position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)',
          width: '20px', height: '14px', background: '#FF8FAB',
          borderRadius: '50%', border: '1.5px solid #E91E63',
        }}>
          <div style={{ position: 'absolute', top: '4px', left: '4px', width: '4px', height: '4px', background: '#E91E63', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '4px', right: '4px', width: '4px', height: '4px', background: '#E91E63', borderRadius: '50%' }} />
        </div>
        {/* Mouth */}
        <div style={{
          position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
          width: '16px', height: mood === 'happy' || mood === 'excited' ? '8px' : '4px',
          borderBottom: '2px solid #E91E63',
          borderRadius: '0 0 50% 50%',
        }} />
        {/* Blush */}
        <div style={{
          position: 'absolute', top: '22px', left: '4px',
          width: '10px', height: '6px', background: 'rgba(255, 105, 180, 0.3)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', top: '22px', right: '4px',
          width: '10px', height: '6px', background: 'rgba(255, 105, 180, 0.3)',
          borderRadius: '50%',
        }} />
      </div>

      {/* Body */}
      <div style={{
        width: '50px', height: '40px',
        background: bodyBackground,
        borderRadius: bodyItem === 'reward-ballet-tutu' ? '25px 25px 35px 35px' : '25px 25px 15px 15px',
        marginTop: '-5px',
        position: 'relative',
        zIndex: 1,
        border: bodyItem === 'reward-superstar-outfit' ? '2px solid #FFD700' : undefined,
        boxShadow: bodyItem === 'reward-superstar-outfit' ? '0 0 10px rgba(255,215,0,0.5)' : undefined,
      }}>
        {/* Tutu skirt detail */}
        {bodyItem === 'reward-ballet-tutu' && (
          <div style={{
            position: 'absolute', bottom: '-4px', left: '-5px', right: '-5px',
            height: '14px', background: 'rgba(206,147,216,0.6)',
            borderRadius: '0 0 50% 50%',
            border: '1px solid rgba(206,147,216,0.8)',
          }} />
        )}
        {/* Arms */}
        <div style={{
          position: 'absolute', top: '5px', left: '-8px',
          width: '10px', height: '20px', background: '#FFB6C1',
          borderRadius: '5px', transform: mood === 'encouraging' || mood === 'excited' ? 'rotate(-30deg)' : 'rotate(0)',
          transition: 'transform 0.3s',
        }} />
        <div style={{
          position: 'absolute', top: '5px', right: '-8px',
          width: '10px', height: '20px', background: '#FFB6C1',
          borderRadius: '5px', transform: mood === 'encouraging' || mood === 'excited' ? 'rotate(30deg)' : 'rotate(0)',
          transition: 'transform 0.3s',
        }} />
        {/* Microphone in hand */}
        {handItem === 'reward-microphone' && (
          <div style={{
            position: 'absolute', top: '0px', right: '-18px',
            fontSize: '14px', transform: 'rotate(15deg)',
          }}>
            🎤
          </div>
        )}
      </div>

      {/* Legs */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '-2px', zIndex: 1 }}>
        {feetItem === 'reward-rainbow-boots' ? (
          <>
            <div style={{
              width: '12px', height: '18px',
              background: 'linear-gradient(180deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF)',
              borderRadius: '3px 3px 5px 5px',
              border: '1px solid rgba(0,0,0,0.15)',
            }} />
            <div style={{
              width: '12px', height: '18px',
              background: 'linear-gradient(180deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF)',
              borderRadius: '3px 3px 5px 5px',
              border: '1px solid rgba(0,0,0,0.15)',
            }} />
          </>
        ) : (
          <>
            <div style={{ width: '10px', height: '15px', background: '#FFB6C1', borderRadius: '3px 3px 5px 5px' }} />
            <div style={{ width: '10px', height: '15px', background: '#FFB6C1', borderRadius: '3px 3px 5px 5px' }} />
          </>
        )}
      </div>
    </motion.div>
  );
}
