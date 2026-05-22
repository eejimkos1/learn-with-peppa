import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { SCENES } from '../../data/scenes';
import { WORLDS } from '../../data/worlds';
import { speakWord } from '../../utils/synthAudio';
import { FloatingElements } from '../common/FloatingElements';
import { PeppaCharacter } from '../common/PeppaCharacter';
import { SpeechBubble } from '../common/SpeechBubble';
import { PictureScene } from '../game/PictureScene';
import { SceneObject } from '../../types';

type ExplorePhase = 'guided' | 'free' | 'done';

// Shuffle array
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PictureExplorer() {
  const { state, dispatch } = useGame();
  const { playCorrect, playLevelComplete, playStar } = useAudio();

  const world = WORLDS.find(w => w.id === state.currentWorld);
  const scene = SCENES.find(s => s.worldId === state.currentWorld);

  // Level 2 (index) = guided mode (level 3 in 1-based), Level 3 = free explore (level 4 in 1-based)
  const isFreeExplore = state.currentLevel >= 3;

  // Shuffle the target words so guided order varies
  const shuffledTargets = useMemo(() => {
    if (!scene) return [];
    return shuffle(scene.targetWords);
  }, [scene]);

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState<ExplorePhase>(isFreeExplore ? 'free' : 'guided');
  const [bonusCount, setBonusCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    setFoundWords([]);
    setTargetIndex(0);
    setTimeLeft(60);
    setPhase(isFreeExplore ? 'free' : 'guided');
    setBonusCount(0);
    setShowCelebration(false);
  }, [state.currentWorld, state.currentLevel]);

  const currentTarget = shuffledTargets[targetIndex] ?? '';

  // Free explore countdown timer
  useEffect(() => {
    if (!scene || !world) return;
    if (phase !== 'free') return;
    if (timeLeft <= 0) {
      const finalFoundTargets = foundWords.filter(w => scene.targetWords.includes(w));
      const targetCount = finalFoundTargets.length;
      const stars = targetCount >= 5 ? 3 : targetCount >= 4 ? 2 : targetCount >= 3 ? 1 : 1;
      playLevelComplete();
      setPhase('done');
      dispatch({
        type: 'COMPLETE_LEVEL',
        result: {
          worldId: world.id,
          levelIndex: state.currentLevel,
          stars,
          correct: targetCount,
          total: scene.targetWords.length,
          time: 60 - timeLeft,
        },
      });
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, timeLeft, scene, world, foundWords, playLevelComplete, dispatch, state.currentLevel]);

  if (!world || !scene) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p>Loading scene...</p>
      </div>
    );
  }

  const safeWorld = world;
  const safeScene = scene;
  const primaryColor = safeWorld.colors.primary;
  const foundTargets = foundWords.filter(w => safeScene.targetWords.includes(w));

  // --- Tap handler ---
  function handleTap(obj: SceneObject) {
    if (foundWords.includes(obj.word)) return;

    speakWord(obj.word);
    setFoundWords(prev => [...prev, obj.word]);

    const isTarget = safeScene.targetWords.includes(obj.word);

    if (isTarget) {
      playCorrect();
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);

      if (phase === 'guided') {
        // Move to the next target
        if (targetIndex + 1 >= shuffledTargets.length) {
          setTimeout(() => finishLevel(), 800);
        } else {
          setTargetIndex(i => i + 1);
        }
      } else if (phase === 'free') {
        // All targets found before time runs out?
        const newFoundTargets = [...foundWords, obj.word].filter(w => safeScene.targetWords.includes(w));
        if (newFoundTargets.length >= safeScene.targetWords.length) {
          setTimeout(finishLevel, 800);
        }
      }
    } else {
      // Bonus object
      playStar();
      setBonusCount(b => b + 1);
    }
  }

  function finishLevel() {
    const finalFoundTargets = foundWords.filter(w => safeScene.targetWords.includes(w));
    const targetCount = finalFoundTargets.length;
    const stars = targetCount >= 5 ? 3 : targetCount >= 4 ? 2 : targetCount >= 3 ? 1 : 1;
    playLevelComplete();
    setPhase('done');
    dispatch({
      type: 'COMPLETE_LEVEL',
      result: {
        worldId: safeWorld.id,
        levelIndex: state.currentLevel,
        stars,
        correct: targetCount,
        total: safeScene.targetWords.length,
        time: isFreeExplore ? 60 - timeLeft : 0,
      },
    });
  }

  // Peppa mood
  const peppaMood = showCelebration ? 'excited' : phase === 'free' ? 'encouraging' : 'teaching';

  // Peppa speech
  function getPeppaSpeech(): string {
    if (showCelebration) return 'Βρήκες το! 🌟 Μπράβο!';
    if (phase === 'free') {
      const remaining = safeScene.targetWords.length - foundTargets.length;
      if (remaining === 0) return 'Τα βρήκες όλα! 🎉';
      return `Βρες ${remaining} ακόμα! ⏱️ ${timeLeft}s`;
    }
    if (phase === 'guided') {
      return `Βρες το "${currentTarget}"! 👀`;
    }
    return 'Ωραία! 🌟';
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: safeScene.background,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <FloatingElements elements={safeWorld.floatingElements} count={8} />

      {/* ====== HEADER ====== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(8px, 2vh, 12px) clamp(12px, 3vw, 16px)',
          background: 'rgba(255,255,255,0.65)',
          backdropFilter: 'blur(8px)',
          borderBottom: '2px solid #FFB6C1',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {/* Back button */}
        <button
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'daySchedule' })}
          style={{
            background: 'rgba(255,255,255,0.8)',
            border: '2px solid #FFB6C1',
            borderRadius: '50%',
            width: 'clamp(32px, 8vw, 38px)', height: 'clamp(32px, 8vw, 38px)',
            fontSize: 'clamp(14px, 4vw, 18px)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ←
        </button>

        {/* Title */}
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(14px, 3.5vw, 17px)',
            color: primaryColor,
            fontWeight: 700,
          }}
        >
          🔍 Picture Explorer
        </div>

        {/* Free explore: timer; guided: target dots */}
        {phase === 'free' ? (
          <div
            style={{
              background: timeLeft <= 10 ? 'linear-gradient(135deg,#F44336,#E91E63)' : 'linear-gradient(135deg, #FF69B4, #E91E63)',
              color: 'white',
              borderRadius: '20px',
              padding: '4px 12px',
              fontFamily: 'var(--font-heading)',
              fontSize: '16px',
              fontWeight: 700,
              minWidth: '54px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(233,30,99,0.3)',
            }}
          >
            ⏱ {timeLeft}s
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {shuffledTargets.map((w, i) => (
              <div
                key={w}
                style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: foundWords.includes(w) ? '#4CAF50' : i === targetIndex ? primaryColor : 'rgba(255,255,255,0.5)',
                  border: `2px solid ${i === targetIndex ? primaryColor : '#FFB6C1'}`,
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ====== FOUND WORDS STRIP ====== */}
      <AnimatePresence>
        {foundWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              display: 'flex',
              gap: 'clamp(4px, 1.5vw, 6px)',
              padding: 'clamp(6px, 1.5vh, 8px) clamp(10px, 3vw, 14px)',
              flexWrap: 'wrap',
              background: 'rgba(255,255,255,0.55)',
              borderBottom: '1px solid rgba(255,182,193,0.4)',
              zIndex: 5,
              flexShrink: 0,
            }}
          >
            {foundWords.map(w => (
              <motion.span
                key={w}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  background: safeScene.targetWords.includes(w)
                    ? 'linear-gradient(135deg,#4CAF50,#81C784)'
                    : 'linear-gradient(135deg,#FF69B4,#E91E63)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '3px 10px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                }}
              >
                {w} {safeScene.targetWords.includes(w) ? '✓' : '+'}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== MAIN SCENE AREA ====== */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          minHeight: '280px',
        }}
      >
        <PictureScene
          objects={safeScene.objects}
          foundWords={foundWords}
          activeOnly={phase === 'guided' ? currentTarget : undefined}
          onTap={handleTap}
        />

        {/* Celebration burst */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '60px',
                zIndex: 20,
                pointerEvents: 'none',
              }}
            >
              🌟
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guided mode: highlight ring around active object */}
        {phase === 'guided' && !showCelebration && (() => {
          const targetObj = safeScene.objects.find(o => o.word === currentTarget);
          if (!targetObj) return null;
          return (
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                left: `${targetObj.x}%`,
                top: `${targetObj.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '64px', height: '64px',
                borderRadius: '50%',
                border: `3px dashed ${primaryColor}`,
                pointerEvents: 'none',
                zIndex: 6,
              }}
            />
          );
        })()}
      </div>

      {/* ====== BOTTOM PANEL: Peppa + hint ====== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 'clamp(8px, 2vw, 10px)',
          padding: 'clamp(8px, 2vh, 12px) clamp(12px, 3vw, 16px)',
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(8px)',
          borderTop: '2px solid #FFB6C1',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <PeppaCharacter mood={peppaMood} size="small" />

        <div style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTarget + phase + showCelebration}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <SpeechBubble text={getPeppaSpeech()} position="left" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              color: '#4CAF50',
              fontWeight: 700,
            }}
          >
            ✅ {foundTargets.length}/{safeScene.targetWords.length}
          </div>
          {bonusCount > 0 && (
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '12px',
                color: '#E91E63',
                fontWeight: 600,
              }}
            >
              +{bonusCount} bonus!
            </div>
          )}
        </div>
      </div>

      {/* ====== FREE EXPLORE MODE: progress bar ====== */}
      {phase === 'free' && (
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0,
            width: `${(timeLeft / 60) * 100}%`,
            height: '4px',
            background: 'linear-gradient(90deg, #E91E63, #FF69B4)',
            transition: 'width 1s linear',
            zIndex: 15,
          }}
        />
      )}
    </div>
  );
}
