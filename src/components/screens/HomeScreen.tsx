import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useUser } from '../../context/UserContext';
import { FloatingElements } from '../common/FloatingElements';
import { PeppaCharacter } from '../common/PeppaCharacter';
import { StarDisplay } from '../common/StarDisplay';
import { SyncIndicator } from '../common/SyncIndicator';

const HOME_ELEMENTS = ['💖', '🦋', '✨', '🌸', '⭐', '💫', '🌺', '💝', '🎀', '💕'];

export function HomeScreen() {
  const { state, dispatch } = useGame();
  const { currentUser, logout } = useUser();

  const totalStars = state.progress.totalStars;

  function handlePlay() {
    dispatch({ type: 'SET_SCREEN', screen: 'worldMap' });
  }

  function handleSettings() {
    dispatch({ type: 'SET_SCREEN', screen: 'settings' });
  }

  function handleTrophies() {
    dispatch({ type: 'SET_SCREEN', screen: 'trophy' });
  }

  function handleLeaderboard() {
    dispatch({ type: 'SET_SCREEN', screen: 'leaderboard' });
  }

  function handleDressUp() {
    dispatch({ type: 'SET_SCREEN', screen: 'dressUp' });
  }

  function handleLogout() {
    logout();
    dispatch({ type: 'SET_SCREEN', screen: 'auth' });
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #FFB6C1 0%, #FF69B4 30%, #E91E63 60%, #CE93D8 80%, #C3A0E8 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: '20px 16px',
      }}
    >
      {/* Animated sparkle overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,215,0,0.12) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <FloatingElements elements={HOME_ELEMENTS} count={18} />

      {/* TOP BAR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          position: 'relative',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '15px',
            color: 'white',
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            lineHeight: 1.2,
          }}
        >
          <div style={{ fontSize: '11px', opacity: 0.85 }}>Μαθαίνω με την</div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>Πέπα 🐷</div>
        </div>

        {/* Star counter + Sync */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SyncIndicator />
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-lg)',
              padding: '6px 14px',
              border: '2px solid rgba(255,255,255,0.5)',
              boxShadow: '0 2px 12px rgba(255,215,0,0.3)',
            }}
          >
            <StarDisplay count={totalStars} size="small" />
          </motion.div>
        </div>
      </motion.div>

      {/* GREETING */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          zIndex: 10,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.28)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-lg)',
            padding: '8px 22px',
            border: '2px solid rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-heading)',
            fontSize: '18px',
            color: 'white',
            textShadow: '0 1px 6px rgba(0,0,0,0.25)',
            boxShadow: '0 4px 20px rgba(233,30,99,0.2)',
          }}
        >
          Γεια σου, {currentUser || 'φίλε'}! 🐷
        </div>
      </motion.div>

      {/* PEPPA CHARACTER */}
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
        style={{
          zIndex: 10,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* Glow ring behind Peppa */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 30px rgba(255,105,180,0.4), 0 0 60px rgba(206,147,216,0.3)',
              '0 0 50px rgba(255,105,180,0.7), 0 0 90px rgba(255,215,0,0.4)',
              '0 0 30px rgba(255,105,180,0.4), 0 0 60px rgba(206,147,216,0.3)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,105,180,0.25) 0%, transparent 70%)',
          }}
        />
        <PeppaCharacter mood="happy" size="large" equippedItems={state.progress.equippedItems} />

        {/* Sparkles around Peppa */}
        {['✨', '💫', '⭐'].map((spark, i) => (
          <motion.span
            key={i}
            animate={{
              y: [0, -12, 0],
              opacity: [0.6, 1, 0.6],
              rotate: [0, 20, -20, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              fontSize: '18px',
              top: i === 0 ? '-10px' : i === 1 ? '20px' : '50px',
              left: i === 0 ? '-30px' : i === 1 ? 'calc(100% + 10px)' : '-35px',
              pointerEvents: 'none',
            }}
          >
            {spark}
          </motion.span>
        ))}
      </motion.div>

      {/* PLAY BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.button
            onClick={handlePlay}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FF8C00, #FFD700)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite',
              border: '4px solid rgba(255,255,255,0.6)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 52px',
              fontSize: '26px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 8px rgba(180,80,0,0.5)',
              boxShadow: '0 6px 30px rgba(255,165,0,0.6), 0 2px 0 rgba(200,100,0,0.4)',
              cursor: 'pointer',
              letterSpacing: '1px',
            }}
          >
            ▶ ΠΑΙΞΕ! / PLAY!
          </motion.button>
        </motion.div>

        {/* Small nav buttons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[
            { emoji: '⚙️', label: 'Settings', handler: handleSettings },
            { emoji: '🏆', label: 'Trophies', handler: handleTrophies },
            { emoji: '🎀', label: 'Dress Up', handler: handleDressUp },
            { emoji: '📊', label: 'Leaderboard', handler: handleLeaderboard },
          ].map(({ emoji, label, handler }) => (
            <motion.button
              key={label}
              onClick={handler}
              whileHover={{ scale: 1.12, y: -3 }}
              whileTap={{ scale: 0.92 }}
              title={label}
              style={{
                background: 'rgba(255,255,255,0.3)',
                backdropFilter: 'blur(8px)',
                border: '2px solid rgba(255,255,255,0.55)',
                borderRadius: 'var(--radius-md)',
                width: '56px',
                height: '56px',
                fontSize: '22px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
              }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* LOGOUT BUTTON */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        style={{ zIndex: 10 }}
      >
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1.5px solid rgba(255,255,255,0.35)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 16px',
            fontSize: '12px',
            fontFamily: 'var(--font-body)',
            color: 'rgba(255,255,255,0.8)',
            cursor: 'pointer',
            opacity: 0.75,
          }}
        >
          Αποσύνδεση · Logout
        </motion.button>
      </motion.div>
    </div>
  );
}
