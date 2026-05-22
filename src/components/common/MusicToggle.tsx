import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';

export function MusicToggle() {
  const { state, dispatch } = useGame();
  const { toggleMusic } = useAudio();

  const handleToggle = () => {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { musicEnabled: !state.settings.musicEnabled } });
    toggleMusic();
  };

  return (
    <motion.button
      onClick={handleToggle}
      whileTap={{ scale: 0.9 }}
      style={{
        background: 'rgba(255, 105, 180, 0.2)',
        border: '2px solid rgba(255, 105, 180, 0.4)',
        borderRadius: 'var(--radius-full)',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        cursor: 'pointer',
      }}
    >
      {state.settings.musicEnabled ? '🎵' : '🔇'}
    </motion.button>
  );
}
