import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useUser } from '../../context/UserContext';
import { getLeaderboardData } from '../../utils/auth';
import { Button } from '../common/Button';
import { FloatingElements } from '../common/FloatingElements';

export function LeaderboardScreen() {
  const { dispatch } = useGame();
  const { currentUser } = useUser();
  const entries = getLeaderboardData();
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', background: 'linear-gradient(180deg, #FFF0F5, #CE93D8)',
      position: 'relative', overflow: 'hidden', padding: '20px',
    }}>
      <FloatingElements elements={['🏆', '🥇', '⭐', '🌟', '💖']} count={8} />

      <motion.h1
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', color: '#E91E63', textAlign: 'center', marginBottom: '20px', zIndex: 1 }}
      >
        Κατάταξη 🏆
      </motion.h1>

      <div style={{
        width: '100%', maxWidth: '350px', flex: 1, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1, paddingBottom: '20px',
      }}>
        {entries.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', opacity: 0.7, marginTop: '40px', color: '#E91E63' }}>
            Κανένα σκορ ακόμα! Παίξε για να μπεις στη λίστα! 🎮
          </motion.p>
        ) : (
          entries.map((entry, i) => (
            <motion.div
              key={entry.username}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 18px', borderRadius: 'var(--radius-md)',
                background: entry.username === currentUser
                  ? 'linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(206, 147, 216, 0.3))'
                  : 'rgba(255, 255, 255, 0.7)',
                border: entry.username === currentUser
                  ? '2px solid #FF69B4'
                  : '1px solid rgba(255, 105, 180, 0.2)',
              }}
            >
              <span style={{ fontSize: '24px', width: '36px', textAlign: 'center' }}>
                {i < 3 ? medals[i] : `${i + 1}.`}
              </span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: '15px', color: '#4A0028' }}>
                {entry.username}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <span style={{ fontFamily: 'var(--font-numbers)', fontSize: '16px', color: '#E91E63' }}>
                  {entry.totalStars} ⭐
                </span>
                <span style={{ fontSize: '11px', opacity: 0.6, color: '#666' }}>
                  {entry.unlockedWorldsCount} κόσμοι
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div style={{ zIndex: 1, paddingTop: '10px' }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })} variant="secondary" size="medium">
          Πίσω 🔙
        </Button>
      </div>
    </div>
  );
}
