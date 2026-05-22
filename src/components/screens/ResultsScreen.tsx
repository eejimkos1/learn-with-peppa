import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { REWARDS } from '../../data/rewards';
import { WORLDS } from '../../data/worlds';
import { Screen } from '../../types';
import { Button } from '../common/Button';
import { Confetti } from '../common/Confetti';
import { FloatingElements } from '../common/FloatingElements';
import { PeppaCharacter } from '../common/PeppaCharacter';

function StarBadge({ earned, delay }: { earned: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -30, opacity: 0 }}
      animate={earned
        ? { scale: 1, rotate: 0, opacity: 1 }
        : { scale: 0.7, rotate: 0, opacity: 0.25 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16, delay }}
      style={{
        fontSize: 'clamp(36px, 12vw, 52px)',
        filter: earned ? 'drop-shadow(0 0 12px rgba(255,215,0,0.9))' : 'grayscale(1)',
        display: 'inline-block',
      }}
    >
      ⭐
    </motion.div>
  );
}

export function ResultsScreen() {
  const { state, dispatch } = useGame();
  const { playStar, playLevelComplete, playWorldUnlock, playButton } = useAudio();

  const worlds = WORLDS;
  const worldIndex = worlds.findIndex(w => w.id === state.currentWorld);
  const world = worlds[worldIndex];

  // Get the latest level result
  const levelKey = `${state.currentWorld}-${state.currentLevel}`;
  const result = state.progress.levelResults[levelKey];

  const stars = result?.stars ?? 0;
  const correct = result?.correct ?? 0;
  const total = result?.total ?? 0;

  // Find newly unlocked rewards by checking which rewards are now unlocked
  // We infer "new" by looking at rewards that just crossed the threshold
  const allUnlockedRewards = REWARDS.filter(r => state.progress.totalStars >= r.starsRequired);
  const newlyUnlocked = allUnlockedRewards.filter(r =>
    state.progress.unlockedRewards.includes(r.id)
  );
  // Show the latest reward if any (the one with the highest starsRequired that fits)
  const latestReward = newlyUnlocked.length > 0
    ? newlyUnlocked[newlyUnlocked.length - 1]
    : null;

  const [showReward, setShowReward] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [starsShown, setStarsShown] = useState(0);

  useEffect(() => {
    // Animate stars sequentially
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 3; i++) {
      timers.push(setTimeout(() => {
        setStarsShown(i);
        if (i <= stars) playStar();
      }, i * 550));
    }
    // Show confetti on 3 stars
    if (stars === 3) {
      timers.push(setTimeout(() => {
        setConfettiActive(true);
        playLevelComplete();
      }, 2200));
      timers.push(setTimeout(() => setConfettiActive(false), 4500));
    } else {
      timers.push(setTimeout(() => playLevelComplete(), 1800));
    }
    // Reveal reward if any
    if (latestReward) {
      timers.push(setTimeout(() => {
        setShowReward(true);
        playWorldUnlock();
      }, 3000));
    }
    return () => timers.forEach(clearTimeout);
  }, []); // intentionally run once on mount

  const encouragementMessage = () => {
    if (stars === 3) return { en: 'PERFECT!', gr: 'ΤΕΛΕΙΑ!', emoji: '🌟', sub: 'Peppa is SO proud!' };
    if (stars === 2) return { en: 'Very good!', gr: 'Πολύ καλά!', emoji: '💫', sub: "You're amazing!" };
    if (stars === 1) return { en: 'Good try!', gr: 'Μπράβο!', emoji: '✨', sub: 'Keep practicing!' };
    return { en: 'Try again!', gr: 'Ξαναπροσπάθησε!', emoji: '💪', sub: "You can do it!" };
  };

  const msg = encouragementMessage();

  const levelScreenMap: Record<number, Screen> = {
    0: 'showAndTell',
    1: 'showAndTell',
    2: 'pictureExplorer',
    3: 'pictureExplorer',
    4: 'scenePicker',
    5: 'scenePicker',
    6: 'hangman',
    7: 'hangman',
    8: 'singAlong',
    9: 'singAlong',
    10: 'quiz',
  };

  const handleAgain = () => {
    playButton();
    dispatch({ type: 'SELECT_LEVEL', level: state.currentLevel });
    const screen: Screen = levelScreenMap[state.currentLevel] ?? 'quiz';
    dispatch({ type: 'SET_SCREEN', screen });
  };

  const handleNext = () => {
    playButton();
    const nextLevel = state.currentLevel + 1;
    if (nextLevel > 10) {
      dispatch({ type: 'SET_SCREEN', screen: 'worldMap' });
      return;
    }
    dispatch({ type: 'SELECT_LEVEL', level: nextLevel });
    const screen: Screen = levelScreenMap[nextLevel] ?? 'quiz';
    dispatch({ type: 'SET_SCREEN', screen });
  };

  const handleMap = () => {
    playButton();
    dispatch({ type: 'SET_SCREEN', screen: 'daySchedule' });
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #FFF0F5 0%, #FFE4F0 20%, #FFD6E7 50%, #FFD700 80%, #FF8C00 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      fontFamily: 'var(--font-body)',
    }}>
      <FloatingElements elements={['💖', '⭐', '🌸', '💫', '✨']} count={6} />
      <Confetti active={confettiActive} count={60} />

      {/* Top sparkle strip */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{
          width: '100%', height: '6px',
          background: 'linear-gradient(90deg, #FF69B4, #FFD700, #FF69B4, #FFD700)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite',
        }}
      />

      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'clamp(14px, 3.5vh, 20px) clamp(14px, 4vw, 20px)', overflowY: 'auto', zIndex: 1 }}>

        {/* World badge */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,105,180,0.9), rgba(233,30,99,0.9))',
            borderRadius: '20px', padding: '6px 20px',
            color: 'white', fontFamily: 'var(--font-heading)',
            fontSize: '13px', fontWeight: 700,
            boxShadow: '0 4px 16px rgba(233,30,99,0.3)',
            marginBottom: '16px',
          }}
        >
          {world?.icon} {world?.name} · Level {state.currentLevel + 1}
        </motion.div>

        {/* Peppa celebrating */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 250, delay: 0.3 }}
          style={{ marginBottom: '8px' }}
        >
          <PeppaCharacter mood="excited" size="large" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          style={{ textAlign: 'center', marginBottom: '20px' }}
        >
          <div style={{ fontSize: 'clamp(28px, 9vw, 36px)', marginBottom: '4px' }}>{msg.emoji}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 6vw, 26px)', fontWeight: 800, color: '#E91E63', lineHeight: 1.1 }}>
            {msg.en} {msg.gr}
          </div>
          <div style={{ fontSize: '14px', color: '#C2185B', marginTop: '4px' }}>
            {msg.sub}
          </div>
        </motion.div>

        {/* Stars row */}
        <div style={{
          display: 'flex', gap: '8px', justifyContent: 'center',
          marginBottom: '20px',
        }}>
          {[1, 2, 3].map(i => (
            <StarBadge key={i} earned={i <= stars && starsShown >= i} delay={i * 0.55} />
          ))}
        </div>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          style={{
            background: 'rgba(255,255,255,0.75)',
            borderRadius: '20px', padding: 'clamp(12px, 3vh, 16px) clamp(20px, 6vw, 32px)',
            boxShadow: '0 6px 24px rgba(233,30,99,0.15)',
            border: '2px solid rgba(255,105,180,0.3)',
            backdropFilter: 'blur(8px)',
            marginBottom: '20px', textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', color: '#9E9E9E', marginBottom: '4px' }}>
            Σωστές / Correct
          </div>
          <div style={{ fontFamily: 'var(--font-numbers)', fontSize: 'clamp(28px, 9vw, 36px)', color: '#E91E63', fontWeight: 800 }}>
            {correct} <span style={{ color: '#9E9E9E', fontSize: 'clamp(18px, 5.5vw, 24px)' }}>/ {total}</span>
          </div>
          <div style={{ fontSize: '13px', color: '#FF69B4', marginTop: '4px' }}>
            ⭐ {state.progress.totalStars} total stars
          </div>
        </motion.div>

        {/* Reward reveal */}
        <AnimatePresence>
          {showReward && latestReward && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                borderRadius: '24px', padding: 'clamp(14px, 3.5vh, 20px) clamp(20px, 6vw, 32px)',
                textAlign: 'center', color: 'white',
                boxShadow: '0 8px 40px rgba(255,215,0,0.6)',
                border: '3px solid rgba(255,255,255,0.6)',
                marginBottom: '20px', width: '100%', maxWidth: '380px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', marginBottom: '8px', opacity: 0.9 }}>
                NEW REWARD UNLOCKED! 🎁
              </div>
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ fontSize: 'clamp(40px, 14vw, 60px)', marginBottom: 'clamp(6px, 1.5vh, 8px)' }}
              >
                {latestReward.icon}
              </motion.div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(16px, 4.5vw, 20px)', fontWeight: 800 }}>
                {latestReward.nameEn}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.85, marginTop: '2px' }}>
                {latestReward.name}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3 }}
          style={{
            display: 'flex', gap: '12px', flexWrap: 'wrap',
            justifyContent: 'center', paddingBottom: '20px',
          }}
        >
          <Button onClick={handleAgain} variant="secondary" size="medium">
            Again 🔄
          </Button>
          <Button onClick={handleNext} variant="primary" size="large">
            Next ➡️
          </Button>
          <Button onClick={handleMap} variant="gold" size="medium">
            Map 🗺️
          </Button>
        </motion.div>
      </div>

      {/* Bottom decorative strip */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{
          width: '100%', height: '6px',
          background: 'linear-gradient(90deg, #FFD700, #FF69B4, #FFD700, #FF69B4)',
          zIndex: 2,
        }}
      />
    </div>
  );
}
