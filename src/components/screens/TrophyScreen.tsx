import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { REWARDS } from '../../data/rewards';
import { Button } from '../common/Button';
import { FloatingElements } from '../common/FloatingElements';

export function TrophyScreen() {
  const { state, dispatch } = useGame();
  const unlockedIds = state.progress.unlockedRewards;

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', background: 'linear-gradient(180deg, #FFF0F5, #FFB6C1)',
      position: 'relative', overflow: 'auto', padding: '20px',
    }}>
      <FloatingElements elements={['🏆', '👑', '⭐', '🎀', '✨']} count={8} />

      <motion.h1
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', color: '#E91E63', marginBottom: '20px', zIndex: 1 }}
      >
        Τα Βραβεία μου 🏆
      </motion.h1>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px',
        width: '100%', maxWidth: '350px', zIndex: 1, paddingBottom: '80px',
      }}>
        {REWARDS.map((reward, i) => {
          const unlocked = unlockedIds.includes(reward.id);
          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: unlocked ? 'rgba(255,255,255,0.9)' : 'rgba(255,182,193,0.3)',
                borderRadius: 'var(--radius-md)', padding: '12px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                border: unlocked ? '2px solid #FFD700' : '2px solid rgba(255,105,180,0.3)',
                boxShadow: unlocked ? '0 2px 10px rgba(255,215,0,0.3)' : 'none',
              }}
            >
              <span style={{ fontSize: '28px', filter: unlocked ? 'none' : 'grayscale(1) blur(2px)' }}>
                {unlocked ? reward.icon : '❓'}
              </span>
              <span style={{ fontSize: '10px', textAlign: 'center', fontFamily: 'var(--font-body)', color: unlocked ? '#E91E63' : '#999' }}>
                {unlocked ? reward.name : `${reward.starsRequired} ⭐`}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div style={{ position: 'fixed', bottom: '20px', zIndex: 2, display: 'flex', gap: '10px' }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'dressUp' })} variant="primary" size="medium">
          🎀 Ντύσε την Πέπα!
        </Button>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })} variant="secondary" size="medium">
          Πίσω 🔙
        </Button>
      </div>
    </div>
  );
}
