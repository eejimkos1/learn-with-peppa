import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useUser } from '../../context/UserContext';
import { FloatingElements } from '../common/FloatingElements';
import { PeppaCharacter } from '../common/PeppaCharacter';

export function SplashScreen() {
  const { dispatch } = useGame();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_SCREEN', screen: isAuthenticated ? 'home' : 'auth' });
      if (isAuthenticated) dispatch({ type: 'LOAD_USER' });
    }, 2500);
    return () => clearTimeout(timer);
  }, [dispatch, isAuthenticated]);

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFB6C1, #FF69B4, #CE93D8)',
      position: 'relative', overflow: 'hidden', gap: '20px',
    }}>
      <FloatingElements elements={['💖', '⭐', '🦋', '✨', '🌸', '🎀']} count={15} />

      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        style={{ zIndex: 1 }}
      >
        <PeppaCharacter mood="excited" size="large" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '28px',
          color: 'white',
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1,
        }}
      >
        Μαθαίνω με την Πέπα
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          fontSize: '18px', color: 'rgba(255,255,255,0.9)',
          fontFamily: 'var(--font-body)', zIndex: 1,
        }}
      >
        Hello! Γεια σου! 🐷
      </motion.p>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '60%' }}
        transition={{ duration: 2, delay: 0.3 }}
        style={{
          height: '6px', background: 'linear-gradient(90deg, #FFD700, #FF69B4)',
          borderRadius: '3px', marginTop: '20px', zIndex: 1,
        }}
      />
    </div>
  );
}
