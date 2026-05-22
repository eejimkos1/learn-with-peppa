import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { SCENE_PICKER_DATA } from '../../data/scenePicker';
import { speakWord, cancelSpeech } from '../../utils/synthAudio';
import { Button } from '../common/Button';
import { FloatingElements } from '../common/FloatingElements';
import { PeppaCharacter } from '../common/PeppaCharacter';

export function ScenePicker() {
  const { state, dispatch } = useGame();
  const { playCorrect, playWrong, playLevelComplete } = useAudio();

  const sceneData = SCENE_PICKER_DATA.find(s => s.worldId === state.currentWorld);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [wrongItems, setWrongItems] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [listeningWord, setListeningWord] = useState<string | null>(null);

  useEffect(() => {
    setSelected(new Set());
    setRevealed(new Set());
    setWrongItems(new Set());
    setCompleted(false);
    setScore(0);
    setListeningWord(null);
  }, [state.currentWorld, state.currentLevel]);

  const correctItems = sceneData?.items.filter(i => i.belongs) ?? [];
  const totalCorrect = correctItems.length;

  const handleItemClick = useCallback((item: typeof correctItems[0]) => {
    if (completed || revealed.has(item.word)) return;

    if (item.belongs) {
      playCorrect();
      setSelected(prev => new Set(prev).add(item.word));
      setRevealed(prev => new Set(prev).add(item.word));
      setScore(s => s + 1);

      const newCount = selected.size + 1;
      if (newCount >= totalCorrect) {
        setTimeout(() => {
          setCompleted(true);
          playLevelComplete();
        }, 600);
      }
    } else {
      playWrong();
      setWrongItems(prev => new Set(prev).add(item.word));
      setTimeout(() => {
        setWrongItems(prev => {
          const next = new Set(prev);
          next.delete(item.word);
          return next;
        });
      }, 1200);
    }
  }, [completed, revealed, selected.size, totalCorrect, playCorrect, playWrong, playLevelComplete]);

  const handleListenClick = useCallback((word: string) => {
    cancelSpeech();
    speakWord(word);
    setListeningWord(word);
    setTimeout(() => setListeningWord(null), 1500);
  }, []);

  const handleFinish = useCallback(() => {
    const stars = score >= totalCorrect ? 3 : score >= totalCorrect * 0.7 ? 2 : score >= totalCorrect * 0.4 ? 1 : 0;
    dispatch({
      type: 'COMPLETE_LEVEL',
      result: {
        worldId: state.currentWorld!,
        levelIndex: state.currentLevel,
        stars,
        correct: score,
        total: totalCorrect,
        time: 0,
      },
    });
  }, [score, totalCorrect, state.currentWorld, state.currentLevel, dispatch]);

  if (!sceneData) {
    return <div>Scene not found</div>;
  }

  const shuffledItems = [...sceneData.items];

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, #FFF0F5 0%, #FFE4F0 40%, #E3F2FD 100%)',
    }}>
      <FloatingElements elements={['🎯', '✨', '🌟', '🎀', '💖']} count={10} />

      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          width: '100%', padding: 'clamp(10px, 2.5vh, 14px) clamp(14px, 4vw, 20px) clamp(8px, 2vh, 10px)',
          background: 'linear-gradient(135deg, rgba(66,165,245,0.9), rgba(33,150,243,0.9))',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(33,150,243,0.3)', zIndex: 2,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'daySchedule' })}
          style={{
            background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%',
            width: 'clamp(30px, 8vw, 36px)', height: 'clamp(30px, 8vw, 36px)', fontSize: 'clamp(14px, 4vw, 18px)', cursor: 'pointer', color: 'white',
          }}
        >
          ←
        </motion.button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(12px, 3.5vw, 15px)', color: 'white', fontWeight: 800 }}>
            🎯 Τι ταιριάζει; / What belongs?
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)' }}>
            {sceneData.sceneEmoji} {sceneData.sceneNameGreek}
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.3)', borderRadius: '12px',
          padding: '4px 10px', fontSize: '13px', color: 'white', fontWeight: 700,
        }}>
          {score}/{totalCorrect}
        </div>
      </motion.div>

      {/* Main content: scene on left/top, items on right/bottom */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: 'clamp(8px, 2vh, 12px)', gap: 'clamp(8px, 2vh, 12px)', overflowY: 'auto', zIndex: 1,
      }}>

        {/* Scene card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: sceneData.sceneBackground,
            borderRadius: '20px', padding: 'clamp(14px, 3.5vh, 20px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            border: '3px solid rgba(255,255,255,0.5)',
            boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
            minHeight: '120px',
          }}
        >
          <div style={{ fontSize: 'clamp(30px, 10vw, 40px)' }}>{sceneData.sceneEmoji}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(14px, 4vw, 18px)', color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
            {sceneData.sceneName}
          </div>
          <PeppaCharacter mood={completed ? 'excited' : 'teaching'} size="small" equippedItems={state.progress.equippedItems} />
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-body)' }}>
            {completed ? 'Μπράβο! Τα βρήκες όλα!' : 'Πάτα τα αντικείμενα που ταιριάζουν!'}
          </div>
        </motion.div>

        {/* Items grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(8px, 2.5vw, 10px)',
          maxWidth: 'min(400px, 100%)', margin: '0 auto', width: '100%',
        }}>
          {shuffledItems.map((item, i) => {
            const isCorrectlySelected = revealed.has(item.word);
            const isWrong = wrongItems.has(item.word);
            const isListening = listeningWord === item.word;

            return (
              <motion.div
                key={item.word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
              >
                <motion.button
                  whileHover={!isCorrectlySelected ? { scale: 1.04 } : {}}
                  whileTap={!isCorrectlySelected ? { scale: 0.94 } : {}}
                  animate={isWrong ? { x: [-4, 4, -4, 4, 0] } : {}}
                  transition={isWrong ? { duration: 0.4 } : {}}
                  onClick={() => isCorrectlySelected ? handleListenClick(item.word) : handleItemClick(item)}
                  style={{
                    width: '100%',
                    padding: 'clamp(10px, 2.5vh, 14px) clamp(8px, 2vw, 10px)',
                    background: isCorrectlySelected
                      ? 'linear-gradient(135deg, #4CAF50, #66BB6A)'
                      : isWrong
                        ? 'linear-gradient(135deg, #FF5252, #FF8A80)'
                        : 'rgba(255,255,255,0.9)',
                    border: isCorrectlySelected
                      ? '3px solid #388E3C'
                      : isWrong
                        ? '3px solid #D32F2F'
                        : '2px solid rgba(33,150,243,0.3)',
                    borderRadius: '16px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    cursor: 'pointer',
                    boxShadow: isCorrectlySelected
                      ? '0 4px 16px rgba(76,175,80,0.4)'
                      : '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <span style={{ fontSize: 'clamp(24px, 8vw, 32px)' }}>{item.emoji}</span>
                  <span style={{
                    fontSize: '13px', fontFamily: 'var(--font-heading)',
                    color: isCorrectlySelected ? 'white' : isWrong ? 'white' : '#333',
                    fontWeight: 700,
                  }}>
                    {item.word}
                  </span>
                  {isCorrectlySelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: isListening ? 1.3 : 1 }}
                      style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}
                    >
                      🔊 Tap to hear!
                    </motion.span>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Completed */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                borderRadius: '24px', padding: '20px', textAlign: 'center',
                color: 'white', boxShadow: '0 8px 30px rgba(255,215,0,0.5)',
                margin: '8px auto',
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '6px' }}>🌟🌟🌟</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800 }}>
                ΤΕΛΕΙΑ! PERFECT!
              </div>
              <div style={{ fontSize: '13px', marginTop: '4px', opacity: 0.9 }}>
                Πάτα τα πράσινα για να ακούσεις τις λέξεις!
              </div>
              <div style={{ marginTop: '16px' }}>
                <Button onClick={handleFinish} variant="gold" size="large">
                  Next ➡️
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
